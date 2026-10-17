"""
  python 3_export_onnx.py
"""

import json
import logging
import shutil
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

# skl2onnx untuk konversi scikit-learn → ONNX
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# onnxruntime untuk validasi
import onnxruntime as rt

# ---------------------------------------------------------------------------
# Konfigurasi logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Konstanta path
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"

# Path tujuan di folder public web (dua level di atas AI/modelling/)
PUBLIC_MODELS_DIR = BASE_DIR.parent.parent / "public" / "models"

FEATURE_COLS = [f"f{i}" for i in range(78)]
N_FEATURES = 78
N_VALIDATION_SAMPLES = 5  # jumlah sampel untuk validasi sklearn vs onnx


# ---------------------------------------------------------------------------
# Helper: validasi ONNX inference
# ---------------------------------------------------------------------------


def validate_onnx(
    onnx_path: Path,
    X_sample: np.ndarray,
    y_sklearn: np.ndarray,
    label_encoder,
) -> bool:
    """
    Load model ONNX dan jalankan inference pada X_sample.
    Bandingkan hasil prediksi sklearn vs onnxruntime.

    Parameters
    ----------
    onnx_path      : Path ke file .onnx
    X_sample       : Array float32 shape [N, 78]
    y_sklearn      : Prediksi integer dari sklearn pipeline
    label_encoder  : LabelEncoder untuk decode integer → string

    Returns
    -------
    True jika semua prediksi cocok, False jika ada perbedaan.
    """
    log.info(f"Validasi ONNX: load dari {onnx_path}")

    sess = rt.InferenceSession(
        str(onnx_path),
        providers=["CPUExecutionProvider"],
    )

    # Periksa nama input/output
    input_name = sess.get_inputs()[0].name
    output_names = [o.name for o in sess.get_outputs()]
    log.info(f"  ONNX input  : {input_name}  shape={sess.get_inputs()[0].shape}")
    log.info(f"  ONNX outputs: {output_names}")

    if input_name != "float_input":
        log.warning(
            f"  [WARN] Nama input ONNX adalah '{input_name}', diharapkan 'float_input'."
            " Pastikan web menggunakan nama yang benar."
        )

    # Jalankan inference
    onnx_results = sess.run(output_names, {input_name: X_sample})

    # Cari output label dan probabilities
    label_output = None
    prob_output = None
    for name, result in zip(output_names, onnx_results):
        if "label" in name.lower():
            label_output = result
        if "prob" in name.lower():
            prob_output = result

    if label_output is None:
        log.error("  Tidak ditemukan output 'label' pada model ONNX!")
        return False

    # skl2onnx kadang menghasilkan label sebagai flat array atau nested
    if hasattr(label_output, "flatten"):
        onnx_labels = label_output.flatten()
    else:
        onnx_labels = np.array(label_output).flatten()

    log.info(f"\n{'='*60}")
    log.info(f"{'PERBANDINGAN PREDIKSI sklearn vs ONNX':^60}")
    log.info(f"{'='*60}")
    log.info(f"  {'#':<4} {'sklearn_int':<14} {'onnx_int':<12} {'sklearn_label':<16} {'onnx_label':<16} {'Match'}")
    log.info(f"  {'-'*70}")

    all_match = True
    for i, (sk_int, on_int) in enumerate(zip(y_sklearn, onnx_labels)):
        sk_label = label_encoder.inverse_transform([int(sk_int)])[0]
        on_label = label_encoder.inverse_transform([int(on_int)])[0]
        match = "✓" if sk_int == on_int else "✗ MISMATCH"
        if sk_int != on_int:
            all_match = False
        log.info(f"  {i:<4} {int(sk_int):<14} {int(on_int):<12} {sk_label:<16} {on_label:<16} {match}")

    log.info(f"  {'-'*70}")

    if prob_output is not None:
        log.info(f"\n  Contoh probabilities (shape={np.array(prob_output).shape}):")
        # prob_output bisa berupa list of dict (skl2onnx ZipMap) atau array
        if isinstance(prob_output, list) and isinstance(prob_output[0], dict):
            for i, prob_dict in enumerate(prob_output[:2]):
                top_k = sorted(prob_dict.items(), key=lambda x: x[1], reverse=True)[:3]
                top_str = ", ".join(f"cls{k}:{v:.3f}" for k, v in top_k)
                log.info(f"    Sample {i}: top-3 = [{top_str}]")
        else:
            prob_arr = np.array(prob_output)
            for i in range(min(2, len(prob_arr))):
                top_idx = np.argsort(prob_arr[i])[::-1][:3]
                top_str = ", ".join(f"cls{j}:{prob_arr[i,j]:.3f}" for j in top_idx)
                log.info(f"    Sample {i}: top-3 = [{top_str}]")

    if all_match:
        log.info("\n  ✓ Semua prediksi cocok antara sklearn dan ONNX!")
    else:
        log.warning("\n  ✗ Ada prediksi yang tidak cocok! Cek konfigurasi konversi.")

    return all_match


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    """Fungsi utama: load artefak → konversi ONNX → validasi → simpan → (opsional) deploy."""

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # -----------------------------------------------------------------------
    # 1. Load pipeline dan label encoder
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 1: Load artefak model")
    log.info("=" * 60)

    pipeline_path = OUTPUT_DIR / "pipeline_svm.pkl"
    le_path = OUTPUT_DIR / "label_encoder.pkl"

    if not pipeline_path.exists():
        raise FileNotFoundError(
            f"Pipeline tidak ditemukan: {pipeline_path}\n"
            "Jalankan dulu: python 2_train_tuning.py"
        )
    if not le_path.exists():
        raise FileNotFoundError(
            f"LabelEncoder tidak ditemukan: {le_path}\n"
            "Jalankan dulu: python 2_train_tuning.py"
        )

    pipeline = joblib.load(pipeline_path)
    le = joblib.load(le_path)

    class_names: list[str] = list(le.classes_)
    n_classes = len(class_names)
    log.info(f"Pipeline loaded: {pipeline.named_steps}")
    log.info(f"Kelas ({n_classes}): {class_names}")

    # -----------------------------------------------------------------------
    # 2. Konversi ke ONNX
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 2: Konversi Pipeline → ONNX")
    log.info("=" * 60)

    # Nama input HARUS 'float_input' agar kompatibel dengan handsign-service.ts
    initial_type = [("float_input", FloatTensorType([None, N_FEATURES]))]

    log.info(f"initial_type = {initial_type}")
    log.info("Menjalankan convert_sklearn ...")

    onnx_model = convert_sklearn(
        pipeline,
        name="HandsignSVM",
        initial_types=initial_type,
        options={type(pipeline.named_steps["svm"]): {"zipmap": False}},
        # zipmap=False → output probabilities sebagai float32 array, bukan dict
        # Lebih efisien untuk onnxruntime di browser/Node
    )

    onnx_path = OUTPUT_DIR / "handsign_svm.onnx"
    with onnx_path.open("wb") as f:
        f.write(onnx_model.SerializeToString())

    file_size_kb = onnx_path.stat().st_size / 1024
    log.info(f"ONNX model disimpan ke: {onnx_path}  ({file_size_kb:.1f} KB)")

    # -----------------------------------------------------------------------
    # 3. Generate label_map.json
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 3: Generate label_map.json")
    log.info("=" * 60)

    # label_map[i] = nama kelas dengan indeks LabelEncoder ke-i
    # Label diurutkan secara alfabetis oleh LabelEncoder secara default
    label_map: list[str] = class_names  # le.classes_ sudah terurut alfabet

    label_map_path = OUTPUT_DIR / "label_map.json"
    with label_map_path.open("w", encoding="utf-8") as f:
        json.dump(label_map, f, indent=2, ensure_ascii=False)

    log.info(f"label_map.json disimpan ke: {label_map_path}")
    log.info(f"Isi label_map ({len(label_map)} entri):")
    for idx, name in enumerate(label_map):
        log.info(f"  [{idx:2d}] {name}")

    # -----------------------------------------------------------------------
    # 4. Validasi ONNX
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 4: Validasi ONNX inference")
    log.info("=" * 60)

    # Ambil sampel dari test CSV (jika ada), atau buat data dummy
    test_csv = DATA_DIR / "features_test.csv"
    if test_csv.exists():
        df_test = pd.read_csv(test_csv)
        # Ambil N_VALIDATION_SAMPLES sampel, satu per kelas jika memungkinkan
        sample_rows = (
            df_test.groupby("label")
            .first()
            .reset_index()
            .head(N_VALIDATION_SAMPLES)
        )
        X_sample = sample_rows[FEATURE_COLS].values.astype(np.float32)
        y_sklearn = pipeline.predict(X_sample)
        log.info(f"Menggunakan {len(X_sample)} sampel dari test set untuk validasi")
    else:
        log.warning("Test CSV tidak ditemukan, menggunakan data dummy untuk validasi.")
        rng = np.random.default_rng(42)
        X_sample = rng.standard_normal((N_VALIDATION_SAMPLES, N_FEATURES)).astype(np.float32)
        y_sklearn = pipeline.predict(X_sample)

    all_match = validate_onnx(onnx_path, X_sample, y_sklearn, le)

    if not all_match:
        log.warning(
            "PERINGATAN: Ada ketidakcocokan prediksi sklearn vs ONNX. "
            "Periksa opsi konversi sebelum deploy."
        )

    # -----------------------------------------------------------------------
    # 5. (Opsional) Salin ke public/models/
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 5: Deploy ke public/models/")
    log.info("=" * 60)

    log.info(f"Target direktori: {PUBLIC_MODELS_DIR}")

    answer = input(
        "\nSalin handsign_svm.onnx dan label_map.json ke public/models/? [Y/n]: "
    ).strip().lower()

    if answer in ("", "y", "yes"):
        PUBLIC_MODELS_DIR.mkdir(parents=True, exist_ok=True)

        dest_onnx = PUBLIC_MODELS_DIR / "handsign_svm.onnx"
        dest_map = PUBLIC_MODELS_DIR / "label_map.json"

        shutil.copy2(onnx_path, dest_onnx)
        shutil.copy2(label_map_path, dest_map)

        log.info(f"  ✓ Disalin: {dest_onnx}")
        log.info(f"  ✓ Disalin: {dest_map}")
    else:
        log.info("  Skip. File tidak disalin ke public/models/.")
        log.info(f"  Salin manual jika diperlukan:")
        log.info(f"    {onnx_path}")
        log.info(f"    {label_map_path}")

    # -----------------------------------------------------------------------
    # Ringkasan akhir
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("EXPORT ONNX SELESAI")
    log.info("=" * 60)
    log.info(f"  ONNX model : {onnx_path}  ({file_size_kb:.1f} KB)")
    log.info(f"  Label map  : {label_map_path}  ({n_classes} kelas)")
    log.info(f"  Validasi   : {'✓ PASS' if all_match else '✗ MISMATCH — perlu dicek'}")
    log.info("")
    log.info("Model siap digunakan di web Qurava melalui onnxruntime-web.")


if __name__ == "__main__":
    main()
