# Panduan Deploy — Aplikasi Doa Rosario

Panduan ini menjelaskan cara men-deploy **Aplikasi Doa Rosario** ke server
**Ubuntu 22.04 LTS on-premise** (atau VM/VPS lain yang setara) menggunakan
**Nginx + supervisord + MongoDB lokal**.

> Diasumsikan Anda memiliki akses SSH `sudo` ke server, dan sebuah domain
> (mis. `rosario.contoh.id`) yang sudah diarahkan ke IP server (A record).

---

## 0. Ringkasan Arsitektur Produksi

```
                ┌──────────────────────────────────────┐
                │  Internet / pengguna (HTTPS, port 443)│
                └─────────────────┬────────────────────┘
                                  │
                          ┌───────▼────────┐
                          │  Nginx (80/443)│  (TLS + reverse proxy)
                          └───┬─────────┬──┘
            static (build)    │         │   /api/*
        ┌─────────────────────▼─┐     ┌─▼─────────────────────────┐
        │ /var/www/rosario/build│     │ FastAPI uvicorn :8001     │
        └───────────────────────┘     │  (supervisord-managed)    │
                                      └─────────┬─────────────────┘
                                                │
                                       ┌────────▼────────┐
                                       │ MongoDB :27017  │
                                       └─────────────────┘
```

---

## 1. Siapkan Server Ubuntu

```bash
# Login sebagai user dengan sudo
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git ufw

# Firewall dasar
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

## 2. Install Dependensi Sistem

### 2.1 Node.js 20 + Yarn
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
node -v && yarn -v
```

### 2.2 Python 3.11
```bash
sudo apt install -y python3 python3-pip python3-venv
python3 --version   # harus >= 3.10
```

### 2.3 MongoDB 7.0
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] \
https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
sudo systemctl status mongod   # pastikan active (running)
```

> Catatan: secara default MongoDB hanya bind ke `127.0.0.1` — sudah aman.

### 2.4 Nginx + supervisord + Certbot
```bash
sudo apt install -y nginx supervisor certbot python3-certbot-nginx
```

---

## 3. Ambil Source Code

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
# ganti URL berikut dengan repo Anda (atau scp/rsync dari mesin lokal)
git clone https://github.com/USERNAME/rosario.git rosario
cd rosario
```

---

## 4. Konfigurasi Backend (FastAPI)

### 4.1 Virtualenv & dependencies
```bash
cd /var/www/rosario/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 4.2 File `.env`
```bash
cat > /var/www/rosario/backend/.env <<'EOF'
MONGO_URL=mongodb://localhost:27017
DB_NAME=rosario
CORS_ORIGINS=https://rosario.contoh.id
EOF
```
> Ganti `rosario.contoh.id` dengan domain Anda. Untuk uji awal HTTP, boleh
> sementara isi `CORS_ORIGINS=*`, lalu perketat setelah HTTPS aktif.

### 4.3 Uji jalan manual
```bash
cd /var/www/rosario/backend
source .venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001
# di terminal lain:
curl http://127.0.0.1:8001/api/health
# {"status":"healthy"}
# Ctrl-C bila OK
```

---

## 5. Build Frontend

### 5.1 File `.env` produksi
```bash
cat > /var/www/rosario/frontend/.env <<'EOF'
REACT_APP_BACKEND_URL=https://rosario.contoh.id
EOF
```
> Penting: `REACT_APP_BACKEND_URL` harus sama persis dengan domain publik
> (tanpa trailing slash). Frontend akan memanggil `${REACT_APP_BACKEND_URL}/api/...`.

### 5.2 Build production bundle
```bash
cd /var/www/rosario/frontend
yarn install --frozen-lockfile
yarn build
# Output → /var/www/rosario/frontend/build
```

---

## 6. supervisord — Menjalankan Backend Otomatis

```bash
sudo tee /etc/supervisor/conf.d/rosario-backend.conf > /dev/null <<'EOF'
[program:rosario-backend]
command=/var/www/rosario/backend/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 2
directory=/var/www/rosario/backend
user=www-data
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
stdout_logfile=/var/log/rosario-backend.out.log
stderr_logfile=/var/log/rosario-backend.err.log
environment=PYTHONUNBUFFERED="1"
EOF

# Pastikan www-data bisa membaca direktori
sudo chown -R www-data:www-data /var/www/rosario/backend

sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status rosario-backend
# rosario-backend  RUNNING   pid 1234, uptime 0:00:05

