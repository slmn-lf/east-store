# Content Settings Page

## Deskripsi

Halaman admin untuk mengelola semua konten di halaman utama (hero section, cara pesan, tentang kami) dan halaman contact.

## Fitur Utama

### 1. Hero Section

- Judul utama
- Deskripsi
- CTA Button 1 & 2 text

### 2. Cara Pesan (How To Order)

- Judul dan deskripsi bagian
- Tiga langkah pemesanan dengan judul dan deskripsi masing-masing

### 3. Tentang Kami (About)

- Judul bagian
- Subtitle
- Konten utama
- Tiga fitur utama dengan judul dan deskripsi

### 4. Contact Information

- Judul halaman
- Deskripsi
- Informasi lokasi (jalan dan kota)
- Email dan nomor telepon
- Jam operasional

## Struktur File

- `page.tsx` - Halaman UI dengan tab navigation
- `actions.ts` - Server actions untuk menyimpan konten

## Tab Navigation

Halaman menggunakan sistem tab untuk navigasi antar bagian:

- Hero Section (🏠)
- Cara Pesan (📋)
- Tentang Kami (ℹ️)
- Contact Info (📧)

## Styling

- Dark theme glassmorphism
- Amber/Orange gradient buttons
- Real-time validation
- Responsive design

## Catatan

- Data saat ini disimpan dalam memory store (reset saat server restart)
- Untuk production, gunakan database untuk persistent storage
- Setiap perubahan akan di-revalidate untuk paths `/`, `/contact`, dan `/admin/settings`

## Akses

URL: `/admin/settings`
Hanya bisa diakses setelah login sebagai admin.
