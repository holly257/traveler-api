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
    --best type for url/storing image?
    image TEXT NOT NULL,
    image_alt TEXT,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT,
    --NUM BETWEEN 1 AND 5 - enum or integer/smallint? 
    rating SMALLINT NOT NULL,
    category review_category,
    comments TEXT NOT NULL,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);