# Cek log bila perlu
sudo tail -f /var/log/rosario-backend.err.log
```

---

## 7. Nginx — Reverse Proxy + Static Hosting

```bash
sudo tee /etc/nginx/sites-available/rosario > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name rosario.contoh.id;

    # Frontend static (React build)
    root /var/www/rosario/frontend/build;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript
               application/xml+rss text/xml application/wasm image/svg+xml;
    gzip_min_length 1024;

    # Cache static aset (hash di nama file → aman cache panjang)
    location ~* \.(js|css|woff2?|ttf|otf|svg|png|jpg|jpeg|gif|webp|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # PWA manifest & service worker — JANGAN di-cache lama
    location = /manifest.json { add_header Cache-Control "no-cache"; }
    location = /service-worker.js { add_header Cache-Control "no-cache"; }

    # Backend API → uvicorn lokal
    location /api/ {
        proxy_pass         http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }

    # SPA fallback — semua route lain dilayani index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/rosario /etc/nginx/sites-enabled/rosario
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Uji via HTTP dulu:
```bash
curl -I http://rosario.contoh.id/
curl    http://rosario.contoh.id/api/health
```

---

## 8. HTTPS — Let's Encrypt (Opsional tapi Sangat Disarankan)

```bash
sudo certbot --nginx -d rosario.contoh.id --redirect --agree-tos -m anda@email.id
sudo systemctl status certbot.timer   # auto-renew aktif
```

Setelah HTTPS aktif, jangan lupa **update** dua hal:
1. `frontend/.env` → `REACT_APP_BACKEND_URL=https://rosario.contoh.id` lalu
   `yarn build` ulang.
2. `backend/.env` → `CORS_ORIGINS=https://rosario.contoh.id`, lalu
   `sudo supervisorctl restart rosario-backend`.

---

## 9. Verifikasi Akhir

```bash
# Backend hidup
sudo supervisorctl status rosario-backend

# API publik
curl https://rosario.contoh.id/api/health
# {"status":"healthy"}

# Buka https://rosario.contoh.id di browser
# Coba: Mulai Rosario → Lanjut → buka Intensi → tambah → reload → masih ada
```

---

## 10. Update / Re-deploy Versi Baru

Dengan workflow Git:
```bash
cd /var/www/rosario
git pull

# Backend
cd backend
source .venv/bin/activate
pip install -r requirements.txt
sudo supervisorctl restart rosario-backend

# Frontend
cd ../frontend
yarn install --frozen-lockfile
yarn build
sudo systemctl reload nginx   # tidak wajib, cukup file build diganti
```

Buat skrip `deploy.sh` (opsional):
```bash
sudo tee /var/www/rosario/deploy.sh > /dev/null <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
cd /var/www/rosario
git pull
cd backend && source .venv/bin/activate && pip install -r requirements.txt
sudo supervisorctl restart rosario-backend
cd ../frontend && yarn install --frozen-lockfile && yarn build
echo "✅ Deploy selesai."
EOF
sudo chmod +x /var/www/rosario/deploy.sh
```

---

## 11. Backup Database

```bash
# Backup harian sederhana via cron
sudo mkdir -p /var/backups/mongo
sudo crontab -e
# Tambahkan baris:
0 2 * * * mongodump --db rosario --out /var/backups/mongo/$(date +\%F) && find /var/backups/mongo -mtime +14 -type d -exec rm -rf {} +
```

Restore:
```bash
mongorestore --db rosario /var/backups/mongo/2026-01-15/rosario
```

---

## 12. Hardening Tambahan (opsional)

1. **MongoDB auth** — buat user, aktifkan `security.authorization: enabled`
   di `/etc/mongod.conf`, lalu update `MONGO_URL` ke
   `mongodb://user:pass@127.0.0.1:27017/rosario?authSource=admin`.
2. **Fail2ban** untuk SSH:
   ```bash
   sudo apt install -y fail2ban && sudo systemctl enable --now fail2ban
   ```
3. **Header keamanan Nginx** — tambahkan di blok `server`:
   ```
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header Referrer-Policy "strict-origin-when-cross-origin";
   ```
4. **Log rotation**: bawaan `logrotate` Ubuntu sudah meng-handle
   `/var/log/rosario-backend.*.log` jika Anda menambahkan file
   `/etc/logrotate.d/rosario`:
   ```
   /var/log/rosario-backend.*.log {
       weekly
       rotate 8
       compress
       missingok
       notifempty
       copytruncate
   }
   ```

---

## 13. Troubleshooting

| Gejala                                         | Penyebab umum & solusi                                                       |
|-----------------------------------------------|-------------------------------------------------------------------------------|
| `502 Bad Gateway` saat akses `/api/...`        | uvicorn mati. `sudo supervisorctl status` & `tail -f /var/log/rosario-backend.err.log` |
| Halaman putih, error CORS di console          | `REACT_APP_BACKEND_URL` salah, atau `CORS_ORIGINS` belum diizinkan domain    |
| Reload route SPA → 404                         | Konfigurasi `try_files $uri $uri/ /index.html;` belum aktif                  |
| Intensi tersimpan tapi hilang setelah ganti perangkat | Memang sengaja — data di-scope per `device_id` (localStorage). Sinkronisasi cloud direncanakan untuk fase berikutnya. |
| MongoDB tidak start                            | `sudo journalctl -u mongod -n 50` untuk lihat error                          |
| Nginx test gagal                               | `sudo nginx -t` menampilkan baris bermasalah                                 |

---

## Selesai 🎉

Aplikasi Doa Rosario Anda kini hidup di `https://rosario.contoh.id`.
Bagikan link kepada keluarga, lingkungan, atau paroki — dan selamat berdoa.
