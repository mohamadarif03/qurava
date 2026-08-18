# Walkthrough: Integrasi AI MediaPipe Hands

## 1. Instalasi AI Pihak Ketiga
Saya telah berhasil menginstal dan menyematkan pustaka AI buatan Google (*MediaPipe Hands*) secara langsung ke dalam aplikasi Anda. Pustaka ini sangat ringan dan dioptimalkan khusus untuk pelacakan tangan di *browser*.

## 2. Pengalaman Pengguna (AI Tracking)
- **Proses Pemuatan:** Ketika halaman baru dibuka, Anda akan melihat indikator kuning "MEMUAT MODEL AI...". Pada tahap ini, *browser* sedang menarik data kecerdasan buatan dari server.
- **Kanvas Interaktif:** Setelah berhasil dimuat, AI akan mulai menyala. Coba letakkan tangan Anda di depan kamera! Anda akan langsung melihat garis-garis kerangka (*landmarks*) digambar di atas tulang jari-jari Anda. Setiap sendi dilacak dengan ketelitian tinggi secara seketika (*real-time*).

## 3. Logika Pendeteksi Jari (Alif)
Tombol "Deteksi 'Alif' Sekarang" bukan lagi sekadar simulasi waktu. Ketika Anda mengekliknya, algoritma AI mulai berhitung berdasarkan titik koordinat ujung jari (Y-axis):
1. **Jari Telunjuk (*Index*):** AI akan memastikan bahwa ujung jari telunjuk (Titik #8) berada jauh lebih tinggi (nilai Y lebih kecil) dibandingkan pangkalnya.
2. **Jari Lainnya:** AI memastikan jari tengah, manis, kelingking, dan jempol posisinya terlipat / berada di bawah telunjuk.
3. **Kemenangan:** Jika bentuk geometri ini berhasil ditangkap oleh AI dalam keadaan stabil, barulah layar berubah sukses memunculkan hamparan hijau! 

Ini adalah fondasi yang sungguh luar biasa, kita bisa membuat ratusan kombinasi sandi gestur dari titik koordinat jari ini!
