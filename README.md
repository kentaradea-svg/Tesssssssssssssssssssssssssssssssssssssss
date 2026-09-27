# Last Paradise Police Department Attendance System

Sistem absensi full-stack untuk LAST PARADISE POLICE DEPARTMENT. Data anggota dan sesi duty tersimpan di SQLite, bukan localStorage.

## Fitur
- Google OAuth 2.0 untuk anggota terdaftar berdasarkan email Google.
- Login admin terpisah dengan HTTP-only session.
- ON DUTY / OFF DUTY berbasis waktu server dan tetap tersimpan saat browser ditutup.
- Durasi sesi, rekap harian, mingguan Senin-Minggu, history, live admin monitor.
- CRUD anggota dengan soft delete, foto URL, kategori dan pangkat tervalidasi.
- Responsive React UI, Tailwind CSS, REST API, timezone `Asia/Makassar`.

## Requirements
Node.js 20+ dan npm. Google Cloud project hanya diperlukan untuk mengaktifkan login anggota.

## Installation
```bash
npm install
npm install --prefix client
copy .env.example .env
npm run dev
```
Frontend berjalan di `http://localhost:5173`, API di `http://localhost:3000`. Perintah `npm run dev` menjalankan keduanya.

## Database Setup
Database dibuat otomatis pada `server/database/attendance.sqlite` saat server pertama kali dijalankan. Schema memakai foreign key dan menyimpan `duration_seconds` sebagai angka.

## Google OAuth Setup
1. Buka Google Cloud Console dan buat project.
2. Aktifkan Google People API bila diminta.
3. Buat OAuth consent screen (External untuk testing) dan tambahkan akun tester.
4. Buat OAuth Client ID dengan tipe Web application.
5. Authorized JavaScript origins: `http://localhost:5173`.
6. Authorized redirect URI: `http://localhost:3000/api/auth/google/callback`.
7. Salin Client ID dan Client Secret ke `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=use-a-long-random-value
```
Sebelum login anggota, admin harus mendaftarkan email Google yang sama melalui Admin > Anggota.

## Configuration
`config/siteConfig.js` berisi nama, logo, favicon, warna utama, dan timezone. Ganti `logo: '/logo.svg'` ke `/logo.png`, lalu taruh file tersebut di `client/public/logo.png`; URL itu dipakai oleh UI login, sidebar, navbar, dan favicon dapat diganti di `client/index.html`.

Credential admin dipusatkan di `.env` (`ADMIN_USERNAME` dan `ADMIN_PASSWORD`), sehingga password tidak pernah dikirim ke frontend. Nilai fallback tersedia di `config/adminConfig.js` untuk development, tetapi production wajib memakai `.env` dan secret kuat. Restart server setelah mengganti credential.

## Menambahkan Anggota Pertama
1. Buka `http://localhost:5173`.
2. Klik `Admin access`.
3. Login memakai `ADMIN_USERNAME` / `ADMIN_PASSWORD` dari `.env`.
4. Buka Anggota > Tambah anggota.
5. Masukkan nama, kategori, pangkat, dan email Google yang akan dipakai login.

## How Attendance Works
ON DUTY membuat baris baru dengan timestamp server. OFF DUTY menutup baris tersebut dan menghitung `duration_seconds`. Sesi aktif tidak dihapus saat refresh/restart. Total hari dan minggu menjumlahkan seluruh sesi, termasuk beberapa sesi dalam hari yang sama.

## API
`GET /api/auth/me`, `GET /api/member/profile`, `GET /api/member/today`, `GET /api/member/history`, `GET /api/member/weekly`, `POST /api/attendance/on`, `POST /api/attendance/off`, serta endpoint admin di `/api/admin/*`.

## Development and Production
```bash
npm run dev
npm run build
NODE_ENV=production npm start
```
Untuk production, build frontend lalu sajikan melalui server Express, gunakan HTTPS, `SESSION_SECRET` acak, dan atur callback URL Google ke domain HTTPS. `.env` dan database tidak boleh di-commit.

## Troubleshooting
- `Akun Google belum terdaftar`: email Google harus sama persis dengan email anggota aktif di database.
- Callback Google gagal: cek origin, callback URL, dan `GOOGLE_*` di `.env`.
- Session hilang: pastikan `SESSION_SECRET` stabil, browser mengizinkan cookie, dan gunakan HTTPS di production.
- Port bentrok: ubah `PORT` untuk API atau port Vite di `client/vite.config.js`.
- Login admin gagal: cek `.env`, restart server, dan jangan menaruh password di frontend.
