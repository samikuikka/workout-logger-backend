const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const User = require('../models/User');

/**
 * Empty the users before tests
 */
beforeEach( async () => {
    await User.deleteMany({});
})

describe('POST', () => {

    beforeEach( async () => {
        await User.deleteMany({});
    });

    test('a valid user can be created', async () => {
        const newUser = {
            username: 'test',
            password: 'sekret'
        };

        let users = await User.find({});

        expect(users).toHaveLength(0);

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        users = await User.find({});
        expect(users).toHaveLength(1);
    });

    test('no password return error', async () => {
        const invalidUser = {
            username: 'test2'
        }

        const response = await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400);
        
        expect(response.body.error).toBe("Password should be at least 4 characters long.");

        const users = await User.find({});
        expect(users).toHaveLength(0);
    });

    test('no username return error', async () => {
        const invalidUser = {
            password: 'sekret'
        }

        const response = await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400);

        expect(response.body.error).toBe('Username must be at least 3 characters long.');

        const users = await User.find({});
        expect(users).toHaveLength(0);
    })
})

describe('GET', () => {

    beforeEach( async () => {
        await User.deleteMany({});
    });

    test('without users shows empty list', async () => {

        const users = await User.find({});
        expect(users).toHaveLength(0);

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
       
        expect(response.body).toEqual([]);
    });

    test('with users show the users', async () => {
        
        const ph1 = await bcrypt.hash('sekret', 10);
        const user1 = new User({username: 'user1', passwordHash: ph1});
        await user1.save();
        const ph2 = await bcrypt.hash('secret', 10);
        const user2 = new User({username: 'user2', passwordHash: ph2});
        await user2.save();

        const users = await User.find({});
        expect(users).toHaveLength(2);
        

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        
        expect(response.body).toHaveLength(2);
    })
})