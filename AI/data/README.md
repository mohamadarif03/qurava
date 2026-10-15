# Arabic Sign Language (ArSL) Augmented Dataset

Dataset ini bersumber dari Kaggle:
- **URL Kaggle**: https://www.kaggle.com/datasets/sabribelmadoui/arabic-sign-language-augmented-dataset
- **Author**: Sabri Belmadoui
- **Total Citra**: 15.086 gambar (Training: 13.926, Validation: 870, Testing: 290)
- **Ukuran File**: ±917 MB (ZIP)
- **Format**: Gambar 416x416 piksel beranotasi 32 kelas bahasa isyarat Arab (ArSL)

---

## Hubungan dengan Model di Qurava

Dataset ini merupakan dataset dasar yang digunakan untuk melatih model:
- **Model Target**: `public/models/handsign_svm.onnx`
- **Label Target**: `public/models/label_map.json`
- **Feature Pipeline**: `src/services/handsign-service.ts`

### 32 Kelas dalam Dataset:
1. `aleff` (Alif)
2. `bb` (Ba)
3. `ta` / `toot` (Ta)
4. `thaa` (Tsa)
5. `jeem` (Jim)
6. `ha` / `haa` (Ha)
7. `khaa` (Kha)
8. `dal` (Dal)
9. `thal` (Dzal)
10. `ra` (Ra)
11. `zay` (Zai)
12. `seen` (Sin)
13. `sheen` (Syin)
14. `saad` (Shad)
15. `dhad` (Dhad)
16. `taa` (Tha)
17. `dha` (Zha)
18. `ain` (Ain)
19. `ghain` (Ghain)
20. `fa` (Fa)
21. `gaaf` (Qaf)
22. `kaaf` (Kaf)
23. `laam` (Lam)
24. `meem` (Mim)
25. `nun` (Nun)
26. `waw` (Waw)
27. `ya` / `yaa` (Ya)
28. `al`, `la` (Kombinasi khusus)

---

## Panduan Mengunduh Dataset

Karena Kaggle membatasi unduhan otomatis tanpa sesi login/API Key, Anda dapat mengunduh dataset ini dengan salah satu cara berikut:

### Cara 1: Unduh Manual via Browser (Direkomendasikan)
1. Buka [Halaman Kaggle Dataset](https://www.kaggle.com/datasets/sabribelmadoui/arabic-sign-language-augmented-dataset).
2. Login ke akun Kaggle Anda.
3. Klik tombol **Download** di kanan atas (menghasilkan file `.zip` ~917 MB).
4. Ekstrak isi ZIP tersebut ke dalam folder ini (`dataset/`).

### Cara 2: Unduh via Kaggle CLI
Pastikan Anda sudah memiliki file API token `kaggle.json` di `~/.kaggle/kaggle.json`:
```bash
pip install kaggle
kaggle datasets download -d sabribelmadoui/arabic-sign-language-augmented-dataset -p ./dataset --unzip
```
