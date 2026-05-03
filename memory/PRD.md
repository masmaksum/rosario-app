# PRD — Aplikasi Doa Rosario (PWA)

## Problem Statement
Membangun aplikasi PWA doa Rosario Bahasa Indonesia yang tenang, terstruktur, dan
dapat dipakai luring. Target: umat Katolik umum, keluarga, komunitas, orang muda,
lansia, dan pemula.

## User Personas
- **Umat pribadi**: ingin panduan doa yang mudah diikuti.
- **Keluarga**: butuh ukuran teks besar (lansia) + dark mode (malam hari).
- **Komunitas/Lingkungan**: butuh format P (Pemimpin) + P+U (Umat) yang jelas.
- **Pemula**: belum hafal urutan, butuh step-by-step.

## Core Requirements (Static)
1. Alur doa Rosario 82 langkah lengkap (pembukaan + 5 peristiwa + penutup).
2. Format P / P+U pada tiap peristiwa sesuai pakem Indonesia.
3. 3 Salam pembukaan: Putri Allah Bapa, Bunda Allah Putra, Mempelai Allah Roh Kudus.
4. Rekomendasi peristiwa otomatis berdasarkan hari.
5. 4 ukuran font + dark mode.
6. Simpan progress otomatis (localStorage).
7. Intensi doa pribadi (backend + device_id scoping).
8. Offline-first friendly (static content).

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn + React Router 7
- **Backend**: FastAPI + Motor (MongoDB)
- **Data flow**: Konten doa static di frontend (`/data/prayers.js`, `/data/mysteries.js`).
  Backend hanya untuk intentions CRUD + sessions/stats.
- **No auth**: device_id (UUID localStorage) untuk scope data.

## Delivered Features
### 2026-01 (v0.1 MVP)
- ✅ Home page: greeting, hari/tanggal, rekomendasi peristiwa, Mulai Rosario
- ✅ Pilih Peristiwa: 4 kartu (Gembira/Sedih/Mulia/Terang)
- ✅ Pray Page: 82 langkah step-by-step dengan navigasi Lanjut/Kembali
- ✅ RosaryVisualizer: 5 dekade, manik aktif emas berkilau
- ✅ ProgressBar: langkah N dari 82
- ✅ Reflection screen: P (leaderText) + P+U (responseText) + referensi Kitab Suci
- ✅ Prayer intro (untuk 3 Salam pembukaan)
- ✅ Settings: theme toggle, 4 font sizes, haptic, reset progress
- ✅ Intentions: CRUD via backend (`/api/intentions`)
- ✅ Sessions tracking (`/api/sessions`, `/api/sessions/stats`)
- ✅ Resume card di Home saat progress aktif
- ✅ Dark mode lengkap
- ✅ PWA manifest
- ✅ README.md + DEPLOYMENT.md (Ubuntu on-premise + Nginx + supervisord)

### 2026-01 Content update
- ✅ Migrasi dari format "reflection/intention" ke format P / P+U sesuai pakem Indonesia
- ✅ Tambah prayer: Terpujilah, Salam Putri Allah Bapa, Salam Bunda Allah Putra, Salam Mempelai Allah Roh Kudus
- ✅ Hapus Doa Fatima (tidak ada di pakem user)
- ✅ Update alur: pembukaan 9 langkah, setiap dekade 14 langkah, penutup 2 langkah

## Backlog (Prioritized)

### P1 — Next iteration
- 🎙️ Audio doa per peristiwa (rekaman narator)
- 🔔 Pengingat doa harian (Web Push / local notification)
- 📊 Halaman Riwayat Doa (list session + filter per peristiwa)
- 🎯 Kaitkan intensi ke sesi doa (intensi yang "aktif" saat berdoa)

### P2 — Fase 3+
- 🏛️ Mode doa bersama (WebSocket, untuk lingkungan/paroki)
- 📝 CMS untuk konten musiman (bulan Maria, Oktober)
- 🌐 Multi-bahasa (Latin, Inggris)
- 📱 Mobile native (Flutter/React Native)
- 🔐 Opsional login untuk sinkronisasi antar perangkat

### P2 — Konten
- Litani Santa Perawan Maria (opsional di akhir)
- Doa kepada Santo Mikael (opsional)
- Review rohani/katekese sebelum publikasi luas

## Test Credentials
N/A — aplikasi tidak menggunakan autentikasi pada MVP.
Data user di-scope per `device_id` (UUID di `localStorage` key `rosario:device_id`).

## Next Action Items (session berikut)
1. Add audio recording & playback untuk setiap doa utama
2. Build halaman Riwayat Doa (`/riwayat`) dengan list & filter
3. Web Push reminder harian
