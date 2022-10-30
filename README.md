# workout-logger-backend

Backend for workout logger

# .env file
.env file is needed for running the backend in this format:
```bash
# Port number
PORT="PORT NUMBER" 

#Database
DATABASE="Database link that is used, for example MongoDB Atlas, e.g., mongodb+srv://username:password@rest_of_the_link" 

# Test database 
TEST_DATABASE="Database link for test database, CAN NOT BE SAME WITH THE UPPER DATABASE!"

# Secret for JSON
SECERT="Random string used for JSON WEB TOKENS"

```


# Running the backend

## real database

```bash
npm run dev
```

## tests

```bash
npm run test
```

# Route use-cases

### POST /api/users

Register for the application

**Headers**
```javascript
 Content-Type: application/json
```

**Data Parameter**
```json
{
  "username": "tester",
  "password": "ajs8dndy7s76n",
  "email": "testdasdsa@testasdsadsa.com"
}
```

**Response ```201```**

```json
{
  "username": "tester",
  "email": "testdasdsa@testasdsadsa.com",
  "id": "63555fee0c2d46679fde5cf0"
}
```
### POST /api/login

Login to the application

***Headers***
```javascript
Content-Type: application/json
```

**Data paramater **
```json
{
    "username": "tester",
    "password": "ajs8dndy7s76n"
}
```

**Response ```200```**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjM1NTVmZWUwYzJkNDY2NzlmZGU1Y2YwIiwiaWF0IjoxNjY2NTM5OTY0fQ.t0gyWCndYkIg3riX9DTlL_MmecCjHCymQpyJ9xU_zto",
  "username": "tester",
  "id": "63555fee0c2d46679fde5cf0"
}
```

### GET /api/exercise_names

Get all the exercise types in the db and exercise ids

**Response ```200```**

```json
[
  {
    "exercise": "Plank",
    "id": 0
  },
  {
    "exercise": "Squat",
    "id": 1
  },
  {
    "exercise": "Bench press",
    "id": 2
  },
  {
    "exercise": "Deadlift",
    "id": 3
  },
  {
    "exercise": "T-bar row",
    "id": 4
  },
  {
    "exercise": "Pullup",
    "id": 5
  },
  {
    "exercise": "Seated incline dumbbell curl",
    "id": 6
  },
  {
    "exercise": "Standing barbell curl",
    "id": 7
  },
  {
    "exercise": "Dips",
    "id": 8
  },
  {
    "exercise": "Dumbbell lateral raises",
    "id": 9
  },
  {
    "exercise": "Presses",
    "id": 10
  },
  {
    "exercise": "Leg curl",
    "id": 11
  }
]
```

### GET /api/exercises

Get all the exercises of the user

**Headers**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjM1NTVmZWUwYzJkNDY2NzlmZGU1Y2YwIiwiaWF0IjoxNjY2NTM5OTY0fQ.t0gyWCndYkIg3riX9DTlL_MmecCjHCymQpyJ9xU_zto"   
|
#### Filters

| **filter name** | **possible types** | **description** | **example** |
|--|--|--|--|
| date_range | ["week", "month", "year"] | filter exercises by this week, this month or this year | /api/exercises?date_range=month |


**Response `201`**

```json
[
  {
    "_id": "6357eeee920806962f8e5d3a",
    "weight": 50,
    "id": 2,
    "name": "Bench press",
    "user": "63555fee0c2d46679fde5cf0",
    "__t": "BenchPress",
    "date": "2022-10-25T14:13:02.314Z",
    "__v": 0
  },
  {
    "_id": "6357eef2920806962f8e5d3d",
    "weight": 50,
    "id": 2,
    "name": "Bench press",
    "user": "63555fee0c2d46679fde5cf0",
    "__t": "BenchPress",
    "date": "2022-10-25T14:13:06.351Z",
    "__v": 0
  }
]
```

### GET /api/exercises/:id

Get specific type of exercises

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjM1NTVmZWUwYzJkNDY2NzlmZGU1Y2YwIiwiaWF0IjoxNjY2NTM5OTY0fQ.t0gyWCndYkIg3riX9DTlL_MmecCjHCymQpyJ9xU_zto"                                                                    |

** Response `200` **

```json
[
  {
    "_id": "6357eeee920806962f8e5d3a",
    "weight": 50,
    "id": 2,
    "name": "Bench press",
    "user": "63555fee0c2d46679fde5cf0",
    "__t": "BenchPress",
    "date": "2022-10-25T14:13:02.314Z",
    "__v": 0
  },
  {
    "_id": "6357eef2920806962f8e5d3d",
    "weight": 50,
    "id": 2,
    "name": "Bench press",
    "user": "63555fee0c2d46679fde5cf0",
    "__t": "BenchPress",
    "date": "2022-10-25T14:13:06.351Z",
    "__v": 0
  },
  {
    "_id": "6357f0db1e00c0c306cbda89",
    "weight": 50,
    "sets": 5,
    "reps": 7,
    "id": 2,
    "name": "Bench press",
    "user": "63555fee0c2d46679fde5cf0",
    "__t": "BenchPress",
    "date": "2022-10-25T14:21:15.625Z",
    "__v": 0
  }
]
```


### POST /api/exercises/:exercise_id

Post a new exercise type :exercise_id to the database

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjM1NTVmZWUwYzJkNDY2NzlmZGU1Y2YwIiwiaWF0IjoxNjY2NTM5OTY0fQ.t0gyWCndYkIg3riX9DTlL_MmecCjHCymQpyJ9xU_zto"                                                                    |
|  `Content-Type`| required | application/json | Data must be sent in json format |

**Data paramaters**

Needed parameters for given exercise, e.g. for deadlift (id = 2):

```json
{
    "weight": 50,
    "sets": 5,
    "reps": 7
}
```

** Response `201`** 

```json 
{
  "weight": 50,
  "sets": 5,
  "reps": 7,
  "_id": "6357f0db1e00c0c306cbda89",
  "id": 2,
  "name": "Bench press",
  "user": "63555fee0c2d46679fde5cf0",
  "__t": "BenchPress",
  "date": "2022-10-25T14:21:15.625Z",
  "__v": 0
}
```


