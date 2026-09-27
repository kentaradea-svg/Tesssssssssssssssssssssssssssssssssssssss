-- Example Postgres schema for attendance
-- Use timestamptz so timezone-aware timestamps are stored. Postgres stores timestamptz internally in UTC but displays according to session timezone.

CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  on_duty TIMESTAMPTZ,
  off_duty TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: set database default timezone to Asia/Jakarta (affects session display)
-- ALTER DATABASE your_db_name SET timezone = 'Asia/Jakarta';

-- Example insert using UTC values; display will be converted to WIB by server-side utilities.
-- INSERT INTO attendance (user_id, on_duty, off_duty) VALUES (1, '2026-09-27T01:00:00Z', '2026-09-27T09:30:00Z');
