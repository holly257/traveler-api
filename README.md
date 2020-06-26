# Welcome Traveler!

This is the api for my capstone project, called Traveler.

## Set Up

Deployed App: https://infinite-beach-15361.herokuapp.com/

## Summary

Traveler allows users to create and browse reviews of things to do on a trip. They can then take those ideas and create, edit, and save a trip itinerary.

## Technology Used

Front End: HTML, CSS, JavaScript, React
<br />
Back End: Node, Express, PostresSQL

## API Documentation

### Authentication

Traveler.api uses JWT tokens, required on the reviews, trips, days, and activities endpoint requests. The tokens are created upon a users login and sent in the response body.

### Getting Started

The Traveler.api has 7 endpoints.
<br/>
It has 5 main endpoints for requests, 1 for creating users, and 1 for authentication, and 1 to test your connection.
<br/>

### Endpoints

#### /

-   This endpoint allows you to test your connection to the server. It will send a response containing 'Hello Traveler' if you have connected sucessfully. It is not protected.

#### /api/users

-   The users route has POST signup requests.
-   Username, fullname, email, and password are all required in the request body.
-   Passwords must be between 8 and and 72 characters, not starting or ending with a space, and containing 1 upper case, lower case, number and special character.
-   Emails musts be valid, including both an @ symbol and a period.
-   The username must also be unique.
    <br/>

#### /api/auth

-   The auth route has POST login requests.
-   Username and password are all required in the request body.
-   If either the username or password is wrong, an error will be given that the username or password was incorrect.
-   A JWT token will be sent in the response with a successful login request.
    <br/>

#### /api/search

-   The search route has GET and GET by ID requests.
-   /api/search takes no parameters and responds with the first 10 reviews in the database.
-   /api/search/:id requires a city argument in the query, and will also take a category argument with the city.
-   It the city or category does not have a review yet, the request will respond with a 404 error.
    <br/>

#### /api/reviews

-   The reviews route has GET, POST, and DELETE requests after a user has been authenticated with logging in - these all requie a JWT token in the header.
-   The /api/reviews route gets all of the reviews that match that users ID - which is given from the JWT auth token.
-   The POST route takes review data from the request body, checks for required arguments and responds with 201 when successful.
-   POST required arguments: name, city, country, rating, category, comments, user_id, image. The category will only accept: 'restaurant', 'bar/coffee', 'shopping', 'activity', and 'lodging'. Rating must be an integer.
-   The DELETE api/reviews/:review_id takes the reviews ID as a parameter and responds with a 204 for a successful delete request. It will also respond 404 if the review does not exist.
    <br/>

#### /api/trips

-   The trips route has GET, POST, DELETE, and PATCH requests after a user has been authenticated with logging in - these all requie a JWT token in the header.
-   GET responds with all of the trips, days, and activities that match that users ID - which is given from the JWT auth token.
-   The POST route takes trip data from the request body, checks for required arguments and responds with 201 when successful.
-   The POST only takes the required arguments, and only interacts with the trips database. It will not accept information about days or activities.
-   POST required arguments: name, city, country, user_id.
-   The DELETE api/trips/:trip_id takes the trip ID as a parameter and responds with a 204 for a successful delete request. It will also respond 404 if the trip does not exist.
-   The PATCH api/trips/:trip_id takes the trip ID as a parameter and will update any fields it is given. It will respond 400 if no fields are given, but it does not have required fields. It will also respond 404 if the trip ID does not exist.
    <br/>

#### /api/days

-   The days route has GET, POST, and DELETE requests after a user has been authenticated with logging in - these all requie a JWT token in the header.
-   GET responds with all of the days stored in the database.
-   The POST route takes only the trip ID from the request body, and it is required.
-   The DELETE api/days/:day_id takes the day ID as a parameter and responds with a 204 for a successful delete request. It will also respond 404 if the day does not exist.
    <br/>

#### /api/activities

-   The activities route has GET, POST, GET by ID, DELETE, and PATCH requests after a user has been authenticated with logging in - these all requie a JWT token in the header.
-   GET responds with all of the activities in the database.
-   The POST route takes activity data from the request body, checks for required arguments and responds with 201 when successful.
-   The POST only takes the required arguments, and only interacts with the activities database. It will not accept information about days or trips.
-   POST required arguments: activity, meridiem, start_time, day_id - meridiem will only accept 'am' or 'pm' and start_time must be an integer.
-   The DELETE api/activities/:activity_id takes the activity ID as a parameter and responds with a 204 for a successful delete request. It will also respond 404 if the activity does not exist.
-   The PATCH api/activities/:activity_id takes the activity ID as a parameter and will update any fields it is given. It will respond 400 if no fields are given, but it does not have required fields. It will also respond 404 if the activity ID does not exist.
    <br/>
