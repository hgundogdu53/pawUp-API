# pawUp-Api
Connect your pets with pets from your neighborhood.

## Heroku Link: https://fierce-tor-48814.herokuapp.com/

## Built with
Front-End:
HTML,CSS,React.
Back-End:
Node.js, Express, Knex, PostgreSQL
Testing: Mocha,Chai,Jest,Enzyme
Authentication: bcrypt, JWTs

## Features
    -Create pet posts
    -Create a user profile
    -Find other pets
    -Update pet posts
    -Update user profile
    -Delete logged in user's pet posts
    -Delete logged in user profile

## API Overview
/api
.
|__ /auth
|    |__ POST
|        |__ /login
|  
|__ /posts
|   |__ GET
|   |    |__ /
|   |    |__ /myPost
|   |    |__ /:post_id
|   |__ POST
|   |   |__ /
|   |__ PATCH
|   |   |__ /:post_id
|   |__ DELETE
|   |   |__ /:post_id   
|__ /users
|    |__ POST
|    |    |__ /
|    |__ GET
|    |    |__ /
|    |    |__ /user
|    |__PATCH
|    |  |__ /user
|    |__ DELETE
|        |__ /user 


