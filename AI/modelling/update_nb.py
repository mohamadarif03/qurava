import json
from pathlib import Path

nb_path = Path("notebooks/everyayah_whisper_exploration.ipynb")
with open(nb_path, encoding="utf-8") as f:
    nb = json.load(f)

# Cell 2: Import Cell
nb["cells"][2]["source"] = [
    "import os\n",
    "import numpy as np\n",
    "import pandas as pd\n",
    "import matplotlib.pyplot as plt\n",
    "import IPython.display as ipd\n",
    "\n",
    "from datasets import load_dataset\n",
    "\n",
    "print('Library datasets berhasil di-import!')\n"
]
nb["cells"][2]["outputs"] = []

# Cell 4: Load Dataset Cell
nb["cells"][4]["source"] = [
    "print('Menghubungkan ke dataset tarteel-ai/everyayah...')\n",
    "\n",
    "try:\n",
    "    # Gunakan streaming=True agar tidak mendownload puluhan gigabyte\n",
    "    ds = load_dataset('tarteel-ai/everyayah', split='train', streaming=True)\n",
    "    print('Berhasil terhubung ke dataset EveryAyah!')\n",
    "except Exception as e:\n",
    "    print('Gagal terhubung (periksa koneksi internet):', e)\n"
]
nb["cells"][4]["outputs"] = []

# Cell 10: Model pipeline with graceful import check
for cell in nb["cells"]:
    if cell.get("cell_type") == "code" and any("pipeline(" in s for s in cell.get("source", [])):
        cell["source"] = [
            "# Memuat model Whisper ASR jika PyTorch terpasang\n",
            "try:\n",
            "    from transformers import pipeline\n",
            "    import torch\n",
            "    \n",
            "    device = 0 if torch.cuda.is_available() else -1\n",
            "    print(f'Memuat model Whisper pada device: {device} (GPU/CPU)...')\n",
            "    asr_pipe = pipeline('automatic-speech-recognition', model='tarteel-ai/whisper-base-ar-quran', device=device)\n",
            "    print('Model Tarteel Whisper siap digunakan!')\n",
            "except Exception as e:\n",
            "    print('Model Whisper dilewati. Catatan:', e)\n",
            "    print('Jika ingin menjalankan model AI di GPU Anda, jalankan: pip install torch')\n"
        ]
        cell["outputs"] = []

with open(nb_path, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)

print("Notebook updated successfully!")
