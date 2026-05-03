# Aplikasi Doa Rosario · Bahasa Indonesia

Aplikasi panduan doa Rosario yang tenang, terstruktur, dan dapat dipakai luring.
Dibangun sebagai **PWA** (Progressive Web App) dengan React + FastAPI + MongoDB.

> Tujuan: membantu umat Katolik berdoa Rosario dengan lebih khusyuk melalui
> panduan langkah demi langkah, renungan singkat, dan visualisasi manik-manik
> Rosario yang menenangkan.

---

## ✨ Fitur MVP

- 🏠 **Halaman Home** dengan rekomendasi peristiwa berdasarkan hari otomatis.
- 🌿 **Empat Peristiwa Rosario** lengkap: Gembira, Sedih, Mulia, Terang.
- 📿 **Doa Step-by-Step** (82 langkah) — pembukaan lengkap (Tanda Salib → Aku
  Percaya → Kemuliaan → Bapa Kami → 3 Salam Pembukaan *Putri Allah Bapa /
  Bunda Allah Putra / Mempelai Allah Roh Kudus* → Kemuliaan → Terpujilah),
  5 peristiwa (P + P&U → Bapa Kami → 10× Salam Maria → Kemuliaan →
  Terpujilah), dan penutup (Doa Penutup → Tanda Salib).
- 🕊️ **Teks Peristiwa** dengan referensi Kitab Suci dan doa tanggapan
  **P** (Pemimpin) + **P + U** (Pemimpin + Umat) sesuai pakem Indonesia.
- 🟡 **Visualisasi Manik Rosario** — manik aktif berkilau emas, dekade selesai
  ditandai biru Maria.
- 💾 **Simpan progress** otomatis di perangkat — bisa dilanjutkan kapan saja.
- 💗 **Intensi Doa pribadi** (CRUD, tersimpan via backend).
- 🌙 **Mode Gelap** untuk doa malam hari.
- 🔠 **Empat ukuran teks** (Kecil, Sedang, Besar, Sangat Besar) untuk lansia.
- 📳 **Getaran halus** opsional saat berpindah manik.
- 🇮🇩 **Bahasa Indonesia** sepenuhnya.

---

## 🧱 Tech Stack

| Layer       | Teknologi                                          |
|-------------|----------------------------------------------------|
| Frontend    | React 19 + React Router 7 + Tailwind CSS + shadcn  |
| Fonts       | Cormorant Garamond (display) + Manrope (body)      |
| Icons       | lucide-react                                       |
| Backend     | FastAPI (Python 3.11+) + Motor (MongoDB async)     |
| Database    | MongoDB                                            |
| Build tool  | CRACO (CRA) — `yarn start` / `yarn build`          |
| Process mgr | supervisord (untuk produksi)                       |

---

## 📁 Struktur Proyek

```
/app
├── backend/
│   ├── server.py             # FastAPI app, semua route /api/*
│   ├── requirements.txt
│   └── .env                  # MONGO_URL, DB_NAME, CORS_ORIGINS
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json     # PWA manifest
    ├── src/
    │   ├── App.js            # Router + Provider tree
    │   ├── index.css         # Tailwind + tokens (Marian palette)
    │   ├── context/          # SettingsContext, ProgressContext
    │   ├── components/       # RosaryVisualizer, ProgressBar
    │   ├── data/             # prayers.js, mysteries.js
    │   ├── lib/api.js        # axios client
    │   ├── pages/            # Home, SelectMystery, Pray, Intentions, Settings
    │   └── utils/rosaryFlow.js  # Generator 81-step flow
    ├── package.json
    └── .env                  # REACT_APP_BACKEND_URL
```

---

## 🔌 API Endpoints

Semua endpoint ber-prefix `/api`.

| Method | Path                              | Deskripsi                          |
|--------|-----------------------------------|------------------------------------|
| GET    | `/api/health`                     | Health check                       |
| POST   | `/api/intentions`                 | Buat intensi `{device_id, text}`   |
| GET    | `/api/intentions?device_id=X`     | List intensi per device            |
| PUT    | `/api/intentions/{id}`            | Update intensi                     |
| DELETE | `/api/intentions/{id}`            | Hapus intensi                      |
| POST   | `/api/sessions`                   | Mulai sesi `{device_id, mystery_id}` |
| POST   | `/api/sessions/{id}/complete`     | Tandai sesi selesai                |
| GET    | `/api/sessions?device_id=X`       | Riwayat sesi                       |
| GET    | `/api/sessions/stats?device_id=X` | `{total, completed}`               |

> Tidak ada autentikasi pada MVP. Data di-scope per `device_id` (UUID di
> localStorage, key `rosario:device_id`).

---

## 🚀 Menjalankan Lokal (Development)

### Prasyarat
- Node.js 18+
- Python 3.11+
- MongoDB 6+ (lokal atau remote)
- Yarn (`npm i -g yarn`)

### Backend
```bash
cd backend
pip install -r requirements.txt
# .env minimal:
#   MONGO_URL=mongodb://localhost:27017
#   DB_NAME=rosario
#   CORS_ORIGINS=*
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
# .env: REACT_APP_BACKEND_URL=http://localhost:8001
yarn start
```

Buka <http://localhost:3000>.

---

## 🌐 Deploy ke Server Ubuntu On-Premise

Lihat **[DEPLOYMENT.md](./DEPLOYMENT.md)** untuk panduan lengkap (Ubuntu 22.04
LTS, Nginx, supervisord, MongoDB, dan opsional Let's Encrypt SSL).

---

## 🧪 Testing

Backend (pytest):
```bash
cd backend
pytest -v
```

Frontend manual: jelajahi route `/`, `/pilih-peristiwa`, `/doa/terang`,
`/intensi`, `/pengaturan`. Semua elemen interaktif memiliki `data-testid`.

---

## 🗺️ Roadmap Berikutnya

- 🎙️ Audio doa per peristiwa (rekaman sendiri)
- 🔔 Pengingat doa harian (Web Push)
- 📊 Riwayat dan statistik konsistensi doa
- 🏛️ Mode doa bersama (real-time, untuk lingkungan/paroki)
- 📱 Versi mobile native (Flutter/React Native)
- 🌐 Multi-bahasa (Inggris, Latin)

---

## ⚖️ Lisensi & Konten

- Teks doa disusun mengikuti formula umum yang dipakai luas oleh Gereja Katolik
  Indonesia. Renungan ditulis ringkas dan orisinal.
- Sebelum publikasi luas, sebaiknya konten ditinjau oleh pihak yang memahami
  liturgi/katekese (lihat dokumen elaborasi §23).

---

Dibangun dengan ❤️ untuk membantu pengguna berdoa lebih khusyuk.
