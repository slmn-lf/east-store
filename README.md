# 🎨 East Store - Wear Art, Not Just Clothes

**East Store** adalah platform e-commerce modern untuk brand fashion yang menghadirkan kaos eksklusif dengan desain original dari seniman lokal. Menggunakan sistem pre-order eksklusif untuk menjaga kualitas dan eksklusivitas setiap koleksi.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextjs)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-gray?style=flat-square&logo=prisma)

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Instalasi](#instalasi)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Fitur Utama

### 🛍️ Untuk Customer
- **Pre-order Produk**: Pesan kaos sebelum produksi dimulai
- **Galeri Artwork**: Lihat desain eksklusif dari seniman lokal
- **Sistem Pembayaran**: Integrasi pembayaran digital
- **Form Dinamis**: Size chart dan customization per produk
- **WhatsApp Integration**: Konfirmasi preorder via WhatsApp
- **Responsive Design**: Mobile-first dan fully responsive

### 👨‍💼 Untuk Admin
- **Dashboard**: Statistik penjualan & preorder real-time
- **Product Management**: CRUD produk dengan multiple images
- **Order Tracking**: Monitor semua preorder dan payment status
- **Payment Management**: Kelola pembayaran dan status lunas
- **Settings Management**: Customize hero, about, contact sections
- **Size Template Manager**: Buat dan kelola size charts

### 🎨 Fitur Teknis
- **Dark Mode**: Interface modern dengan dark theme
- **Image Upload**: Integrasi Cloudinary untuk upload gambar
- **Authentication**: Sistem login & session management
- **Real-time Data**: Fetch data langsung dari database
- **SEO Optimized**: Meta tags dan structured data

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Runtime** | Node.js 20+ |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, PostCSS |
| **UI Components** | Lucide React (Icons) |
| **Database** | PostgreSQL (via Prisma ORM) |
| **ORM** | Prisma 6 |
| **Image Service** | Cloudinary |
| **Linting** | ESLint 9 |

---

## 📦 Persyaratan Sistem

- **Node.js**: v20 atau lebih tinggi
- **npm**: v10 atau lebih tinggi
- **PostgreSQL**: v12 atau lebih tinggi
- **Akun Cloudinary**: Untuk image hosting

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd eaststore
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 4. Konfigurasi Environment
Buat file `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/eaststore"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🎯 Scripts Tersedia

```bash
npm run dev       # Development server
npm run build     # Production build
npm start         # Start production server
npm run lint      # Code linting
```

---

## 📁 Struktur Folder

```
app/
├── admin/              # Admin dashboard
├── api/               # API routes
├── auth/              # Authentication
├── components/        # Reusable components
├── artwork/           # Artwork gallery
├── products/          # Product listing
└── contact/           # Contact page
```

---

## 🚀 Deployment

### Deploy ke Vercel

1. Push ke GitHub
2. Connect repository ke Vercel
3. Set environment variables
4. Deploy

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Clear Build Cache
```bash
rm -rf .next node_modules && npm install && npm run build
```

---

## 📈 SEO Features

- ✅ Meta tags optimization
- ✅ Open Graph integration
- ✅ Schema.org structured data
- ✅ Mobile-friendly responsive design
- ✅ Fast loading performance

---

## 📝 License

Proprietary - East Store Brand

---

**Last Updated**: 1 Desember 2025  
**Version**: 1.0.0
