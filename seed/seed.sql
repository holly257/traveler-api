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
        ('ryanb', 'Ryan Basden', '$2a$10$6MOJw84J6q6YO5qzR0l2veKgzIFSjoimQeZDhetbpyt2Q0pX6N9Di', 'ryan@email.com'),
        ('test_user', 'test user', '$2a$10$kqodgxgrdQHTX/ytrQ7DT.PL94A2j7VI2cs2saudlTSH7luVh3b9e', 'test@gmail.com');



INSERT INTO trips (name, city, country, user_id)
    VALUES
        ('Weekend Trip', 'Bangkok', 'Thailand', 1),
        ('Girls Trip', 'Savannah', 'USA', 1),
        ('Family Vacation', 'Mostar', 'Bosnia & Herzegovina', 2),
        ('Work Trip', 'Atlanta', 'USA', 3),
        ('Family Vacation', 'Miami', 'USA', 3);


INSERT INTO days (trip_id)
    VALUES
        (1),
        (2),
        (1),
        (3),
        (3),
        (3),
        (2),
        (4), 
        (4),
        (5),
        (5);



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
        ('breakfast at cafe', 'am', 8, 7),
        ('breakfast at cafe', 'am', 8, 8),
        ('lunch', 'pm', 1, 8),
        ('breakfast on the beach', 'am', 8, 10);



