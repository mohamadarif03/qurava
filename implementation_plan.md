# Rencana Implementasi: Integrasi Deteksi Jari AI (MediaPipe)

## Latar Belakang
Pengguna meminta agar simulasi deteksi tangan diganti dengan *Artificial Intelligence* (AI) sungguhan yang mampu melacak pergerakan dan sendi jari secara *real-time*. Teknologi yang paling tepat dan canggih untuk hal ini adalah **MediaPipe Hands** (buatan Google) atau **TensorFlow.js**.

## Proposed Changes

### [NEW DEPENDENCIES]
Saya akan menginstal paket dari Google MediaPipe ke dalam proyek Next.js Anda:
- `@mediapipe/hands`: Model AI utama untuk mendeteksi 21 titik sendi (landmark) tangan.
- `@mediapipe/camera_utils`: Untuk mengelola *frame* kamera secara efisien.
- `@mediapipe/drawing_utils`: (Opsional) untuk menggambar kerangka tangan di layar agar *user* bisa melihat bahwa tangannya sedang dilacak oleh AI.

### [MODIFY] `src/app/iqra/hijaiyah/[id]/gesture/page.tsx`
Saya akan mengubah halaman cermin *webcam* yang sudah ada menjadi aplikasi AI sungguhan:
1. **Inisialisasi AI:** Menambahkan logika pemuatan model MediaPipe Hands saat halaman dibuka.
2. **Kanvas Pelacakan (*Canvas*):** Menambahkan elemen `<canvas>` di atas `<video>` untuk menggambar kerangka (titik-titik sendi) jari pengguna secara *real-time* (mirip filter Instagram/TikTok).
3. **Logika Pengenalan "Alif":**
   - MediaPipe akan mengembalikan koordinat X dan Y dari 21 sendi tangan.
   - Saya akan membuat algoritma matematika geometri sederhana:
     - Jari Telunjuk (*Index Finger*) harus mengarah lurus ke atas (posisi Y ujung jari < pangkal jari).
     - Jari lainnya (Tengah, Manis, Kelingking) harus mengepal/tertutup (posisi Y ujung jari > pangkal jari).
   - Jika kondisi ini terpenuhi terus menerus selama 2 detik (saat sedang "Mendeteksi"), AI akan menyatakan Sukses!

## Open Questions
> [!IMPORTANT]
> Menggunakan model AI di dalam browser akan membuat halaman ini sedikit lebih lambat saat pertama kali dimuat (karena harus mengunduh file model AI sebesar beberapa Megabyte). Apakah tidak apa-apa?
> Selain itu, karena instalasi MediaPipe di Next.js terkadang menemui kendala *WebPack*, saya akan mengusahakan konfigurasi terbaiknya.

## Verification Plan
1. Saat membuka `localhost:3000/iqra/hijaiyah/alif/gesture`, Anda akan melihat wajah Anda, dan jika Anda memasukkan tangan ke layar, AI akan **menggambar jaring-jaring kerangka hijau/merah di atas jari Anda**.
2. Saat Anda mengacungkan jari telunjuk ke atas dan mengepal jari lainnya (seperti angka 1), AI akan mengenalinya sebagai Alif.
3. Jika Anda membuka jari tangan lebar-lebar (kertas), AI tidak akan merespons.
