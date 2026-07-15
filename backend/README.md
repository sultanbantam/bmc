# BMC AI Backend

Backend Express untuk BMC AI Agent Platform.

## Endpoint

- `GET /health`
- `POST /api/bmc/generate`
- `POST /api/bmc/chat`
- `POST /api/knowledge/upload`
- `POST /api/knowledge/sources`
- `POST /api/knowledge/search`
- `POST /api/social/save`
- `POST /api/social/schedule`
- `POST /api/social/publish-due`
- `POST /api/social/list`

Jika `OPENAI_API_KEY` kosong, backend tetap berjalan memakai generator lokal. Jika API key diisi, backend memakai OpenAI Chat Completions dan fallback lokal saat AI error.

Knowledge base MVP menyimpan sumber dan chunk di file JSON pada `backend/data` atau folder yang ditentukan `BMC_DATA_DIR`. Untuk tahap ini upload terbaik adalah `.txt`, `.md`, atau teks kurasi yang sudah dipaste dari buku/paper. PDF/DOCX/OCR bisa ditambahkan pada fase database/parser.

Social publishing MVP menyimpan draft dan jadwal di `backend/data/social-posts.json`. Default `SOCIAL_PUBLISH_MODE=mock`, artinya tombol publish due menandai post sebagai published tanpa mengirim ke platform. Untuk mode live, tiap platform tetap perlu OAuth/token resmi. Tahap pertama yang sudah disiapkan adalah X lewat `X_USER_TOKEN`.

## X Auto Publishing

Backend sudah bisa memproses post terjadwal untuk X jika token OAuth resmi tersedia. Isi `.env`:

```bash
SOCIAL_PUBLISH_MODE=live
SOCIAL_AUTO_PUBLISH=true
SOCIAL_PUBLISH_INTERVAL_MS=300000
SOCIAL_LIVE_PLATFORMS=X
X_USER_TOKEN=isi_oauth2_user_token_x
X_TEXT_LIMIT=280
```

Catatan:

- `X_USER_TOKEN` harus berupa OAuth 2.0 user token yang punya izin menulis post/tweet.
- Post selain X akan disimpan tetapi diberi status `needs_credentials` saat live publisher belum dikonfigurasi.
- Jika `SOCIAL_AUTO_PUBLISH=false`, jadwal hanya diproses saat endpoint `/api/social/publish-due` dipanggil.
- Endpoint `/health` dan `/api/social/config` menampilkan status publisher tanpa membocorkan token.

## Jalankan Lokal

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Tes:

```bash
curl http://localhost:3001/health
curl -X POST http://localhost:3001/api/bmc/generate \
  -H "Content-Type: application/json" \
  -d "{\"idea\":\"saya mau bisnis eko wisata di Kasepuhan Cibarani Lebak\"}"
```

## Deploy Ke Contabo Dengan PM2

Upload folder `backend` ke server, contoh:

```bash
scp -r backend root@IP_SERVER:/var/www/bmc-backend
```

Masuk server:

```bash
ssh root@IP_SERVER
cd /var/www/bmc-backend
cp .env.example .env
nano .env
npm install --omit=dev
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
curl http://localhost:3001/health
```

Isi minimal `.env`:

```bash
PORT=3001
OPENAI_API_KEY=sk-isi_api_key_anda
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGIN=https://domain-vercel-anda.vercel.app
```

Catatan penting: frontend Vercel berjalan di HTTPS, jadi API Contabo juga sebaiknya memakai HTTPS lewat domain dan Nginx reverse proxy. Memanggil `http://IP_SERVER:3001` langsung dari Vercel biasanya diblokir browser karena mixed content.

## Nginx Reverse Proxy

Contoh konfigurasi untuk domain `api.domain-anda.com`:

```nginx
server {
  server_name api.domain-anda.com;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Setelah itu pasang SSL, misalnya dengan Certbot:

```bash
certbot --nginx -d api.domain-anda.com
```

## Hubungkan Ke Frontend

Edit `config.js` di root frontend:

```js
window.BMC_API_URL = "https://api.domain-anda.com";
window.BMC_API_KEY = "";
```

Lalu commit dan push ke GitHub agar Vercel redeploy.


## Admin Knowledge Base

Endpoint berikut membutuhkan header `x-admin-key` yang cocok dengan `ADMIN_API_KEY`:

- `POST /api/knowledge/upload`
- `POST /api/knowledge/sources`
- `POST /api/knowledge/search`

Frontend admin dibuka lewat `?admin=1#knowledge-base`; user biasa tidak melihat menu Knowledge.
