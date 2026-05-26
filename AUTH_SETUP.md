# 🔐 SISAIN Authentication Setup Guide

Panduan lengkap untuk mengaktifkan sistem login/register dengan Supabase.

---

## 📋 Prerequisites

- Akun Supabase (gratis) - [Daftar di sini](https://supabase.com)
- Node.js dan npm sudah terinstall
- Project SISAIN sudah di-clone

---

## 🚀 Step-by-Step Setup

### 1. **Buat Project Supabase**

1. Buka [https://app.supabase.com](https://app.supabase.com)
2. Klik **"New Project"**
3. Isi detail project:
   - **Name**: `sisain` (atau nama lain)
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih yang terdekat (contoh: `Southeast Asia (Singapore)`)
4. Klik **"Create new project"**
5. Tunggu ~2 menit sampai project selesai dibuat

---

### 2. **Dapatkan API Keys**

1. Di dashboard Supabase, buka **Settings** (⚙️) → **API**
2. Copy 2 nilai ini:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public** key (key yang panjang)

---

### 3. **Setup Environment Variables**

1. Di root folder project, buat file `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` dan isi dengan nilai dari Supabase:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **PENTING**: Jangan commit file `.env` ke Git! (sudah ada di `.gitignore`)

---

### 4. **Buat Database Schema**

1. Di dashboard Supabase, buka **SQL Editor** (ikon database)
2. Klik **"New query"**
3. Copy seluruh isi file `.kiro/supabase_schema.sql`
4. Paste ke SQL Editor
5. Klik **"Run"** atau tekan `Ctrl+Enter`
6. Pastikan muncul pesan sukses (hijau) ✅

**Apa yang dibuat:**
- ✅ Tabel `profiles` untuk data user
- ✅ Tabel `products` untuk produk merchant
- ✅ Tabel `orders` dan `order_items` untuk transaksi
- ✅ Row Level Security (RLS) policies
- ✅ Indexes untuk performa optimal

---

### 5. **Konfigurasi Email Authentication**

1. Di dashboard Supabase, buka **Authentication** → **Providers**
2. Pastikan **Email** provider sudah enabled (default: ON)
3. Scroll ke bawah, klik **Email Templates**
4. Customize email template jika perlu (opsional)

**Email Settings (opsional tapi recommended):**
- Buka **Settings** → **Auth**
- **Enable email confirmations**: ON (user harus verifikasi email)
- **Secure email change**: ON (keamanan ekstra)

---

### 6. **Install Dependencies & Run**

```bash
# Install dependencies (jika belum)
npm install

# Run development server
npm run dev
```

Buka browser di `http://localhost:5173`

---

## ✅ Testing Authentication

### Test Register (Merchant)
1. Klik tombol **"Bergabung"** di header
2. Pilih **"Merchant"**
3. Isi form registrasi:
   - Nama Usaha: `Warung Test`
   - Email: `merchant@test.com`
   - Password: `test1234`
4. Klik **"Daftar sebagai Merchant"**
5. Cek email untuk link verifikasi (jika email confirmation enabled)

### Test Register (Pelanggan)
1. Klik **"Bergabung"** → Pilih **"Pelanggan"**
2. Isi form dengan data test
3. Submit

### Test Login
1. Klik tombol **"Masuk"** di header
2. Masukkan email & password yang sudah didaftarkan
3. Klik **"Masuk"**
4. Jika berhasil, nama user muncul di header

### Test Logout
1. Klik tombol **"Keluar"** di header
2. User akan logout dan kembali ke home

---

## 🔍 Verifikasi Database

Cek apakah data tersimpan:

1. Buka **Table Editor** di Supabase
2. Pilih tabel **`profiles`**
3. Lihat data user yang baru register

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
- ✅ Pastikan `.env` file ada dan terisi dengan benar
- ✅ Restart dev server (`npm run dev`)
- ✅ Cek tidak ada spasi atau karakter aneh di API key

### Error: "relation 'profiles' does not exist"
- ✅ Jalankan ulang SQL schema di SQL Editor
- ✅ Pastikan tidak ada error saat run SQL

### Email tidak terkirim
- ✅ Cek spam folder
- ✅ Untuk development, bisa disable email confirmation:
  - **Settings** → **Auth** → **Enable email confirmations**: OFF

### Password tidak bisa dilihat
- ✅ Klik icon mata (👁️) di field password untuk toggle visibility

### User tidak bisa login setelah register
- ✅ Jika email confirmation enabled, user harus klik link di email dulu
- ✅ Atau disable email confirmation untuk testing

---

## 📊 Database Structure

### Table: `profiles`
```sql
- id (UUID, PK) → references auth.users
- email (TEXT, UNIQUE)
- full_name (TEXT)
- username (TEXT, UNIQUE)
- role (TEXT) → 'customer' | 'merchant'
- phone (TEXT)
- birth_date (DATE) → customer only
- city (TEXT) → customer only
- referral_code (TEXT) → customer only
- business_name (TEXT) → merchant only
- category (TEXT) → merchant only
- address (TEXT) → merchant only
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🔒 Security Features

✅ **Row Level Security (RLS)** - User hanya bisa akses data mereka sendiri
✅ **Password Hashing** - Password di-hash otomatis oleh Supabase Auth
✅ **JWT Tokens** - Session management dengan JWT
✅ **Email Verification** - Opsional, bisa diaktifkan
✅ **Password Reset** - Built-in (bisa dikustomisasi)

---

## 🎯 Next Steps

Setelah auth berfungsi, kamu bisa:

1. **Integrate dengan fitur lain:**
   - Merchant bisa upload produk (sudah ada tabel `products`)
   - Customer bisa checkout (sudah ada tabel `orders`)

2. **Customize email templates:**
   - Welcome email
   - Password reset email
   - Email verification

3. **Add social login:**
   - Google OAuth
   - Facebook Login
   - GitHub Login

4. **Add profile page:**
   - Edit profile
   - Upload avatar
   - Change password

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💡 Tips

- **Development**: Disable email confirmation untuk testing lebih cepat
- **Production**: Enable email confirmation untuk keamanan
- **Testing**: Gunakan email temporary seperti [temp-mail.org](https://temp-mail.org)
- **Backup**: Export database schema secara berkala

---

## 🆘 Need Help?

Jika ada masalah:
1. Cek console browser (F12) untuk error messages
2. Cek Supabase logs: **Logs** → **Auth Logs**
3. Baca error message dengan teliti
4. Google error message + "supabase"

---

**Happy Coding! 🚀**
