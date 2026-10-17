
import json
import logging
import time
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.svm import SVC


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Konstanta path (relatif terhadap lokasi script ini)
# ---------------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"

FEATURE_COLS = [f"f{i}" for i in range(78)]

# ---------------------------------------------------------------------------
# Parameter GridSearch
# ---------------------------------------------------------------------------

PARAM_GRID = {
    "svm__C": [0.1, 1, 10, 50, 100],
    "svm__kernel": ["rbf", "linear"],
    "svm__gamma": ["scale", "auto"],
    "svm__class_weight": [None, "balanced"],
}

CV_FOLDS = 5
RANDOM_STATE = 42


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------


def load_csv(path: Path, split_name: str) -> pd.DataFrame:
    """Load feature CSV dan validasi kolom yang dibutuhkan."""
    log.info(f"Loading {split_name} data dari: {path}")
    if not path.exists():
        raise FileNotFoundError(
            f"File CSV tidak ditemukan: {path}\n"
            "Pastikan sudah menjalankan 1_extract_features.py terlebih dahulu."
        )
    df = pd.read_csv(path)
    log.info(f"  → {len(df):,} baris, {df['label'].nunique()} kelas")
    return df


def plot_confusion_matrix(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: list[str],
    output_path: Path,
) -> None:
    """
    Buat dan simpan heatmap confusion matrix menggunakan seaborn.

    Parameters
    ----------
    y_true       : Label ground truth (integer)
    y_pred       : Label hasil prediksi (integer)
    class_names  : Nama kelas sesuai urutan indeks
    output_path  : Path untuk menyimpan gambar PNG
    """
    cm = confusion_matrix(y_true, y_pred)
    cm_norm = cm.astype(float) / cm.sum(axis=1, keepdims=True)  # normalisasi per baris

    fig, axes = plt.subplots(1, 2, figsize=(22, 10))

    # --- Raw count ---
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        ax=axes[0],
        linewidths=0.4,
    )
    axes[0].set_title("Confusion Matrix (Count)", fontsize=14, fontweight="bold")
    axes[0].set_xlabel("Predicted Label", fontsize=11)
    axes[0].set_ylabel("True Label", fontsize=11)
    axes[0].tick_params(axis="x", rotation=45)
    axes[0].tick_params(axis="y", rotation=0)

    sns.heatmap(
        cm_norm,
        annot=True,
        fmt=".2f",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        ax=axes[1],
        linewidths=0.4,
        vmin=0,
        vmax=1,
    )
    axes[1].set_title("Confusion Matrix (Normalized per Row)", fontsize=14, fontweight="bold")
    axes[1].set_xlabel("Predicted Label", fontsize=11)
    axes[1].set_ylabel("True Label", fontsize=11)
    axes[1].tick_params(axis="x", rotation=45)
    axes[1].tick_params(axis="y", rotation=0)

    plt.suptitle("SVM Handsign Classification — Test Set", fontsize=16, fontweight="bold", y=1.01)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches="tight")
    plt.close()
    log.info(f"Confusion matrix disimpan ke: {output_path}")


