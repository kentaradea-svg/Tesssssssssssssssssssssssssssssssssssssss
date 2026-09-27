Project: Attendance (WIB)

Ringkasan:
- Next.js app siap import ke Vercel.
- Menggunakan Supabase (Postgres) sebagai contoh datasource.
- Semua waktu ditampilkan dalam WIB (Asia/Jakarta) — tidak memakai timezone browser.
- Minggu dihitung Senin–Minggu (week starts Monday).

Langkah cepat:
1) Buat project di Supabase / Postgres dan dapatkan URL + SERVICE_ROLE_KEY.
2) Di Vercel (Environment Variables):
   - SUPABASE_URL = <your supabase url>
   - SUPABASE_SERVICE_ROLE_KEY = <service role key>   (server-side only)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = <anon key>      (untuk client jika perlu)
3) Deploy ke Vercel: import folder ini, set env vars di atas, deploy.

Catatan waktu/arsitektur:
- Server (API routes) men-format dan menghitung durasi menggunakan zona Asia/Jakarta.
- Di database gunakan timestamptz untuk kolom waktu; default penyimpanan internal Postgres tetap UTC, tetapi session/db timezone bisa diset ke 'Asia/Jakarta' jika diinginkan.
- Implementasi ini mengonversi nilai yang diterima dari DB ke zone 'Asia/Jakarta' dan menghitung minggu dengan Monday=1.

Files penting:
- pages/api/attendance.js  -- API yang mengembalikan data attendance dengan waktu WIB dan pengelompokan mingguan (Senin-Minggu)
- lib/time.js              -- util konversi dan perhitungan durasi (Luxon)
- lib/supabase.js          -- client Supabase untuk server
- sql/schema.sql           -- contoh schema tabel attendance

Jika ingin, dapatkan juga script seed atau integrasi UI tambahan.
