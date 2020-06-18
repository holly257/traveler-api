# Welcome Traveler!

This is the api for my capstone project, called Traveler.

## Set up

Deployed App: https://infinite-beach-15361.herokuapp.com/

## Technology Used

Front End: HTML, CSS, JavaScript, React
<br />
Back End: Node, Express, PostresSQL

## API Documentation

### Getting Started

The Traveler.api has 5 main endpoints for requests, 1 for users, and 1 for authentication.
<br/>

#### /api/users
- The users route is for POST signup requests.
- Username, fullname, email, and password are all required in the request body.
- Passwords must be between 8 and and 72 characters, not starting or ending with a space, and containing  1 upper case, lower case, number and special character.
- Emails musts be valid, including both an @ symbol and a period. 
- The username must also be unique.
<br/>

#### /api/auth
- The auth route is for POST login requests.
- Username and password are all required in the request body.
- If either the username or password is wrong, an error will be given that the username or password was incorrect. 
- A JWT token will be sent in the response with a successful login request. 
<br/>

#### /api/search
- The search route is for GET and GET by ID requests.
- /api/search takes no parameters and responds with the first 10 reviews in the database.
- /api/search/:id requires a city argument in the query, and will also take a category argument with the city.
- It the city or category does not have a review yet, the request will respond with a 404 error. 
<br/>

#### /api/reviews
- The reviews route is for GET, POST, and DELETE requests after a user has been authenticated with logging in - these all requie a JWT token in the header.
- The /api/reviews route gets all of the reviews that match that users ID - which is given from the JWT auth token.
- The POST route takes review data as from the request body, checks for required arguments and responds with 201 when successful.
- POST required arguments: name, city, country, rating, category, comments, user_id, image.
- The DELETE api/reviews/:review_id takes the reviews ID as a parameter and responds with a 204 for a successful delete request. It will also respond 404 if the review does not exist. 
<br/>

#### /api/trips
- The users route is for POST login requests.
<br/>

#### /api/days
- The users route is for POST login requests.
<br/>

#### /api/activities
- The users route is for POST login requests.
<br/>

## Authentication

Traveler.api uses 