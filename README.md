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

# API Overview

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


# POST /api/auth/login 
    // req.body { email: String, password: String }
    // res.body { authToken: String }

# GET /api/posts 
    // res.body [ { 
        id: Number, pet_name: String, email: String, type_of_pet: String, birthdate: Date, location: String, hobbies: String, owner_id: Number }]

# GET /api/posts/myPost 
    // req.header Authorization: Bearer ${token}
    // res.body [ { pet_name: String, email: String, type_of_pet: String, birthdate: Date, location: String, hobbies: String } ] 
    
# GET /api/posts/:post_id 
    // req.header Authorization: Bearer ${token}
    // req.params post_id: Number
    // res.body [ { id: Number, pet_name: String, email: String, type_of_pet: String, birthdate: Date, hobbies: String, owner_id: Number }]
    
# POST /api/posts 
    // req.header Authorization: Bearer ${token}
    // req.body { pet_name: String, birthdate: Date, type_of_pet: String, location: String, hobbies: String } 

# DELETE /api/posts/:post_id 
    // req.header Authorization: Bearer ${token}
    // req.params post_id: Number PATCH /api/posts/:post_id // req.header Authorization: Bearer ${token}
    // req.body { pet_name: String, birthdate: Date, type_of_pet: String, location: String, hobbies: String } }

# GET /api/users 
    // req.header Authorization: Bearer ${token}
    // res.body [ { first_name: String, last_name: String, email: String, password: String } ] 

# GET /api/users/user 
    // req.header Authorization: Bearer ${token}
    // req.user id: Number
    // res.body [ { first_name: String, last_name: String, email: String, password: String } ] 

# POST /api/users 
    // req.body { first_name: String, last_name: String, email: String, password: String }
    // res.body [ { id: Number, first_name: String, last_name: String, email: String, password: String } ] 

# DELETE /api/users/user 
    // req.header Authorization: Bearer ${token}
    // req.user id: Number 

# PATCH /api/posts/user 
    // req.header Authorization: Bearer ${token}
    // req.body { first_name: String, last_name: String, email: String, password: String }

