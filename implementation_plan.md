# Rencana Implementasi: Fitur Perekam Suara Pengguna (Voice Recording)

## Latar Belakang
Selain mendengarkan audio panduan (`.mp3`), pengguna ingin dapat merekam suara mereka sendiri saat mencoba menirukan pelafalan huruf. Ini adalah langkah kunci menuju fitur *Voice Recognition* yang seutuhnya.

## Proposed Changes

### [MODIFY] `src/app/iqra/hijaiyah/[id]/page.tsx`
Saya akan merombak halaman detail ini untuk memasukkan fitur mikrofon (Web Audio API / MediaRecorder):

1. **Tombol Rekam Baru (Microphone):**
   - Akan ditambahkan tombol baru berikon Mikrofon di sebelah (atau di bawah) tombol "Putar Suara" yang sudah ada.
   
2. **Sistem Perekaman (*MediaRecorder API*):**
   - Meminta izin akses mikrofon (*microphone permissions*) dari peramban/browser pengguna.
   - Saat tombol ditekan dan ditahan (atau diklik sekali untuk mulai, klik lagi untuk berhenti), sistem akan merekam suara pengguna.
   - Saat proses merekam berjalan, tombol akan memancarkan cahaya merah (*red glow*) dan akan ada efek gelombang suara responsif untuk memberi umpan balik visual bahwa suara sedang ditangkap.

3. **Pemutar Hasil Rekaman (*Playback*):**
   - Setelah selesai merekam, hasil rekaman pengguna akan diubah menjadi file audio sementara (Blob URL) di dalam memori peramban.
   - Akan muncul tombol baru: **"Dengarkan Rekaman Anda"**.
   - Pengguna bisa memutar ulang rekaman tersebut berulang kali untuk membandingkannya dengan suara contoh (audio panduan).
   - Akan disediakan pula tombol **"Rekam Ulang"** jika dirasa belum pas.

## User Review Required
> [!IMPORTANT]
> Mengingat fitur ini membutuhkan izin akses perangkat keras (Mikrofon), browser mungkin akan memunculkan *pop-up* "Allow Microphone" saat pertama kali diuji.

## Verification Plan
1. Masuk ke rute `/iqra/hijaiyah/alif`.
2. Tekan tombol Mikrofon. Izinkan akses pada *browser prompt*.
3. Bicaralah dan pastikan UI berubah untuk menandakan sedang merekam (merah).
4. Hentikan rekaman, lalu tekan Play pada hasil rekamannya. Pastikan suara pengguna terdengar jelas.
