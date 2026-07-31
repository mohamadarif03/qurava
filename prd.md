# Product Requirements Document (PRD)

# SAHABAT
### Platform Pembelajaran Al-Qur'an Berbasis AI dan Accessibility First

---

# 1. Product Overview

## Deskripsi

SAHABAT merupakan platform pembelajaran Al-Qur'an berbasis web yang dirancang dengan pendekatan **Accessibility First**, sehingga setiap pengguna dapat belajar Al-Qur'an melalui jalur interaksi yang sesuai dengan kemampuan mereka.

Platform menyediakan tiga metode interaksi berbasis AI:

- 🎤 Voice Recognition
- 🤟 Gesture Recognition
- ✍️ Handwriting Recognition

Setiap metode memiliki tujuan pembelajaran yang sama sehingga seluruh pengguna memperoleh pengalaman belajar yang setara.

---

# 2. Target User

## Student

- Pengguna umum
- Penyandang tunanetra
- Penyandang tunarungu
- Penyandang tunawicara

## Teacher

- Guru TPQ
- Guru Agama
- Pendamping belajar

---

# 3. Goals

- Menyediakan pembelajaran Al-Qur'an yang inklusif.
- Membantu siswa belajar secara mandiri.
- Memberikan evaluasi otomatis menggunakan AI.
- Memudahkan guru memantau perkembangan siswa.

---

# 4. Product Modules

---

# Authentication Module

## Login

### Deskripsi

Autentikasi pengguna.

### Features

- Login Email
- Login Google
- Remember Me
- Logout

---

## Register

### Deskripsi

Pendaftaran akun baru.

### Features

- Nama
- Email
- Password
- Role
- Pilihan kebutuhan aksesibilitas

---

## Forgot Password

### Features

- Reset Password melalui Email

---

# Accessibility Module

## Accessibility Preferences

### Features

- Default Mode
- Low Vision Mode
- Blind Mode
- Deaf Mode
- Mute Mode

---

## Accessibility Settings

### Features

- High Contrast
- Large Text
- Dyslexia Friendly Font
- Reduce Motion
- Dark Mode

---

## Keyboard Navigation

### Features

- Full Keyboard Navigation
- Focus Indicator
- Skip Navigation

---

## Screen Reader Support

### Features

- Semantic HTML
- ARIA Label
- Landmark Navigation

---

## Speech Synthesis

### Features

- Read Instruction
- Read Ayat
- Read Feedback
- Read Navigation

---

# Dashboard Student

## Features

- Progress Belajar
- Modul Terakhir
- Target Harian
- Nilai Latihan
- Hafalan Terakhir
- Achievement
- Learning Streak

---

# Learning Module

## Huruf Hijaiyah

### Features

- Bentuk Huruf
- Audio Pengucapan
- Animasi Penulisan
- Latihan

---

## Harakat

### Features

- Fathah
- Kasrah
- Dhammah

---

## Tanwin

### Features

- Fathatain
- Kasratain
- Dhammatain

---

## Sukun

---

## Tasydid

---

## Mad

---

## Sambung Huruf

---

## Surah Pendek

### Features

- Teks Arab
- Latin
- Terjemahan
- Audio Murottal

---

# Voice Recognition Module

## Deskripsi

Latihan membaca Al-Qur'an menggunakan suara.

### Features

- Start Recording
- Stop Recording
- Audio Playback
- Noise Detection

---

## AI Recognition

### Features

- Speech Recognition
- Pronunciation Detection
- Ayat Matching
- Confidence Score

---

## Feedback

### Features

- Huruf Salah
- Huruf Benar
- Nilai Bacaan
- Highlight Kesalahan
- Retry

---

# Gesture Recognition Module

## Deskripsi

Belajar menggunakan bahasa isyarat hijaiyah.

### Features

- Webcam Access
- Live Camera Preview
- Hand Tracking
- Real-time Detection

---

## AI Recognition

### Features

- Gesture Classification
- Confidence Score
- Live Prediction
- Wrong Gesture Detection

---

## Feedback

### Features

- Correct Gesture
- Incorrect Gesture
- Position Correction
- Retry

---

# Handwriting Recognition Module

## Deskripsi

Belajar menulis huruf hijaiyah.

### Features

- Digital Canvas
- Pen Tool
- Eraser
- Clear Canvas

---

## Writing Guide

### Features

- Ghost Letter
- Stroke Guide
- Direction Guide

---

## AI Recognition

### Features

- Letter Prediction
- Similarity Score
- Accuracy Score

---

## Feedback

### Features

- Correct Stroke
- Wrong Stroke
- Retry

---

# Surah Learning Module

## Detail Surah

### Features

- Nama Surah
- Jumlah Ayat
- Arab
- Latin
- Terjemahan

---

## Audio

### Features

- Play Murottal
- Pause
- Repeat
- Speed Control

---

## Practice Mode

### Features

- Voice Mode
- Gesture Mode
- Writing Mode

---

# AI Feedback Module

## Features

- Automatic Assessment
- Learning Recommendation
- Strength Analysis
- Weakness Analysis
- Next Learning Recommendation

---

# Progress Tracking Module

## Features

- Modul Progress
- Surah Progress
- Learning History
- Average Score
- Daily Activity

---

## Visualization

### Features

- Progress Bar
- Circular Progress
- Weekly Chart
- Monthly Chart

---

# Achievement Module

## Features

- First Lesson
- First Surah
- First Perfect Score
- Voice Master
- Gesture Master
- Writing Master
- 7 Days Streak
- 30 Days Streak

---

# History Module

## Features

- Voice History
- Gesture History
- Writing History
- Score History
- Activity Timeline

---

# Teacher Dashboard

## Features

- Total Student
- Active Student
- Total Class
- Average Progress
- Latest Activity

---

# Class Management

## Features

- Create Class
- Edit Class
- Delete Class
- Invite Student
- Remove Student

---

# Student Monitoring

## Features

- Student Progress
- Student Score
- Completed Module
- Learning History
- AI Assessment Result

---

# Teacher Evaluation

## Features

- Manual Evaluation
- Notes
- Recommendation
- Learning Status

---

# Notification Module

## Features

- Daily Reminder
- Learning Target
- Achievement Notification
- Teacher Feedback
- Progress Completed

---

# Profile Module

## Features

- Edit Profile
- Change Password
- Upload Photo
- Accessibility Preference

---

# Settings Module

## Features

- Theme
- Language
- Accessibility
- Camera
- Microphone
- Audio

---

# 5. AI Features

| AI Module | Input | Output |
|-----------|-------|---------|
| Voice Recognition | Audio | Pronunciation Assessment |
| Gesture Recognition | Webcam | Gesture Prediction |
| Handwriting Recognition | Canvas | Hijaiyah Prediction |
| AI Feedback | Learning Result | Recommendation |

---

# 6. MVP Priority

## P0 (Must Have)

- Authentication
- Dashboard Student
- Huruf Hijaiyah Module
- Voice Recognition
- Gesture Recognition
- Handwriting Recognition
- Progress Tracking
- Dashboard Teacher

---

## P1 (Should Have)

- Class Management
- Teacher Evaluation
- Detail Surah
- Accessibility Settings
- Notifications

---

## P2 (Nice to Have)

- Achievement
- Learning Streak
- Leaderboard
- AI Learning Path
- AI Chat Assistant
- Offline Learning

---

# 7. Future Roadmap

## Version 2

- AI Personal Tutor
- AI Tajwid Detection
- Adaptive Learning Path
- Gamification
- Leaderboard
- Parent Dashboard
- Certificate Generator
- Learning Analytics
- Offline Mode
- Multi Language Support