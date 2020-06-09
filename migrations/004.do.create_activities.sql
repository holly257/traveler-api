BEGIN;

CREATE TYPE meridiem_category AS ENUM (
    'am',
    'pm'
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY, 
    activity TEXT NOT NULL,
    meridiem meridiem_category,
    start_time TIME NOT NULL,
    day_id INTEGER REFERENCES days(id) ON DELETE CASCADE
);

COMMIT;