# Halaman Pengaturan Pengguna

## Deskripsi

Halaman ini memungkinkan pengguna admin untuk mengganti username dan password login mereka dengan sistem keamanan yang kuat.

## Fitur

- **Verifikasi Password Saat Ini**: Pengguna harus memasukkan password saat ini untuk keamanan
- **Ubah Username**: Validasi format (hanya huruf, angka, underscore) dan panjang minimal 3 karakter
- **Ubah Password**: Validasi kekuatan password (min 8 karakter, kombinasi huruf besar, huruf kecil, angka)
- **Konfirmasi Password**: Memastikan password baru diketik dengan benar
- **Feedback Real-time**: Pesan error/success yang jelas untuk setiap aksi

## File-File

- `page.tsx` - Halaman UI dengan form perubahan kredensial
- `actions.ts` - Server action untuk memproses perubahan kredensial

## Akses

URL: `/admin/user`

## Validasi

- **Password Saat Ini**: Wajib, harus sesuai dengan password yang tersimpan
- **Username Baru**:
  - Format: `[a-zA-Z0-9_]`
  - Minimal 3 karakter
  - Opsional (tidak harus diubah)
- **Password Baru**:
  - Minimal 8 karakter
  - Harus mengandung huruf besar, huruf kecil, dan angka
  - Opsional (tidak harus diubah)

## Catatan Penting

- Halaman ini menggunakan in-memory store, artinya perubahan akan hilang saat server restart
- Untuk produksi, sebaiknya gunakan database untuk menyimpan kredensial
- Pastikan selalu menggunakan HTTPS untuk keamanan maksimal
