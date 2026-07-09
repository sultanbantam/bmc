# BMC AI Agent Platform

Prototype aplikasi Business Model Canvas AI Agent Platform sesuai brief lampiran.

## Cara membuka

Buka `index.html` langsung di browser.

## Fitur MVP

- Landing page SaaS dengan hero, workflow, pricing, testimonial, FAQ, dan final CTA.
- Generator BMC 9 blok dari ide bisnis pengguna.
- Chat refinement untuk revenue, channel, customer segment, risiko, pricing, MVP, dan blok BMC lain.
- Voice input melalui Web Speech API jika browser mendukung.
- Upload `.txt` dan `.md` sebagai konteks langsung. File `.pdf`, `.docx`, dan `.pptx` diterima sebagai sinyal konteks; parsing penuh disiapkan untuk backend.
- Export BMC sebagai Markdown, HTML, atau print PDF dari browser.
- Social Media AI Agent untuk membuat 5 draft post lintas Instagram, LinkedIn, X, TikTok, dan Facebook.

## Catatan integrasi backend

Versi ini berjalan offline dengan generator heuristik di frontend. Untuk produksi, ganti fungsi `buildBmc`, `buildRisks`, dan `answerQuestion` di `app.js` menjadi panggilan API LLM terstruktur, lalu tambahkan Supabase Auth, Midtrans/Stripe, RAG pgvector/Pinecone, serta MCP social publishing seperti Kadenzo atau Outpost.
