# BMC AI Backend

Backend Express untuk BMC AI Agent Platform.

## Endpoint

- `GET /health`
- `POST /api/bmc/generate`
- `POST /api/bmc/chat`

Jika `OPENAI_API_KEY` kosong, backend tetap berjalan memakai generator lokal. Jika API key diisi, backend memakai OpenAI Chat Completions dan fallback lokal saat AI error.

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
