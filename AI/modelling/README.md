# AI/modelling — Pipeline Training & Export Model SVM Handsign

Dokumentasi ini menjelaskan cara melatih, mengevaluasi, dan mengekspor model SVM untuk klasifikasi **Arabic Sign Language (ArSL)** yang digunakan pada web Qurava.

---

## Deskripsi Proyek

Model ini mengklasifikasikan **28 huruf Arab** dari gestur tangan menggunakan fitur yang diekstrak dari **MediaPipe Hands** (78 fitur float32 per frame). Model akhir diekspor ke format **ONNX** agar bisa dijalankan di browser melalui `onnxruntime-web`.

### Arsitektur Pipeline

```
Gambar YOLO → MediaPipe (21 landmark) → 78 fitur → StandardScaler → SVM → Prediksi kelas
```

---

## Struktur Folder

```
AI/modelling/
├── 1_extract_features.py   # Ekstraksi fitur dari dataset YOLO → CSV
├── 2_train_tuning.py       # Training + GridSearchCV SVM
├── 3_export_onnx.py        # Konversi Pipeline → ONNX + generate label_map.json
├── requirements.txt        # Dependensi Python
├── README.md               # Dokumentasi ini
│
├── data/                   # Feature CSV (dihasilkan oleh step 1)
│   ├── features_train.csv
│   ├── features_valid.csv
│   └── features_test.csv
│
└── output/                 # Artefak hasil training (dihasilkan oleh step 2 & 3)
    ├── pipeline_svm.pkl        # Pipeline sklearn (scaler + SVM)
    ├── label_encoder.pkl       # LabelEncoder (string ↔ integer)
    ├── confusion_matrix.png    # Confusion matrix test set
    ├── training_results.json   # Ringkasan hasil training
    ├── handsign_svm.onnx       # Model ONNX siap deploy
    └── label_map.json          # Peta indeks → nama kelas
```

---

## Langkah-Langkah Menjalankan Pipeline

> **Penting:** Semua perintah dijalankan dari direktori `AI/modelling/`.

### Step 0 — Install Requirements

```bash
cd AI/modelling
pip install -r requirements.txt
```

### Step 1 — Ekstraksi Fitur

> **Prasyarat:** Dataset YOLO sudah ada di `AI/data/Arabic Sign Language ArSL dataset/`

```bash
python 1_extract_features.py
```

Menghasilkan:
- `data/features_train.csv`
- `data/features_valid.csv`
- `data/features_test.csv`

Setiap baris CSV memiliki kolom: `f0, f1, ..., f77, label, split`.

### Step 2 — Training & Hyperparameter Tuning

```bash
python 2_train_tuning.py
```

Script ini akan:
1. Menggabungkan `features_train.csv` + `features_valid.csv` sebagai data latih
2. Menjalankan **GridSearchCV** (StratifiedKFold-5) dengan parameter grid:
   - `C`: `[0.1, 1, 10, 50, 100]`
   - `kernel`: `['rbf', 'linear']`
   - `gamma`: `['scale', 'auto']`
   - `class_weight`: `[None, 'balanced']`
3. Mengevaluasi model terbaik pada `features_test.csv`
4. Menyimpan artefak ke folder `output/`

> **Estimasi waktu:** 10–60 menit tergantung ukuran dataset dan spesifikasi mesin.

Menghasilkan:
- `output/pipeline_svm.pkl`
- `output/label_encoder.pkl`
- `output/confusion_matrix.png`
- `output/training_results.json`

### Step 3 — Export ke ONNX

```bash
python 3_export_onnx.py
```

Script ini akan:
1. Memuat `output/pipeline_svm.pkl` dan `output/label_encoder.pkl`
2. Mengkonversi ke ONNX dengan nama input tensor `float_input`
3. Menghasilkan `output/label_map.json`
4. Memvalidasi inferensi ONNX vs sklearn (harus cocok 100%)
5. Menanyakan apakah file ingin disalin ke `public/models/`

Menghasilkan:
- `output/handsign_svm.onnx`
- `output/label_map.json`

---

## Spesifikasi Model ONNX

| Properti       | Nilai                              |
|----------------|------------------------------------|
| Input tensor   | `float_input` — `float32[N, 78]`  |
| Output 1       | `label` — `int64[N]`              |
| Output 2       | `probabilities` — `float32[N, C]` |
| Jumlah kelas   | 28                                 |
| Framework      | scikit-learn → skl2onnx           |

---

## Mapping Label YOLO → Label Web

Dataset YOLO menggunakan **indeks integer** (0–27) sebagai kelas. Script `1_extract_features.py` memetakannya ke **nama huruf Arab** (string) yang digunakan di web.

| YOLO Index | Label Web | Huruf Arab |
|:----------:|-----------|:----------:|
| 0  | aleff  | ا |
| 1  | bb     | ب |
| 2  | ta     | ت |
| 3  | thaa   | ث |
| 4  | jeem   | ج |
| 5  | haa    | ح |
| 6  | khaa   | خ |
| 7  | dal    | د |
| 8  | thal   | ذ |
| 9  | ra     | ر |
| 10 | zay    | ز |
| 11 | seen   | س |
| 12 | sheen  | ش |
| 13 | saad   | ص |
| 14 | dhad   | ض |
| 15 | taa    | ط |
| 16 | dha    | ظ |
| 17 | ain    | ع |
| 18 | ghain  | غ |
| 19 | fa     | ف |
| 20 | gaaf   | ق |
| 21 | kaaf   | ك |
| 22 | laam   | ل |
| 23 | meem   | م |
| 24 | nun    | ن |
| 25 | ha     | ه |
| 26 | waw    | و |
| 27 | ya     | ي |

**Penting:** Indeks pada `label_map.json` **bukan** indeks YOLO. `label_map.json` menggunakan indeks `LabelEncoder` yang **diurutkan secara alfabetis**. Mapping ini dilakukan secara otomatis oleh `LabelEncoder.fit()`.

---

## Cara Menggunakan Model di Web Qurava

Model ONNX dikonsumsi oleh `handsign-service.ts` di frontend. Pastikan:

1. File `public/models/handsign_svm.onnx` dan `public/models/label_map.json` sudah tersedia (salin dari `output/`, atau jawab `Y` saat menjalankan `3_export_onnx.py`).

2. Nama input tensor pada service adalah `float_input` — sesuai dengan yang di-set saat konversi.

3. Alur prediksi di web:
   ```
   Webcam frame
     → MediaPipe Hands (21 landmark)
     → normalize + compute angles  (78 fitur)
     → ONNX Runtime (float_input tensor)
     → label index (int64)
     → label_map[index]  → nama huruf Arab
   ```

4. Output probabilitas (`probabilities`) dapat digunakan sebagai **confidence score** untuk menampilkan tingkat keyakinan model.

---

## Requirements

```
mediapipe==0.10.21
opencv-python==4.10.0.84
numpy>=1.24,<2.0
pandas>=2.0
scikit-learn>=1.4
skl2onnx>=1.17
onnxruntime>=1.18
onnx>=1.16
tqdm>=4.66
matplotlib>=3.8
seaborn>=0.13
joblib>=1.3
```

Install:
```bash
pip install -r requirements.txt
```

> **Catatan:** Untuk lingkungan yang terisolasi, disarankan menggunakan virtual environment:
> ```bash
> python -m venv .venv
> .venv\Scripts\activate   # Windows
> pip install -r requirements.txt
> ```
