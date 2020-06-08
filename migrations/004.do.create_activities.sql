CREATE TYPE meridiem_category AS ENUM (
    'am',
    'pm',
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY, 
    activity TEXT NOT NULL,
    meridiem meridiem_category,
    start_time INTEGER NOT NULL,
    day_id INTEGER REFERENCES days(id) ON DELETE SET NULL
);

--using begin/commit with creating type and table