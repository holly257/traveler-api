CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    fullname TEXT NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(254) NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);