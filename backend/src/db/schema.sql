CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT categories_default_owner_check CHECK ((is_default AND user_id IS NULL) OR (NOT is_default AND user_id IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS categories_default_unique ON categories (LOWER(name), type) WHERE user_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS categories_user_unique ON categories (user_id, LOWER(name), type) WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  description VARCHAR(140) NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  movement_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions (user_id, movement_date DESC);
CREATE INDEX IF NOT EXISTS transactions_user_category_idx ON transactions (user_id, category_id);

CREATE TABLE IF NOT EXISTS budgets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  month SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year SMALLINT NOT NULL CHECK (year BETWEEN 2000 AND 2100),
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category_id, month, year)
);

INSERT INTO categories (user_id, name, type, is_default) VALUES
  (NULL, 'Alimentación', 'expense', TRUE),
  (NULL, 'Transporte', 'expense', TRUE),
  (NULL, 'Vivienda', 'expense', TRUE),
  (NULL, 'Servicios', 'expense', TRUE),
  (NULL, 'Salud', 'expense', TRUE),
  (NULL, 'Educación', 'expense', TRUE),
  (NULL, 'Entretenimiento', 'expense', TRUE),
  (NULL, 'Compras', 'expense', TRUE),
  (NULL, 'Otros', 'expense', TRUE),
  (NULL, 'Sueldo', 'income', TRUE),
  (NULL, 'Trabajo independiente', 'income', TRUE),
  (NULL, 'Ventas', 'income', TRUE),
  (NULL, 'Inversiones', 'income', TRUE),
  (NULL, 'Otros', 'income', TRUE)
ON CONFLICT DO NOTHING;
