const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const ExerciseName = require('../models/ExerciseName');

beforeEach( async () => {
    await ExerciseName.deleteMany({});
});

describe('exercise / ids', () => {

    test('can post exercise name', async () => {
        let obj = {
            exercise: 'Overhead press Dumbbells'
        }

        const response = await api
            .post('/api/exercise_names')
            .send(obj)
    
        expect(response.body).toEqual({exercise: 'Overhead press Dumbbells', id: 0});

        const exerciseCount = await ExerciseName.find({});
        expect(exerciseCount).toHaveLength(1);
    });

    test('different id for different exercises', async () => {
        let obj1 = {
            exercise: 'Overhead press Dumbbells'
        }

        let obj2 = {
            exercise: "Military Press with Dumbbells"
        };

        await api.post('/api/exercise_names')
            .send(obj1);
        
        const response = await api.post('/api/exercise_names')
            .send(obj2);
        
        expect(response.body).toEqual({exercise: "Military Press with Dumbbells", id: 1});

        const exerciseCount = await ExerciseName.find({});
        expect(exerciseCount).toHaveLength(2);
    });

    test('can GET exercises and their codes', async () => {
        let obj1 = {
            exercise: 'Overhead press Dumbbells'
        }

        let obj2 = {
            exercise: "Military Press with Dumbbells"
        };

        await api.post('/api/exercise_names')
            .send(obj1);
        
        await api.post('/api/exercise_names')
            .send(obj2);
        
        const exercises = await ExerciseName.find({});
        expect(exercises).toHaveLength(2);
        obj1.id = 0;
        obj2.id = 1;
        const response = await api.get('/api/exercise_names')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body).toEqual(expect.arrayContaining([obj1, obj2]))
    });
});