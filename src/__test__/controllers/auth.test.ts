
import { faker } from '@faker-js/faker';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import { User } from '../../models/User';
import { Token } from '../../models/Token';
import { generateAuthToken, generateToken, saveToken } from '../../utils/token';
import moment from 'moment';

const defaultUser = {
    _id: new mongoose.Types.ObjectId(),
    username: faker.internet.userName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password()
}

describe("Auth routes", () => {
    describe('POST /auth/register', () => {
        let newUser: {
            username: string,
            email: string,
            password: string
        };
        
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
            expect(res.body.user).toEqual({
                _id: expect.anything(),
                username: newUser.username,
                email: newUser.email,
                __v: 0
            });

            const userDoc = await User.findById(res.body.user._id);
            expect(userDoc).toBeDefined();
            expect(userDoc).toMatchObject({
                username: newUser.username,
                email: newUser.email
            });

            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() }
            });
        });
        
        test('return 400 if invalid email', async () => {
            newUser.email = 'invalidEmail';

            await request(app).post('/auth/register').send(newUser).expect(400);
        });

        test('return 400 if email is already used', async () => {
            await User.create(defaultUser);
            newUser.email = defaultUser.email;

            await request(app).post('/auth/register').send(newUser).expect(400);
        });

        test('return 400 if username is already used', async () => {
            await User.create(defaultUser);
            newUser.username = defaultUser.username;
            
            await request(app).post('/auth/register').send(newUser).expect(400); 
        });
        
        test('return 400 if password is less than 8 chars', async () => {
            newUser.password = '1';

            await request(app).post('/auth/register').send(newUser).expect(400); 
        });
    });

    describe('POST /auth/login', () => {
        test('return 200 and user info/tokens using email', async () => {
            await User.create(defaultUser);

            const loginCredentials = {
                email: defaultUser.email,
                password: defaultUser.password
            }

            const res = await request(app).post('/auth/login').send(loginCredentials).expect(200);

            expect(res.body.user).toEqual({
                _id: expect.anything(),
                username: defaultUser.username,
                email: defaultUser.email,
                __v: 0
            });

            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() }
            });
        });
        
        test('return 200 and user info/tokens using username', async () => {
            await User.create(defaultUser);

            const loginCredentials = {
                username: defaultUser.username,
                password: defaultUser.password
            }

            const res = await request(app).post('/auth/login').send(loginCredentials).expect(200);

            expect(res.body.user).toEqual({
                _id: expect.anything(),
                username: defaultUser.username,
                email: defaultUser.email,
                __v: 0
            });

            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() }
            });
        });
        
        test('return 400 using email and username', async () => {
            await User.create(defaultUser);

            const loginCredentials = {
                username: defaultUser.username,
                email: defaultUser.email,
                password: defaultUser.password
            }

            await request(app).post('/auth/login').send(loginCredentials).expect(400);
        });

        test('return 401 if email does not exist', async () => {
            const loginCredentials = {
                email: defaultUser.email,
                password: defaultUser.password,
            };
        
            const res = await request(app).post('/auth/login').send(loginCredentials).expect(401);
    
            expect(res.body).toEqual({ code:401, message: 'Incorrect username/email', stack: expect.anything() });
        });

        test('return 401 if password does not match', async () => {
            await User.create(defaultUser);

            const loginCredentials = {
                email: defaultUser.email,
                password: 'wrongPassword',
            };
        
            const res = await request(app).post('/auth/login').send(loginCredentials).expect(401);
    
            expect(res.body).toEqual({ code: 401, message: 'Incorrect password', stack: expect.anything() });
        });
    });

    describe('POST /auth/logout', () => {
        test('return 204 if token is valid', async () => {
            await User.create(defaultUser);
            const { refresh } = await generateAuthToken(defaultUser._id);
            
            await request(app).post('/auth/logout').send({ refreshToken: refresh.token }).expect(204);

            const dbRefreshTokenDoc = await Token.findOne({ token: refresh.token });
            expect(dbRefreshTokenDoc).toBe(null);
        });

        test('return 400 if token is not sent', async () => {
            await request(app).post('/auth/logout').send().expect(400);
        });

        test('return 401 if token is not found', async () => {
            await User.create(defaultUser);
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');

            await request(app).post('/auth/logout').send({refreshToken}).expect(401);
        });

        test('return 401 if token is blacklisted', async () => {
            await User.create(defaultUser);
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');
            await saveToken(refreshToken, defaultUser._id, expires, 'refresh', true);

            await request(app).post('/auth/logout').send({refreshToken}).expect(401);
        });
    });

    describe('POST /auth/refresh-token', () => {
        test('return 200 and new auth tokens', async () => {
            await User.create(defaultUser);
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');
            await saveToken(refreshToken, defaultUser._id, expires, 'refresh');

            const res = await request(app).post('/auth/refresh-token').send({refreshToken}).expect(200);

            expect(res.body.user).toEqual({
                _id: expect.anything(),
                username: defaultUser.username,
                email: defaultUser.email,
                __v: 0
            });

            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() },
            });

            const dbRefreshTokenDoc = await Token.findOne({ token: res.body.tokens.refresh.token });
            expect(dbRefreshTokenDoc).not.toBe(null);
      
            const dbRefreshTokenCount = await Token.countDocuments();
            expect(dbRefreshTokenCount).toBe(1);
        });

        test('return 400 if not refreshToken in request body', async () => {
            await request(app).post('/auth/refresh-token').send().expect(400);
        });

        test('return 401 error if refresh token is signed using an invalid secret', async () => {
            await User.create(defaultUser);
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh', 'invalidSecret');
            await saveToken(refreshToken, defaultUser._id, expires, 'refresh');
      
            await request(app).post('/auth/refresh-token').send({ refreshToken }).expect(401);
          });
      
          test('return 401 error if refresh token is not found in the database', async () => {
            await User.create(defaultUser);
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');
      
            await request(app).post('/auth/refresh-token').send({ refreshToken }).expect(401);
          });
      
          test('return 401 error if refresh token is blacklisted', async () => {
            await User.create(defaultUser);
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');
            await saveToken(refreshToken, defaultUser._id, expires, 'refresh', true);
      
            await request(app).post('/auth/refresh-token').send({ refreshToken }).expect(401);
          });
      
          test('return 401 error if refresh token is expired', async () => {
            await User.create(defaultUser);
            const expires = moment().subtract(1, 'minutes');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');
            await saveToken(refreshToken, defaultUser._id, expires, 'refresh');
      
            await request(app).post('/auth/refresh-token').send({ refreshToken }).expect(401);
          });
      
          test('return 401 error if user is not found', async () => {
            const expires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
            const refreshToken = generateToken(defaultUser._id, expires, 'refresh');
            await saveToken(refreshToken, defaultUser._id, expires, 'refresh');
      
            await request(app).post('/auth/refresh-token').send({ refreshToken }).expect(401);
          });
          
    });
});