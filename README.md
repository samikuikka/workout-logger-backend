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
  { "exercise": "Plank", "id": 0 },
  { "exercise": "Squat","id": 1 },
  { "exercise": "Bench press", "id": 2 },
  { "exercise": "Deadlift", "id": 3 },
  {  "exercise": "T-bar row", "id": 4 },
  { "exercise": "Pullup", "id": 5 },
  { "exercise": "Seated incline dumbbell curl", "id": 6 },
  { "exercise": "Standing barbell curl", "id": 7 },
  { "exercise": "Dips", "id": 8 },
  { "exercise": "Dumbbell lateral raises", "id": 9 },
  { "exercise": "Presses", "id": 10 },
  { "exercise": "Leg curl", "id": 11 }
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
  { "_id": "6357eeee920806962f8e5d3a", "weight": 50,  "id": 2, "name": "Bench press",  "user": "63555fee0c2d46679fde5cf0", "__t": "BenchPress", "date": "2022-10-25T14:13:02.314Z", "__v": 0 },
  { "_id": "6357eef2920806962f8e5d3d", "weight": 50, "id": 2, "name": "Bench press", "user": "63555fee0c2d46679fde5cf0",  "__t": "BenchPress", "date": "2022-10-25T14:13:06.351Z", "__v": 0 }
]
```

### GET /api/exercises/:id

Get specific type of exercises

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjM1NTVmZWUwYzJkNDY2NzlmZGU1Y2YwIiwiaWF0IjoxNjY2NTM5OTY0fQ.t0gyWCndYkIg3riX9DTlL_MmecCjHCymQpyJ9xU_zto"                                                                    |

#### Filters

| **filter name** | **possible types** | **description** | **example** |
|--|--|--|--|
| date_range | ["week", "month", "year"] | filter exercises by this week, this month or this year | /api/exercises?date_range=month |


** Response `200` **

```json
[
  { "_id": "6357eeee920806962f8e5d3a", "weight": 50, "id": 2, "name": "Bench press", "user": "63555fee0c2d46679fde5cf0", "__t": "BenchPress", "date": "2022-10-25T14:13:02.314Z", "__v": 0 },
  { "_id": "6357eef2920806962f8e5d3d", "weight": 50, "id": 2, "name": "Bench press", "user": "63555fee0c2d46679fde5cf0", "__t": "BenchPress", "date": "2022-10-25T14:13:06.351Z", "__v": 0 },
  { "_id": "6357f0db1e00c0c306cbda89", "weight": 50,"sets":5,  "reps": 7, "id": 2, "name": "Bench press", "user": "63555fee0c2d46679fde5cf0", "__t": "BenchPress", "date": "2022-10-25T14:21:15.625Z", "__v": 0 }
]
```


### POST /api/exercises

Post array of exercises

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RlciIsImlkIjoiNjM1NTVmZWUwYzJkNDY2NzlmZGU1Y2YwIiwiaWF0IjoxNjY2NTM5OTY0fQ.t0gyWCndYkIg3riX9DTlL_MmecCjHCymQpyJ9xU_zto"                                                                    |
|  `Content-Type`| required | application/json | Data must be sent in json format |

**Data paramaters**

Data needs to be send as Array in json format where each exercise needs to at least needs to have **id** (exercise id, check out /api/exercise_name )

```json
[
    {
        "id": 3,
        "weight": 50,
        "sets": 5,
        "reps": 7
    },
    {
        "id": 0
    }
]

```

** Response `201`** 

```json 

[  
	{  "id": 3,  "name": "Deadlift",  "user": "63555fee0c2d46679fde5cf0",  "weight": 50,  "sets": 5,  "reps": 7,  "_id": "63612ca0aa4e031e9ec3a15d",  "date": "2022-11-01T14:26:40.412Z",  "__v": 0  },  
	{  "id": 0,  "name": "Plank",  "user": "63555fee0c2d46679fde5cf0",  "_id": "63612ca0aa4e031e9ec3a160",  "date": "2022-11-01T14:26:40.467Z",  "__v": 0  }  
]
```

### GET '/api/workouts' :

Retrieve user own workout templates

#### Request

**Headers**
| **name** | **required** | **description** | 
|--|--|--|
| Authorization | required | in the form of `bearer token` |

#### Response `200`

```json
[  {  "_id": "6362b840a709d582b6f53afc",  "id": 1,  "name": "Leg workout",  "exercises": [],  "__v": 0  },  {  "_id": "6362b969a709d582b6f53b05",  "id": 2,  "name": "Leg workout",  "exercises": [],  "__v": 0  }  ]
```


### POST '/api/workouts' :

Post a new workout for the user

#### Request

**Headers**
| **name** | **required** | **description** | 
|--|--|--|
| Authorization | required | in the form of `bearer token` |
| Content-Type | required | needs to be `application/json`  |

**Data paramaters**
| **field** | **required** | **type** | **description** |
|--|--|--|--|
| id | required | number | id of the exercise template |
| name | required | string | name of the template |
| exercises | optional | [number] | list of exercise ids |

e.g.,
```json
{ "id": 2, "name": "Leg workout" }
```

**Response** `201`
```json
{  "username": "tester",  "email": "testdasdsa@testasdsadsa.com", "workouts": [  "6362b840a709d582b6f53afc", "6362b969a709d582b6f53b05"  ],  "id": "63555fee0c2d46679fde5cf0"  }
```
