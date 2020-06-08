CREATE TABLE days (
    id SERIAL PRIMARY KEY, 
    trip_id INTEGER REFERENCES trips(id) ON DELETE SET NULL
    --does this need to also have the activity ids?
);