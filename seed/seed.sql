--begin/commit wrap?

INSERT INTO users (username, fullname, password, email)
    VALUES
        ('hollym', 'Holly Rogers', 'password', 'hollymrogers12@gmail.com'),
        ('ryanb', 'Ryan Basden', 'passwordz', 'ryan@email.com');



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
        (3);



INSERT INTO activities (activity, meridiem, start_time, day_id)
    VALUES
        ('wake up', 'am', 8, 1),
        ('breakfast at cafe', 'am', 9, 1),
        ('get up', 'am', 10, 2),
        ('breakfast at restaurant', 'am', 11, 2),
        ('wake up', 'am', 9, 3),
        ('breakfast on beach', 'am', 11, 3),
        ('breakfast', 'am', 10, 4),
        ('wake up', 'am', 10, 5),
        ('breakfast and coffee', 'am', 11, 6);



INSERT INTO  reviews (name, image, image_alt, city, country, address, rating, category, comments, user_id)
    VALUES
        ('Mad Panda Hostel', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTgH7HiQ02_-Fv8erSYt_wCqFPxFXdEHoMR-jUgRXP9G939MZmM&usqp=CAU', 'mad panda hostel logo', 'Hua Hin', 'Thailand', '76/2 Hua Hin 72/1 Alley, Hua Hin, Hua Hin District, Prachuap Khiri Khan 77110, Thailand', 5, 'lodging', 'Best place on earth!! Everyone is so friendly and the food is amazing!', 1),
        ('Crystal Beer Parlor', 'https://media-cdn.tripadvisor.com/media/photo-s/10/a5/a3/39/classic-crystal-burger.jpg', 'burger, onion rings, and beer', 'Savannah', 'USA', '301 W Jones St, Savannah, GA 31401', 4, 'bar/coffee', 'Great drinks! A little loud, but a nice place to start the night', 1),
        ('Stari Most Tour', 'https://www.wonders-of-the-world.net/Bridge-of-Mostar/images/Vignettes/Photos/Pont-de-Mostar-002-V.jpg', 'old bridge with blue water', 'Mostar', 'Bosnia & Herzegovina', 'Stari Most, Mostar 88000, Bosnia & Herzegovina', 5, 'activity', 'Beautiful views! Go early though, it gets crowded quickly.', 2);



-- export default {
--     trips: [
--         {
--             trip_id: '16a0462d-a1e9-49be-86ab-63e4e7c4b99b',
--             user_id: 1,
--             name: 'Weekend Trip',
--             location: {
--                 city: 'Bangkok',
--                 country: 'Thailand',
--             },
--             days: [
--                 {
--                     day_id: '4b483c04-bd20-4f04-8b12-0cd4dbb57793',
--                     activity: [
--                         {
--                             activity_id: 'cbb00270-9073-4b35-8eaa-eb27ce5901f7',
--                             start_time: 8,
--                             meridiem: 'am',
--                             task: 'wake up',
--                         },
--                         {
--                             activity_id: '24766402-165c-489c-b46a-5368807c21be',
--                             start_time: 9,
--                             meridiem: 'am',
--                             task: 'breakfast at cafe',
--                         },
--                     ] 
--                 },
--                 {
--                     day_id: 'caf1457a-e926-41cf-8f48-2bfa468e6b24',
--                     activity: [
--                         {
--                             activity_id: '0db755c6-6d63-412e-bb0a-bac87626254b',
--                             start_time: 8,
--                             meridiem: 'am',
--                             task: 'wake up',
--                         },
--                         {
--                             activity_id: '3edd400c-24da-4eaa-bb62-7f0a2afedfc1',
--                             start_time: 9,
--                             meridiem: 'am',
--                             task: 'breakfast at restaurant',
--                         },
--                     ] 
--                 },
--             ]
--         },
--         {
--             trip_id: 'c46d1b84-b032-4595-80b2-9872d1628626',
--             user_id: 1,
--             name: 'Girls Trip',
--             location: {
--                 city: 'Savannah',
--                 country: 'USA',
--             },
--             days: [
--                 {
--                     day_id: '69485328-8e90-4873-adbb-91e5b2ca5ac7',
--                     activity: [
--                         {
--                             activity_id: 'ca5dabb9-c838-4a42-bd31-58d3fed54580',
--                             start_time: 9,
--                             meridiem: 'am',
--                             task: 'wake up',
--                         },
--                         {
--                             activity_id: '583ffd43-351f-4311-9209-e5a76516484a',
--                             start_time: 10,
--                             meridiem: 'am',
--                             task: 'breakfast on beach',
--                         },
--                     ] 
--                 },
--                 {
--                     day_id: '95449bb1-6c2c-449f-a91e-8a7f9141f5fd',
--                     activity: [
--                         {
--                             activity_id: 'afd71fd4-abd5-425f-8d09-22ce78dfdbe1',
--                             start_time: 7,
--                             meridiem: 'am',
--                             task: 'morning walk',
--                         },
--                         {
--                             activity_id: '07307d6d-e96e-4e7d-9a43-ec28329d932e',
--                             start_time: 8,
--                             meridiem: 'am',
--                             task: 'breakfast at cafe',
--                         },
--                     ] 
--                 },
--             ]
--         },
--         {
--             trip_id: '9cfd3121-20f2-4ac8-9214-206bfa07dabb',
--             user_id: 1,
--             name: 'Family Vacation',
--             location: {
--                 city: 'Mostar',
--                 country: 'Bosnia & Herzegovina',
--             },
--             days: [
--                 {
--                     day_id: '9bfbcb27-ecda-4cb4-86a1-7b88adb3b649',
--                     activity: [
--                         {
--                             activity_id: 'ca278c26-26dd-40f8-a824-79b48317262f',
--                             start_time: 8,
--                             meridiem: 'am',
--                             task: 'wake up',
--                         },
--                         {
--                             activity_id: '3d3ca6a5-22b6-49ed-a8e6-49b9d147035d',
--                             start_time: 1,
--                             meridiem: 'pm',
--                             task: 'lunch at beach',
--                         },
--                         {
--                             activity_id: 'c04679a8-7ded-4467-a648-758414e43d53',
--                             start_time: 9,
--                             meridiem: 'pm',
--                             task: 'dinner at cafe',
--                         },
--                     ] 
--                 },
--                 {
--                     day_id: 'f43b4c9f-690a-453b-b550-2511287e3824',
--                     activity: [
--                         {
--                             activity_id: 'f6e5ec42-f7e8-45e0-bbe6-f94d3f8898b0',
--                             start_time: 8,
--                             meridiem: 'am',
--                             task: 'wake up',
--                         },
--                         {
--                             activity_id: 'e1baab75-3d2f-438b-a3a1-3a2ec3dcc984',
--                             start_time: 9,
--                             meridiem: 'am',
--                             task: 'breakfast at restaurant',
--                         },
--                     ] 
--                 },
--             ]
--         },
--     ],
--     reviews: [
--         {
--             review_id: '845e3e96-091b-4949-ad44-761faa05f063',
--             user_id: 1,
--             name: 'Mad Panda Hostel',
--             images: {
--                 image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTgH7HiQ02_-Fv8erSYt_wCqFPxFXdEHoMR-jUgRXP9G939MZmM&usqp=CAU',
--                 atlText: 'mad panda hostel logo',
--             },
--             location: {
--                 city: 'Hua Hin',
--                 country: 'Thailand',
--                 address: '76/2 Hua Hin 72/1 Alley, Hua Hin, Hua Hin District, Prachuap Khiri Khan 77110, Thailand',
--             },
--             rating: 5,
--             category: 'lodging',
--             comments: 'Best place on earth!! Everyone is so friendly and the food is amazing!',
--         },
--         {
--             review_id: '27e171c0-e626-4cc5-9624-86a5af95b44c',
--             user_id: 2,
--             name: 'Crystal Beer Parlor',
--             images: {
--                 image: 'https://media-cdn.tripadvisor.com/media/photo-s/10/a5/a3/39/classic-crystal-burger.jpg',
--                 atlText: 'burger, onion rings, and beer',
--             },
--             location: {
--                 city: 'Savannah',
--                 country: 'USA',
--                 address: '301 W Jones St, Savannah, GA 31401',
--             },
--             rating: 4,
--             category: 'bar/coffee',
--             comments: 'Great drinks! A little loud, but a nice place to start the night',
--         },
--         {
--             review_id: 'a41cc818-3d3d-4f25-9756-ced82878056f',
--             user_id: 1,
--             name: 'Stari Most Tour',
--             images: {
--                 image: 'https://www.wonders-of-the-world.net/Bridge-of-Mostar/images/Vignettes/Photos/Pont-de-Mostar-002-V.jpg',
--                 atlText: 'old bridge with blue water',
--             },
--             location: {
--                 city: 'Mostar',
--                 country: 'Bosnia & Herzegovina',
--                 address: 'Stari Most, Mostar 88000, Bosnia & Herzegovina',
--             },
--             rating: 5,
--             category: 'activity',
--             comments: 'Beautiful views! Go early though, it gets crowded quickly.',
--         }
--     ],
-- }