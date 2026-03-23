INSERT INTO users (id, name, status, region, signed_up_at) VALUES
  (1, 'Ada', 'active', 'na', '2026-03-18'),
  (2, 'Ben', 'inactive', 'eu', '2026-03-10'),
  (3, 'Cleo', 'active', 'na', '2026-03-21'),
  (4, 'Drew', 'active', 'apac', '2026-03-04'),
  (5, 'Elle', 'inactive', 'eu', '2026-03-19'),
  (6, 'Finn', 'active', 'eu', '2026-03-22')
ON CONFLICT (id) DO NOTHING;
