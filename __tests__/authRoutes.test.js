'use strict';

const request = require('supertest');
const express = require('express');
const { sequelizeDatabase, userModel } = require('../src/models');
const authRouter = require('../src/routes/auth');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

const userInfo = {
    username: 'testuser',
    password: 'testpassword'
};

beforeAll(async () => {
    try {
        await sequelizeDatabase.authenticate();
        console.log('Connected to test database');
    } catch (error) {
        console.error('Unable to connect to the test database:', error);
    }
    await sequelizeDatabase.sync();
});

afterAll(async () => {
    await sequelizeDatabase.close();
});

describe('Auth routes', () => {
    test('should signup a new user', async () => {
        const response = await request(app).post('/auth/signup').send(userInfo);
        expect(response.status).toBe(201);
        expect(response.body.username).toBe(userInfo.username);
    });

    test('should not signup a user with the same username', async () => {
        const response = await request(app).post('/auth/signup').send(userInfo);
        expect(response.status).toBe(500); // or whatever error code you have for duplicate user
    });

    test('should signin a valid user', async () => {
        const validCredentials = Buffer.from(`${userInfo.username}:${userInfo.password}`).toString('base64');
        const response = await request(app).post('/auth/signin').set('Authorization', `Basic ${validCredentials}`);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe(userInfo.username);
    });

    test('should not signin an invalid user', async () => {
        const invalidCredentials = Buffer.from(`${userInfo.username}:wrongpassword`).toString('base64');
        const response = await request(app).post('/auth/signin').set('Authorization', `Basic ${invalidCredentials}`);
        expect(response.status).toBe(403); // or whatever your error code is for unauthorized access
    });
});


