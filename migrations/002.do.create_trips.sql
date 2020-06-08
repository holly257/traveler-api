CREATE TABLE trips (
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);