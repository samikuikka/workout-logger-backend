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
  "token": "secret_token_fromt_login",
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

### POST /api/exercise_names

POST new exercise name (i.e. new exercise type) to the application

**Headers**
```javascript
Content-Type: application/json
```

**Data paramater **

```json
{
	"exercise": "Lunges"
}
```

** Response ** `201`
```javascript
{  "exercise": "Lunges",  "id": 13  }
```

### GET /api/exercises

Get all the exercises of the user

**Headers**

|          Name | Required |  Type   | Description                                                                                                                                                           |
| -------------:|:--------:|:-------:| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer secret_token_fromt_login"   
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
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer secret_token_fromt_login"                                                                    |

#### Filters

| **filter name** | **possible types** | **description** | **example** |
|--|--|--|--|
| date_range | ["week", "month", "last_month", "year"] | filter exercises by this week, this month, last month or this year | /api/exercises?date_range=month |


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
|     `Authorization` | required | string  | In the form of `bearer TOKEN` where token is the JSON Web Token from login, e.g. "bearer secret_token_fromt_login"                                                                    |
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
| id | optional | number | custom id of the exercise template |
| name | required | string | name of the template |
| exercises | optional | [number] | list of exercise ids |

e.g.,
```json
{ "name": "Leg workout" }
```

**Response** `201`

```json
[
  "6362b840a709d582b6f53afc",
  "6362b969a709d582b6f53b05",
  "63637a0d27fd6a5ce9665e55"
]
```


### PUT 'api/workouts/:id'

Change the user workout where id is :id

#### Request

**Headers**
| **name** | **required** | **description** |
|--|--|--|
| Authorization | required | in the form of `breare token` |
| Content-Type | required | `application/json` |

**Data paramaters**

| **field** | **required** | **type** | **description** |
|--|--|--|--|
| name | required | string | name of the template |
| exercises | optional | [number] | list of exercise ids |

e.g.  for '/api/workouts/0'
```json
{
	"name": "Improved leg workout",
	"exercises": [0,1,1,2]
}
```
#### Response `201`
```json
[  "6362b840a709d582b6f53afc",  "6362b969a709d582b6f53b05",  "63637a0d27fd6a5ce9665e55"  ]
```

### DELETE '/api/workouts/:id' :
Delete the workout template with the id = :id in users workout list

#### Request

**Headers**
| **name** | **required** | **description** |
|--|--|--|
| Authorization | required | in the form of `breare token` |

#### Response `204`


### GET '/api/workout_session' :

Retrieve users own workout sessions.
Shows only 10 sessions at the time, page number can be used to show next 10 sessions.

#### Request

**Headers**
| **name** | **required** | **description** | 
|--|--|--|
| Authorization | required | in the form of `bearer token` |

#### Filters

| **filter name** | **possible types** | **description** | **example** |
|--|--|--|--|
| date_range | ["week", "month", "year"] | filter exercises by this week, this month or this year | /api/workout_session?date_range=month |
| page | number | pagination number, currently shows only 10 sessions for each page | /api/workout_session?page=1 |

#### Response `200`
```json
{  
	"pages": 4, //HOW MANY PAGES  
	"page": 0,  // CURRENT PAGE
	"sessions": [  {  "_id": "6374ddb2b50a6b33feb9ca6b",  "date": "2022-11-16T12:55:05.654Z",  "user": "63555fee0c2d46679fde5cf0",  "exercises": [  {  "_id": "6374ddb2b50a6b33feb9ca65",  "id": 1,  "name": "Squat",  "weight": 0,  "reps": 0,  "__v": 0  },  {  "_id": "6374ddb2b50a6b33feb9ca66",  "id": 4,  "name": "T-bar row",  "weight": 0,  "reps": 0,  "__v": 0  },  {  "_id": "6374ddb2b50a6b33feb9ca67",  "id": 4,  "name": "T-bar row",  "weight": 0,  "reps": 0,  "__v": 0  }  ],  "__v": 0  } // AND REST OF THE SESSIONS...  
		]  
	}
```


### POST /api/workout_session

  

Post a new workout session for current user

  

| Name | Required | Type | Description |
| --- | :---: | :---: | --- |
| `Authorization` | required | string | In the form of `bearer TOKEN` where token is the JSON Web Token from login
| `Content-Type` | required | application/json | Data must be sent in json format |

  
  

**Data paramaters**

  **Data paramaters**

| **field** | **required** | **type** | **description** |
|--|--|--|--|
| date | optional | date | date of the session, if not provided then today's date chosen |
| exercises | required | [exercises] | list of exercises for session |

Data needs to be send as in json format  Array of exercises where each exercise needs to at least needs to have **id** (exercise id, check out /api/exercise_name )

```json
{
	"exercises": [{
		"id": 3,
		"name": "Deadlift",
		"weight": 100,
		"sets": 5,
		"reps": 3
	},
	{
		"id": 1,
		"name": "squat",
		"weight": 80,
		"sets": 3,
		"reps": 8
	}]
}
```
  

  

**Response `201`**

  

```json

[  "6371092a5d5dfc538f4e656c"  ]

```
