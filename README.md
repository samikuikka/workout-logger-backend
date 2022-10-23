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



