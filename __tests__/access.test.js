const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/**
 * Create account for login before test
 */
 beforeEach( async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const newUser = new User({username: 'test', passwordHash, email: "test@test.com"});
    await newUser.save();
})

describe('userExtractor', () => {

    test('does not let in without token', async () => {

        const response = await api
            .get('/secret')
            .expect(401);
        
        expect(response.body).toEqual({ error: 'no token'});
    });

    test('does not let in with malformatted token', async () => {
        const response = await api
            .get('/secret')
            .set('Authorization', `bearer 9sdfi03f90fjei`)
            .expect(401);
        
        expect(response.body).toEqual({ error: 'token invalid'});
    });

    test('does not let in with invalid token', async () => {

        const token = jwt.sign({test: 'sdhas'}, process.env.SECRET);

        const response = await api
            .get('/secret')
            .set('Authorization', `bearer ${token}`)
            .expect(401);

        expect(response.body).toEqual({error: 'token id not found'});
    });

    test('let is with valid token', async () => {
        const res1 = await api
            .post('/api/login')
            .send({username: 'test', password: 'sekret'})
            .expect(200);
        
        let token = res1.body.token;
        
        const response = await api
            .get('/secret')
            .set('Authorization', `bearer ${token}`)
            .expect(200);

        
        expect(response.text).toEqual("SECRET SITE");
    });


})