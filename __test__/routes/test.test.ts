import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { User } from '../../src/models/User';
import { generateAuthToken } from '../../src/utils/token';

const defaultUser = {
    _id: new mongoose.Types.ObjectId(),
    username: faker.internet.userName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password()
}

describe('Test routes', () => {
    describe('GET /test', () => {
        test('return 200 if token valid', async () => {
            await User.create(defaultUser);
            const { access } = await generateAuthToken(defaultUser._id);

            await request(app).get('/test').set('Authorization', `Bearer ${access.token}`).expect(200);
        });

        test('return 400 if token is not access', async () => {
            await User.create(defaultUser);
            const { refresh } = await generateAuthToken(defaultUser._id);

            const res = await request(app).get('/test').set('Authorization', `Bearer ${refresh.token}`).expect(400);
            expect(res.body).toMatchObject({
                code: 400,
                message: 'Invalid token type',
                stack: expect.anything()
            });
        });

        test('return 401 if no token', async () => {
            const res = await request(app).get('/test').expect(401);
            expect(res.body).toMatchObject({
                code: 401,
                message: 'Authentication required',
                stack: expect.anything()
            });
        });

        test('return 401 if not valid token', async () => {
            const res = await request(app).get('/test').set('Authorization', 'Bearer notvalidtoken').expect(401);
            expect(res.body).toMatchObject({
                code: 401,
                message: 'Authentication required',
                stack: expect.anything()
            });
        });

        test('return 401 if user not found', async () => {
            const { access } = await generateAuthToken(defaultUser._id);

            const res = await request(app).get('/test').set('Authorization', `Bearer ${access.token}`).expect(401);
            expect(res.body).toMatchObject({
                code: 401,
                message: 'Authentication required',
                stack: expect.anything()
            });
        });
    });
}); 