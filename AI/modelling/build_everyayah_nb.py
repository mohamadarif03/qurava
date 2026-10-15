"""
build_everyayah_nb.py
=====================
Script untuk membuat file Jupyter Notebook:
notebooks/everyayah_whisper_exploration.ipynb
"""

import json
from pathlib import Path

root = Path(__file__).resolve().parent
nb_dir = root / "notebooks"
nb_dir.mkdir(exist_ok=True)

cells = []

# Title
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "# 📖 Eksplorasi Dataset Tarteel EveryAyah & Model Whisper Quran\n",
        "### Automatic Speech Recognition (ASR) untuk Al-Qur'an & Pelafalan Huruf - Qurava AI\n",
        "\n",
        "Notebook ini mendemonstrasikan:\n",
        "1. **Memuat Dataset Audio Quran**: `tarteel-ai/everyayah` dari Hugging Face.\n",
        "2. **Eksplorasi Fitur Audio**: Memeriksa gelombang suara (*waveform*), frekuensi sampling, qari, serta transkripsi teks Arab.\n",
        "3. **Memutar Audio di Notebook**: Menggunakan pemutar audio interaktif `IPython.display.Audio`.\n",
        "4. **Pengujian Transkripsi AI**: Menguji model **`tarteel-ai/whisper-base-ar-quran`** untuk mengenali audio bacaan dan mencocokkannya dengan teks ayat asli (*Ground Truth vs Prediction*).\n"
    ]
})

# Cell 1: Prerequisites & Installation
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 1. Persiapan Lingkungan & Pustaka Dependensi\n",
        "Jika belum terpasang, jalankan perintah instalasi berikut di terminal atau sel notebook ini:\n",
        "\n",
        "```bash\n",
        "pip install datasets transformers torch torchaudio soundfile librosa\n",
        "```\n"
    ]
})

# Cell 2: Imports
cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "import os\n",
        "import numpy as np\n",
        "import pandas as pd\n",
        "import matplotlib.pyplot as plt\n",
        "import IPython.display as ipd\n",
        "\n",
        "from datasets import load_dataset\n",
        "from transformers import pipeline\n",
        "\n",
        "print('✅ Semua library berhasil di-import!')\n"
    ],
    "outputs": []
})

# Cell 3: Load Dataset Explanation & Code
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 2. Memuat Dataset `tarteel-ai/everyayah`\n",
        "\n",
        "> 💡 **Tips Praktis (Streaming Mode):**\n",
        "> Dataset `tarteel-ai/everyayah` berisi puluhan ribu rekaman audio dari berbagai qari dunia dengan ukuran total puluhan gigabyte.\n",
        "> Dengan menggunakan opsi **`streaming=True`**, kita dapat langsung mengakses dan memutar sampel audio **seketika** tanpa harus menunggu unduhan gigabyte data ke penyimpanan lokal.\n"
    ]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "print('⏳ Menghubungkan ke Hugging Face Dataset: tarteel-ai/everyayah (Streaming Mode)...')\n",
        "\n",
        "# Memuat dataset secara streaming agar hemat kuota dan memori disk\n",
        "ds = load_dataset('tarteel-ai/everyayah', split='train', streaming=True)\n",
        "\n",
        "print('✅ Berhasil terhubung ke dataset EveryAyah!')\n"
    ],
    "outputs": []
})

# Cell 4: Inspect Sample
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 3. Eksplorasi Metadata & Sampel Pertama\n",
        "Mari kita ambil sampel rekaman pertama dan melihat data apa saja yang tersimpan di dalamnya.\n"
    ]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "# Ambil sampel pertama menggunakan iterator\n",
        "dataset_iter = iter(ds)\n",
        "sample = next(dataset_iter)\n",
        "\n",
        "print('=== INFORMASI SAMPEL AUDIO ===')\n",
        "print(f'Surah Index     : {sample.get(\"surah\", sample.get(\"surah_number\", \"N/A\"))}')\n",
        "print(f'Ayah Index      : {sample.get(\"ayah\", sample.get(\"ayah_number\", \"N/A\"))}')\n",
        "print(f'Nama Qari       : {sample.get(\"reciter\", sample.get(\"reciter_name\", \"N/A\"))}')\n",
        "print(f'Teks Arab       : {sample.get(\"text\", sample.get(\"ayah_text\", \"N/A\"))}')\n",
        "print(f'Sample Rate     : {sample[\"audio\"][\"sampling_rate\"]} Hz')\n",
        "print(f'Total Titik Data: {len(sample[\"audio\"][\"array\"]):,} sinyal audio')\n",
        "durasi = len(sample[\"audio\"][\"array\"]) / sample[\"audio\"][\"sampling_rate\"]\n",
        "print(f'Estimasi Durasi : {durasi:.2f} detik')\n"
    ],
    "outputs": []
})

# Cell 5: Audio Player
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 4. Memutar Audio Rekaman Bacaan\n",
        "Jalankan sel berikut untuk mendengarkan langsung rekaman suara qari melalui pemutar audio interaktif:\n"
    ]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "audio_array = sample['audio']['array']\n",
        "sr = sample['audio']['sampling_rate']\n",
        "\n",
        "# Visualisasi Gelombang Suara (Waveform)\n",
        "plt.figure(figsize=(12, 3), dpi=100)\n",
        "time_axis = np.linspace(0, len(audio_array) / sr, num=len(audio_array))\n",
        "plt.plot(time_axis, audio_array, color='#1885A4', linewidth=0.6)\n",
        "plt.title(f'Waveform Audio Bacaan Al-Qur\\'an ({sample.get(\"reciter\", \"Qari\")})', fontsize=11, fontweight='bold')\n",
        "plt.xlabel('Waktu (detik)', fontsize=10)\n",
        "plt.ylabel('Amplitudo', fontsize=10)\n",
        "plt.grid(True, linestyle=':', alpha=0.5)\n",
        "plt.tight_layout()\n",
        "plt.show()\n",
        "\n",
        "# Pemutar Audio Interaktif\n",
        "ipd.Audio(audio_array, rate=sr)\n"
    ],
    "outputs": []
})

