# Walkthrough: Fitur Perekam Suara Pengguna (Voice Recording)

## 1. Tombol Mikrofon Terintegrasi
Saya telah menambahkan sebuah tombol khusus berlogo **Mikrofon** tepat di sebelah tombol "Putar Audio" di halaman detail huruf.
- Saat tombol mikrofon ini ditekan untuk pertama kalinya, aplikasi akan meminta izin akses mikrofon (melalui *browser prompt* standar).
- Jika tombol ini ditekan, aplikasi akan mulai merekam suara Anda melalui mikrofon bawaan (*built-in*) perangkat.

## 2. Umpan Balik Visual yang Intuitif
Agar Anda tidak bingung apakah suara sedang direkam atau tidak, saya mendesain UI (*User Interface*) agar berubah secara dramatis saat merekam:
- Huruf Arab dan teks di bawahnya akan berubah warna menjadi **Merah**.
- Tombol mikrofon akan memancarkan cahaya merah yang berkedip pelan (*pulse*).
- Gelombang suara (*sound wave visualizer*) berwarna merah akan muncul dan menari-nari di bawah layar sebagai indikator visual perekaman.

## 3. Fitur Putar Ulang Rekaman (*Playback*)
Begitu Anda menekan tombol mikrofon lagi untuk menghentikan rekaman:
- Hasil tangkapan suara Anda akan dikemas (*encode*) secara *real-time* ke dalam *memori browser* Anda (sangat aman, tidak diunggah ke internet).
- Sebuah tombol baru berjudul **"Dengarkan Rekaman Anda"** akan muncul ke permukaan (dari bawah layar).
- Mengeklik tombol tersebut akan memutar ulang suara Anda. Anda bisa memutar suara panduan asli, lalu memutar suara Anda secara bergantian untuk membandingkan pelafalannya! 
- Jika Anda merasa pelafalan Anda masih kurang pas, cukup tekan tombol mikrofon lagi untuk menimpa rekaman tersebut dengan rekaman yang baru.
