# Welcome Traveler!

This is the api for my capstone project, called Traveler.

## Set up

Deployed App: https://infinite-beach-15361.herokuapp.com/

## Technology Used

Front End: HTML, CSS, JavaScript, React
<br />
Back End: Node, Express, PostresSQL

# API Documentation

## Getting Started

The Traveler.api has 5 main endpoints for requests, 1 for users, and 1 for authentication.
<br/>

/api/users
- The users route is for POST signup requests.
- Username, fullname, email, and password are all required in the request body.
- Passwords must be between 8 and and 72 characters, not starting or ending with a space, and containing  1 upper case, lower case, number and special character.
- Emails musts be valid, including both an @ symbol and a period. 
- The username must also be unique.

<br/>
/api/auth
- The auth route is for POST login requests.
- Username and password are all required in the request body.
- If either the username or password is wrong, an error will be given that the username or password was incorrect. 
- A JWT token will be sent in the response with a successful login request. 


- /api/search
The search route is for POST login requests.
<br/>

- /api/reviews
The users route is for POST login requests.
<br/>

- /api/trips
The users route is for POST login requests.
<br/>

- /api/days
The users route is for POST login requests.
<br/>

- /api/activities
The users route is for POST login requests.
<br/>

## Authentication

Traveler.api uses 