# BMC AI Agent Platform

Prototype aplikasi Business Model Canvas AI Agent Platform sesuai brief lampiran.

## Cara membuka

Buka `index.html` langsung di browser. Jika ingin memakai backend AI di Contabo, edit `config.js` lalu isi `window.BMC_API_URL` dengan domain API backend.

## Fitur MVP

- Landing page SaaS dengan hero, workflow, pricing, testimonial, FAQ, dan final CTA.
- Generator BMC 9 blok dari ide bisnis pengguna.
- Chat refinement untuk revenue, channel, customer segment, risiko, pricing, MVP, dan blok BMC lain.
- Voice input melalui Web Speech API jika browser mendukung.
- Upload `.txt` dan `.md` sebagai konteks langsung. File `.pdf`, `.docx`, dan `.pptx` diterima sebagai sinyal konteks; parsing penuh disiapkan untuk backend.
- Export BMC sebagai Markdown, HTML, atau print PDF dari browser.
- Social Media AI Agent untuk membuat 5 draft post lintas Instagram, LinkedIn, X, TikTok, dan Facebook.

## Backend

Backend Express sudah tersedia di folder `backend/` dengan endpoint `GET /health`, `POST /api/bmc/generate`, dan `POST /api/bmc/chat`. Backend bisa memakai OpenAI API jika `OPENAI_API_KEY` diisi, dan otomatis fallback ke generator lokal jika API key kosong atau request AI gagal.

Untuk deploy Contabo dengan PM2, lihat `backend/README.md`.

## Catatan produksi

Untuk frontend Vercel, API Contabo sebaiknya dipasang di domain HTTPS lewat Nginx reverse proxy, lalu isi `config.js`:

```js
window.BMC_API_URL = "https://api.domain-anda.com";
window.BMC_API_KEY = "";
```

Fase berikutnya bisa menambahkan Supabase Auth, Midtrans/Stripe, penyimpanan BMC, RAG pgvector/Pinecone, serta MCP social publishing seperti Kadenzo atau Outpost. Rencana knowledge base kurasi buku/paper ada di `docs/curated-knowledge-base.md`.

Trigger Vercel deploy

## Knowledge Base Admin

Fitur upload buku/paper kurasi disembunyikan dari user biasa dan endpoint backend dilindungi dengan `ADMIN_API_KEY`.

1. Set `ADMIN_API_KEY` di `backend/.env` pada server Contabo.
2. Restart backend.
3. Buka admin area lewat `https://www.yourfuture.fun/?admin=1#knowledge-base`.
4. Masukkan admin key di browser. Key disimpan hanya di `sessionStorage` browser admin.

Jangan menaruh `ADMIN_API_KEY` di `config.js` karena file frontend bisa dilihat publik.

Trigger Vercel deploy
Trigger Vercel deploy - voice input cleanup
1 
1
1
1
1
1
