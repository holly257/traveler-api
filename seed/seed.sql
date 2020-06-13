--begin/commit wrap?

BEGIN;

TRUNCATE
  reviews,
  activities,
  days,
  trips,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (username, fullname, password, email)
    VALUES
        ('hollym', 'Holly Rogers', '$2a$10$yDWvm4XRH.wzxQgdtWnG..JdE2iiOvMFKp5ARS.k7.1uU8MGFnb0q', 'hollymrogers12@gmail.com'),
        ('ryanb', 'Ryan Basden', '$2a$10$6MOJw84J6q6YO5qzR0l2veKgzIFSjoimQeZDhetbpyt2Q0pX6N9Di', 'ryan@email.com');



INSERT INTO trips (name, city, country, user_id)
    VALUES
        ('Weekend Trip', 'Bangkok', 'Thailand', 1),
        ('Girls Trip', 'Savannah', 'USA', 1),
        ('Family Vacation', 'Mostar', 'Bosnia & Herzegovina', 2);



INSERT INTO days (trip_id)
    VALUES
        (1),
        (2),
        (1),
        (3),
        (3),
        (3),
        (2);



INSERT INTO activities (activity, meridiem, start_time, day_id)
    VALUES
        ('wake up', 'am', 8, 1),
        ('breakfast at cafe', 'am', 9, 1),
        ('get up', 'am', 10, 2),
        ('breakfast at restaurant', 'am', 11, 2),
        ('wake up', 'am', 9, 3),
        ('breakfast on beach', 'am', 11, 3),
        ('lunch with friend', 'pm', 2, 3),
        ('breakfast', 'am', 10, 4),
        ('beach time', 'pm', 1, 4),
        ('cafe with friend', 'pm', 3, 4),
        ('wake up', 'am', 10, 5),
        ('tour of Stari Most', 'pm', 2, 5),
        ('breakfast and coffee', 'am', 11, 6),
        ('morning walk', 'am', 7, 7),
        ('breakfast at cafe', 'am', 8, 7);



INSERT INTO  reviews (name, image, image_alt, city, country, address, rating, category, comments, user_id)
    VALUES
        ('Mad Panda Hostel', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTgH7HiQ02_-Fv8erSYt_wCqFPxFXdEHoMR-jUgRXP9G939MZmM&usqp=CAU', 'mad panda hostel logo', 'Hua Hin', 'Thailand', '76/2 Hua Hin 72/1 Alley, Hua Hin, Hua Hin District, Prachuap Khiri Khan 77110, Thailand', 5, 'lodging', 'Best place on earth!! Everyone is so friendly and the food is amazing!', 1),
        ('Crystal Beer Parlor', 'https://media-cdn.tripadvisor.com/media/photo-s/10/a5/a3/39/classic-crystal-burger.jpg', 'burger, onion rings, and beer', 'Savannah', 'USA', '301 W Jones St, Savannah, GA 31401', 4, 'bar/coffee', 'Great drinks! A little loud, but a nice place to start the night', 1),
        ('Stari Most Tour', 'https://www.wonders-of-the-world.net/Bridge-of-Mostar/images/Vignettes/Photos/Pont-de-Mostar-002-V.jpg', 'old bridge with blue water', 'Mostar', 'Bosnia & Herzegovina', 'Stari Most, Mostar 88000, Bosnia & Herzegovina', 5, 'activity', 'Beautiful views! Go early though, it gets crowded quickly.', 2);

COMMIT;