# Cell 6: Load Whisper Model
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 5. Memuat Model AI: `tarteel-ai/whisper-base-ar-quran`\n",
        "Sekarang kita siapkan model Speech-to-Text Whisper yang telah di-*fine-tune* oleh Tarteel AI untuk mengenali teks Al-Qur'an.\n"
    ]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "print('⏳ Mengunduh & memuat model tarteel-ai/whisper-base-ar-quran...')\n",
        "\n",
        "# pipeline ASR otomatis\n",
        "# device=-1 untuk CPU, device=0 untuk GPU NVIDIA CUDA\n",
        "asr_pipe = pipeline(\n",
        "    'automatic-speech-recognition',\n",
        "    model='tarteel-ai/whisper-base-ar-quran',\n",
        "    device=-1\n",
        ")\n",
        "\n",
        "print('✅ Model Tarteel Whisper siap digunakan!')\n"
    ],
    "outputs": []
})

# Cell 7: Speech Recognition Inference Test
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 6. Uji Transkripsi: Membandingkan Teks Asli vs Prediksi AI\n",
        "Kita masukkan sinyal audio dari dataset EveryAyah ke model Whisper untuk melihat apakah model mampu menebak teks ayat Al-Qur'an dengan benar.\n"
    ]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "print('⏳ Mentranskripsi audio rekaman...')\n",
        "\n",
        "# Whisper menerima input dictionary audio {'array': ..., 'sampling_rate': ...}\n",
        "prediction = asr_pipe({\n",
        "    'array': sample['audio']['array'],\n",
        "    'sampling_rate': sample['audio']['sampling_rate']\n",
        "})\n",
        "\n",
        "ground_truth = sample.get('text', sample.get('ayah_text', ''))\n",
        "predicted_text = prediction['text']\n",
        "\n",
        "print('=' * 60)\n",
        "print('HASIL EVALUASI SPEECH RECOGNITION (ASR):')\n",
        "print('=' * 60)\n",
        "print(f'📖 Teks Asli (Ground Truth) : {ground_truth}')\n",
        "print(f'🤖 Prediksi Whisper AI      : {predicted_text}')\n",
        "print('=' * 60)\n"
    ],
    "outputs": []
})

# Cell 8: Batch Evaluation on Multiple Ayahs
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 7. Pengujian Batch (5 Sampel Audio Berturut-turut)\n",
        "Menguji performa transkripsi pada beberapa ayat berurutan untuk melihat konsistensi akurasi model Whisper.\n"
    ]
})

cells.append({
    "cell_type": "code",
    "execution_count": None,
    "metadata": {},
    "source": [
        "results = []\n",
        "print('⏳ Menjalankan pengujian pada 5 sampel audio...')\n",
        "\n",
        "for i in range(5):\n",
        "    current_sample = next(dataset_iter)\n",
        "    pred = asr_pipe({\n",
        "        'array': current_sample['audio']['array'],\n",
        "        'sampling_rate': current_sample['audio']['sampling_rate']\n",
        "    })\n",
        "    \n",
        "    results.append({\n",
        "        'No': i + 1,\n",
        "        'Surah/Ayah': f\"{current_sample.get('surah', '')}:{current_sample.get('ayah', '')}\",\n",
        "        'Teks Asli': current_sample.get('text', current_sample.get('ayah_text', '')),\n",
        "        'Prediksi AI': pred['text']\n",
        "    })\n",
        "\n",
        "df_results = pd.DataFrame(results)\n",
        "display(df_results)\n"
    ],
    "outputs": []
})

# Cell 9: Integration with Qurava
cells.append({
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "## 8. Penerapan pada Proyek Qurava\n",
        "\n",
        "Teknik transkripsi di atas adalah mekanisme yang sama dengan fitur verifikasi suara di aplikasi web **Qurava**:\n",
        "\n",
        "1. **Pada Latihan Huruf Hijaiyah** ([`src/app/iqra/hijaiyah/[id]/page.tsx`](file:///c:/Users/Arif/Github/lomba/qurava-unej/src/app/iqra/hijaiyah/[id]/page.tsx)):\n",
        "   - Suara pengguna merekam pengucapan huruf (misal: *\"Alif\"* atau *\"Baa\"*).\n",
        "   - Whisper menghasilkan teks aksara Arab (`\"الف\"` atau `\"باء\"`).\n",
        "   - Web mencocokkannya dengan kamus alias huruf Hijaiyah.\n",
        "\n",
        "2. **Pada Latihan Membaca Ayat** ([`src/app/ayat/[id]/page.tsx`](file:///c:/Users/Arif/Github/lomba/qurava-unej/src/app/ayat/[id]/page.tsx)):\n",
        "   - Pengguna membaca ayat Al-Fatihah.\n",
        "   - Whisper mentranskripsi bacaan dan sistem memvalidasi kebenaran lafadznya terhadap teks ayat Al-Qur'an resmi.\n"
    ]
})

nb = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "name": "python",
            "version": "3.11"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 2
}

out_nb = nb_dir / "everyayah_whisper_exploration.ipynb"
with open(out_nb, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)

print(f"Notebook berhasil dibuat di: {out_nb}")
