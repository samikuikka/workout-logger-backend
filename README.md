# workout-logger-backend

Backend for workout logger

# .env file
.env file is needed for running the backend in this format:

PORT="PORT NUMBER" 

DATABASE="Database link that is used, for example MongoDB Atlas, e.g., mongodb+srv://username:password@rest_of_the_link" 

TEST_DATABASE="Database link for test database, CAN NOT BE SAME WITH THE UPPER DATABASE!"

SECERT="Random string used for JSON WEB TOKENS"

# Running the backend

## real database

npm run dev

## tests

npm run test

# Route use-cases

## registration
Request:

POST http://localhost:PORT/api/users

Content-Type: application/json

{
  "username": String
  "password": String
  "email": String
}

Response:

{
  "username": username,
  "email": email,
  "id" String
}

# login

Request:

POST http://localhost:PORT/api/login

Content-Type: application/json

{
  "username": String
  "password": String
}

Response:

{

  "token": String,
  "username": String
  "id": String

}

## Getting exercises

Request:

GET http://localhost:POST/api/exercises

Authorization: "bearer token"

Content-Type: application/json

Response:

List of user exercises in JSON format




