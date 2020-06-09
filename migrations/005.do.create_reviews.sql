BEGIN;

CREATE TYPE review_category AS ENUM (
    'restaurant',
    'bar/coffee',
    'shopping',
    'activity',
    'lodging'
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    image_alt TEXT,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT,
    rating SMALLINT NOT NULL,
    category review_category,
    comments TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

COMMIT;
--seperating review from place data - two tables, so you can have multiple reviews per place