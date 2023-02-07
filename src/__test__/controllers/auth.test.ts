
import { faker } from '@faker-js/faker';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from '../../app';

const password = '12345678';
const salt = bcrypt.genSaltSync(8);
const hashedPass = bcrypt.hashSync(password, salt);

const defaultUser = {
    _id: new mongoose.Types.ObjectId(),
    username: faker.internet.userName(),
    email: faker.internet.email().toLowerCase(),
    password
}

beforeAll(async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect("mongodb://127.0.0.1:27017/katharus-back-test");
});

beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany({})));
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("Auth routes", () => {
    describe('POST /auth/register', () => {
        let newUser: object;
        beforeEach(() => {
            newUser = {
                username: faker.internet.userName(),
                email: faker.internet.email().toLowerCase(),
                password: '12345678'
            }
        });
        test('return status 201, user info/tokens and insert user', async () => {
            const res = await request(app).post('/auth/register').send(newUser).expect(201);

            expect(res.body.user).not.toHaveProperty('password');
        });
    });
});