# SISAIN - Versi Hardcoded (Tanpa Backend)

## Perubahan yang Dilakukan

Aplikasi SISAIN sekarang berjalan dengan data hardcoded tanpa memerlukan backend Supabase.

### File yang Dimodifikasi:
- `src/App.jsx` - Menghapus semua integrasi Supabase dan menggunakan data lokal

### File Backup:
- `src/App_with_supabase.jsx` - Backup versi dengan Supabase (jika ingin kembali ke versi backend)

## Fitur yang Masih Berfungsi:

### ✅ Autentikasi (Hardcoded)
- **Login**: Masukkan email apa saja
  - Email dengan kata "merchant" → Login sebagai merchant
  - Email lainnya → Login sebagai customer
- **Register Merchant**: Form pendaftaran merchant (data disimpan di state lokal)
- **Register Customer**: Form pendaftaran pelanggan (data disimpan di state lokal)
- **Google Login**: Simulasi login Google (demo mode)
  - Setelah klik "Login dengan Google", akan muncul modal **Complete Profile**
  - Modal ini meminta data lengkap sesuai role (Merchant/Customer)
  - **Upload foto profil/logo bisnis** dengan preview
  - Form berbeda untuk Merchant dan Customer
- **Logout**: Menghapus data user dari state

### ✅ Fitur Customer
- Browse produk surplus dengan data hardcoded
- Filter berdasarkan kategori, harga, jarak, rating
- Pencarian produk
- Keranjang belanja (local state)
- Riwayat pesanan (local state)
- Sistem koin dan badge
- Chatbot AI (jika API key Gemini tersedia)

### ✅ Fitur Merchant
- Dashboard merchant
- Tambah produk baru (disimpan di local state)
- Manajemen toko (buka/tutup)
- Statistik penjualan (data dummy)
- Penarikan saldo (simulasi)

### ✅ Fitur Umum
- Multi-bahasa (Indonesia/English)
- Responsive design
- Toast notifications
- Geolocation dengan nested regions
- PWA support

## Cara Menjalankan:

```bash
npm run dev
```

Aplikasi akan berjalan di: http://localhost:5173/

## Demo Login:

### Sebagai Merchant:
- Email: `merchant@test.com` (atau email apa saja yang mengandung kata "merchant")
- Password: `12345678` (password apa saja, minimal 8 karakter)

### Sebagai Customer:
- Email: `customer@test.com` (atau email apa saja tanpa kata "merchant")
- Password: `12345678` (password apa saja, minimal 8 karakter)

## Catatan:

- Semua data disimpan di **state lokal** (akan hilang saat refresh halaman)
- Tidak ada validasi email/password yang sebenarnya
- Produk yang ditambahkan merchant akan hilang saat refresh
- Cocok untuk demo, presentasi, atau development tanpa backend

## Kembali ke Versi Backend:

Jika ingin kembali menggunakan Supabase:

```bash
# Restore backup
cp src/App_with_supabase.jsx src/App.jsx
```

---

**Dibuat untuk**: Demo GEMASTIK 2026
**Versi**: Hardcoded (No Backend)
**Tanggal**: 27 Mei 2026