INSERT INTO  reviews (name, image, image_alt, city, country, address, rating, category, comments, user_id)
    VALUES
        ('Mad Panda Hostel', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTgH7HiQ02_-Fv8erSYt_wCqFPxFXdEHoMR-jUgRXP9G939MZmM&usqp=CAU', 'mad panda hostel logo', 'Hua Hin', 'Thailand', '76/2 Hua Hin 72/1 Alley, Hua Hin, Hua Hin District, Prachuap Khiri Khan 77110, Thailand', 5, 'lodging', 'Best place on earth!! Everyone is so friendly and the food is amazing!', 1),
        ('Crystal Beer Parlor', 'https://media-cdn.tripadvisor.com/media/photo-s/10/a5/a3/39/classic-crystal-burger.jpg', 'burger, onion rings, and beer', 'Savannah', 'USA', '301 W Jones St, Savannah, GA 31401', 4, 'bar/coffee', 'Great drinks! A little loud, but a nice place to start the night', 1),
        ('Stari Most Tour', 'https://www.wonders-of-the-world.net/Bridge-of-Mostar/images/Vignettes/Photos/Pont-de-Mostar-002-V.jpg', 'old bridge with blue water', 'Mostar', 'Bosnia & Herzegovina', 'Stari Most, Mostar 88000, Bosnia & Herzegovina', 5, 'activity', 'Beautiful views! Go early though, it gets crowded quickly.', 2),
        ('Crooked Tree Cafe', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQjjMaGYpTnzjuqJXucUowyNInQWWL5r2j6tJqt-XhMaolK47ew&usqp=CAU', 'cafe with plants', 'Battambong', 'Cambodia', 'No. 56, Street 2.5, Krong Battambang, Cambodia', 5, 'restaurant', 'Cozy place for coffee or food. Friendly staff!', 3),
        ('Bran Castle', 'https://www.twoscotsabroad.com/wp-content/uploads/2019/07/Bran-Castle-Romania-with-blue-skies.jpg', 'castle in Romania with trees', 'Bran', 'Romania', 'Strada General Traian Moșoiu 24, Bran 507025, Romania', 2, 'activity', 'It is okay as long as you know what you are getting into. It is definitely a tourist trap. There is beautiful hiking nearby.', 3),
        ('Shenanigans Restaurant & Irish Pub', 'https://media-cdn.tripadvisor.com/media/photo-s/07/dd/dd/52/shenanigans-irish-pub.jpg', 'Irish Pub burger and fries', 'Dahlonega', 'USA', '87 N Chestatee St, Dahlonega, GA 30533-1101', 5, 'restaurant', 'Best burger and fries in town! Small place, so it gets crowded during peak meal times. The crack dip comes highly recommended!!', 1),
        ('Muizenberg Beach Huts', 'https://images.unsplash.com/photo-1474874055390-459bc92357f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1146&q=80', 'Color beach huts on sandy beach', 'Cape Town', 'South Africa', 'Beach Rd, Muizenberg, Cape Town, 7950, South Africa', 5, 'activity', 'Beautiful beach and huts. One of the must do things in Cape Town! Just do not stay past dark - it can be a dangerous city for tourists.', 3),
        ('Hiking near Bran Castle', 'https://images.unsplash.com/photo-1584739117835-32893df5d5fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=640&q=80', 'mountains in Romania', 'Bran', 'Romania', 'Follow the trail signs from Bran', 4, 'activity', 'Beautiful hiking in Romania, near Bran castle. Make sure to bring enough food and water - it is a long hike.', 3),
        ('Woolworths', 'https://movendi.ngo/wp-content/uploads/2019/07/woolworths-pre-1024x545.jpg', 'grocery store', 'Cape Town', 'South Africa', '11 DF Malan, Roggebaai Square, Cape Town, 8012, South Africa', 5, 'shopping', 'best place to get groceries and snacks on your trip.', 1),
        ('Lions Head', 'https://images.unsplash.com/photo-1591205024850-d3420e30469e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80', 'lions head mountain and lift in clouds', 'Cape Town', 'South Africa', 'Signal Hill, Cape Town, 8001, South Africa', 5, 'activity', 'Easy ride in the lift with a beautiful view. Gets very crowded in the afternoon', 2),
        ('Penguin Colony', 'https://images.unsplash.com/photo-1530273745941-4bb6a3669e93?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80', 'penguins on the beach', 'Cape Town', 'South Africa', '4 Boulders Place, Secluse Ave, Simons Town, Cape Town, 7995, South Africa', 4, 'activity', 'Beautiful place to see penguins and the beach - but a very long, curvy drive from downtown.', 1),
        ('Piedmont Park', 'https://images.unsplash.com/photo-1444852538915-ac95232916dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80', 'view of atlanta skyline over lake', 'Atlanta', 'USA', '400 Park Dr NE, Atlanta, GA 30306', 5, 'activity', 'Beautiful city view - best at sunset or for a picnic', 3),
        ('The Vortex', 'https://www.ajc.com/rf/image_inline/Pub/p6/AJC/2015/08/12/Images/photos.medleyphoto.7901658.JPG', 'the vortex burgers', 'Atlanta', 'USA', '438 Moreland Ave NE, Atlanta, GA 30307', 5, 'restaurant', 'Best burgers in town! Famous for being unhealthy and not kid friendly', 2),
        ('Little Five Points Pizza', 'https://media-cdn.tripadvisor.com/media/photo-s/04/ab/2d/c6/little-five-points-pizza.jpg', 'pizza restaurant', 'Atlanta', 'USA', '422 Seminole Ave NE, Atlanta, GA 30307', 5, 'restaurant', 'Amazing pizza and a great price!', 1),
        ('Ponce City Market', 'https://www.ajc.com/rf/image_lowres/Pub/p10/AJC/2019/12/30/Videos/4814052.vpx', 'Brick building - ponce city market', 'Atlanta', 'USA', '675 Ponce De Leon Ave NE, Atlatna, Ga', 4, 'shopping', 'Cool place to meet for drinks, dinner, or shopping. Can be a little crowded and sometimes expensive.', 2),
        ('Caffe Bar Fratello', 'https://lh3.googleusercontent.com/p/AF1QipOAmRvR5QJJMbUMrFmkXPb7PWNGkipJHsWOEAy5=w600-k', 'cafe doorway', 'Mostar', 'Bosnia & Herzegovina', 'Mostar 88000, Bosnia & Herzegovina', 5, 'bar/coffee', 'Peaceful place to get your morning coffee', 1);

INSERT INTO bookmarks (user_id, review_id)
    VALUES
        (1, 4),
        (2, 3),
        (1, 2),
        (2, 1),
        (3, 1),
        (3, 4);

COMMIT;