def main() -> None:
    """Fungsi utama: load data → GridSearch → evaluasi → simpan artefak."""

    start_total = time.time()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # -----------------------------------------------------------------------
    # 1. Load data
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 1: Load dan persiapan data")
    log.info("=" * 60)

    df_train = load_csv(DATA_DIR / "features_train.csv", "train")
    df_valid = load_csv(DATA_DIR / "features_valid.csv", "valid")
    df_test = load_csv(DATA_DIR / "features_test.csv", "test")

    df_trainval = pd.concat([df_train, df_valid], ignore_index=True)
    log.info(f"Total train+valid: {len(df_trainval):,} sampel")
    log.info(f"Total test       : {len(df_test):,} sampel")

    X_train = df_trainval[FEATURE_COLS].values.astype(np.float32)
    X_test = df_test[FEATURE_COLS].values.astype(np.float32)
    y_train_raw = df_trainval["label"].values
    y_test_raw = df_test["label"].values

    # -----------------------------------------------------------------------
    # 2. Encode label string → integer
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 2: Encode label")
    log.info("=" * 60)

    le = LabelEncoder()
  
    all_labels = np.concatenate([y_train_raw, y_test_raw])
    le.fit(all_labels)

    y_train = le.transform(y_train_raw)
    y_test = le.transform(y_test_raw)

    class_names = list(le.classes_)
    n_classes = len(class_names)
    log.info(f"Kelas ({n_classes}): {class_names}")

    # -----------------------------------------------------------------------
    # 3. Definisi pipeline & GridSearchCV
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 3: GridSearchCV (ini membutuhkan waktu beberapa menit...)")
    log.info("=" * 60)

    scaler = StandardScaler()

    svc = SVC(probability=True, random_state=RANDOM_STATE)

    pipeline = Pipeline(steps=[("scaler", scaler), ("svm", svc)])

    cv = StratifiedKFold(n_splits=CV_FOLDS, shuffle=True, random_state=RANDOM_STATE)

    grid_search = GridSearchCV(
        estimator=pipeline,
        param_grid=PARAM_GRID,
        scoring="f1_macro",
        cv=cv,
        n_jobs=-1,
        verbose=2,
        refit=True,  # refit pada seluruh train data dengan best params
    )

    log.info(f"Parameter grid: {PARAM_GRID}")
    log.info(f"Total kombinasi: {len(list(__import__('itertools').product(*PARAM_GRID.values())))}")

    t0 = time.time()
    grid_search.fit(X_train, y_train)
    elapsed_gs = time.time() - t0

    log.info(f"GridSearch selesai dalam {elapsed_gs:.1f} detik ({elapsed_gs/60:.1f} menit)")
    log.info(f"Best CV F1-macro : {grid_search.best_score_:.4f}")
    log.info(f"Best params      : {grid_search.best_params_}")

    best_pipeline = grid_search.best_estimator_

   
    log.info("=" * 60)
    log.info("STEP 4: Evaluasi pada test set")
    log.info("=" * 60)

    y_pred = best_pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average="macro")

    log.info(f"Test Accuracy : {acc:.4f}  ({acc*100:.2f}%)")
    log.info(f"Test F1-macro : {f1_macro:.4f}")

    report_str = classification_report(y_test, y_pred, target_names=class_names)
    print("\nClassification Report (Test Set):")
    print(report_str)

    # Per-class metrics untuk JSON
    report_dict = classification_report(
        y_test, y_pred, target_names=class_names, output_dict=True
    )

    # -----------------------------------------------------------------------
    # 5. Simpan confusion matrix
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 5: Simpan confusion matrix")
    log.info("=" * 60)

    plot_confusion_matrix(
        y_test, y_pred, class_names, output_path=OUTPUT_DIR / "confusion_matrix.png"
    )

    # -----------------------------------------------------------------------
    # 6. Simpan artefak model
    # -----------------------------------------------------------------------
    log.info("=" * 60)
    log.info("STEP 6: Simpan model dan artefak")
    log.info("=" * 60)

    # 6a. Pipeline (scaler + SVM)
    pipeline_path = OUTPUT_DIR / "pipeline_svm.pkl"
    joblib.dump(best_pipeline, pipeline_path)
    log.info(f"Pipeline disimpan ke: {pipeline_path}")

    # 6b. Label encoder
    le_path = OUTPUT_DIR / "label_encoder.pkl"
    joblib.dump(le, le_path)
    log.info(f"LabelEncoder disimpan ke: {le_path}")

    # 6c. Training results JSON
    best_params_clean = {
        k.replace("svm__", ""): v for k, v in grid_search.best_params_.items()
    }

    results = {
        "model": "SVC",
        "best_params": best_params_clean,
        "cv_folds": CV_FOLDS,
        "cv_scoring": "f1_macro",
        "best_cv_score": round(float(grid_search.best_score_), 6),
        "cv_score": round(float(grid_search.best_score_), 6),
        "test_accuracy": round(float(acc), 6),
        "accuracy": round(float(acc), 6),
        "test_f1_macro": round(float(f1_macro), 6),
        "f1_macro": round(float(f1_macro), 6),
        "n_classes": n_classes,
        "class_names": class_names,
        "n_train_samples": len(X_train),
        "n_test_samples": len(X_test),
        "gridsearch_elapsed_seconds": round(elapsed_gs, 1),
        "per_class_metrics": {
            k: {
                "precision": round(v["precision"], 4),
                "recall": round(v["recall"], 4),
                "f1-score": round(v["f1-score"], 4),
                "support": int(v["support"]),
            }
            for k, v in report_dict.items()
            if k in class_names
        },
    }

    results_path = OUTPUT_DIR / "training_results.json"
    with results_path.open("w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    log.info(f"Training results disimpan ke: {results_path}")

    # -----------------------------------------------------------------------
    # Ringkasan akhir
    # -----------------------------------------------------------------------
    elapsed_total = time.time() - start_total
    log.info("=" * 60)
    log.info("TRAINING SELESAI")
    log.info("=" * 60)
    log.info(f"Total waktu    : {elapsed_total:.1f} detik ({elapsed_total/60:.1f} menit)")
    log.info(f"Test Accuracy  : {acc*100:.2f}%")
    log.info(f"Test F1-macro  : {f1_macro:.4f}")
    log.info(f"Best CV score  : {grid_search.best_score_:.4f}")
    log.info(f"Best params    : {best_params_clean}")
    log.info("-" * 60)
    log.info("Artefak yang dihasilkan:")
    log.info(f"  ✓ {pipeline_path}")
    log.info(f"  ✓ {le_path}")
    log.info(f"  ✓ {OUTPUT_DIR / 'confusion_matrix.png'}")
    log.info(f"  ✓ {results_path}")
    log.info("-" * 60)


if __name__ == "__main__":
    main()
