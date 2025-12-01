# Panduan Deploy Project ke Vercel

## 1. Persiapan Awal

```bash
# Pastikan semua perubahan sudah di-commit
git add .
git commit -m "Fix TypeScript errors for deployment"
git push origin main
```

## 2. Setup Vercel Account

- Buka https://vercel.com
- Sign up atau login dengan GitHub account Anda
- Vercel akan terhubung otomatis dengan repository GitHub

## 3. Import Project ke Vercel

- Di dashboard Vercel, klik **"Add New..."** → **"Project"**
- Pilih repository `east-store` dari GitHub
- Klik **"Import"**

## 4. Konfigurasi Build & Environment Variables

### Build Settings:

- **Framework Preset**: Next.js (deteksi otomatis)
- **Build Command**: `npm run build` ✓ (sudah benar)
- **Output Directory**: `.next` ✓ (default Next.js)
- **Install Command**: `npm install` ✓ (default)

### Environment Variables:

Tambahkan di Vercel dashboard (Settings → Environment Variables):

```
DATABASE_URL=<your_database_url>
```

⚠️ **PENTING**: Dapatkan `DATABASE_URL` dari Neon, Railway, atau database provider Anda

## 5. Prisma Setup

Vercel perlu generate Prisma Client saat build. Tambahkan di `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "prisma generate"
  }
}
```

Atau buat `vercel.json` di root:

```json
{
  "buildCommand": "prisma generate && next build"
}
```

## 6. Deploy ke Production

- Klik **"Deploy"** di Vercel dashboard
- Vercel akan:
  - Clone repository
  - Install dependencies
  - Generate Prisma schema
  - Build Next.js project
  - Deploy ke edge network

## 7. Setup Domain

- Di Vercel dashboard → **Settings** → **Domains**
- Tambahkan custom domain atau gunakan default `<project>.vercel.app`

## 8. Monitor Build & Logs

```bash
# Jika ingin deploy dari CLI local:
npm i -g vercel
vercel
# Follow prompts untuk link project
```

## 9. Troubleshooting

Jika ada error saat deploy:

- **TypeScript errors**: Sudah diperbaiki ✓
- **Database migration**: Jalankan `prisma migrate deploy` setelah deploy
- **Environment variables**: Pastikan semua var sudah di-set di Vercel
- **Build time**: Monitor di Vercel logs, Next.js 16 with Turbopack lebih cepat

## 10. Post-Deployment

```bash
# Jalankan database migrations di production
vercel env pull  # Pull .env.local dari Vercel
npx prisma migrate deploy
```

## Checklist Sebelum Deploy

- [ ] Semua kode di-push ke branch `main`
- [ ] TypeScript errors sudah diperbaiki
- [ ] Environment variables sudah dikonfigurasi
- [ ] Database URL sudah di-set
- [ ] Prisma migrations sudah siap
- [ ] `.env.local` tidak di-commit (check `.gitignore`)

---

Siap! Klik **Deploy** dan tunggu ~2-3 menit untuk selesai. 🚀
