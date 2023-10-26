const bcrypt = require('bcrypt');
const basicAuth = require('../src/auth/basicAuth');
const { sequelizeDatabase, userModel } = require('../src/models');


// Mock request and response
const httpMocks = require('node-mocks-http');

// userInfo for test user
const userInfo = {
    username: 'testuser',
    password: 'testpassword'
};

// Ensure connection
beforeAll(async () => {
    try {
        await sequelizeDatabase.authenticate();
        console.log('Connected to test database');
    } catch (error) {
        console.error('Unable to connect to the test database:', error);
    }
    await sequelizeDatabase.sync();
});

// Creating test user
beforeEach(async () => {
    const encryptedPassword = await bcrypt.hash(userInfo.password, 5);
    await userModel.create({
        username: userInfo.username,
        password: encryptedPassword,
    });
});

// Removing test user
afterEach(async () => {
    await userModel.destroy({ where: { username: userInfo.username } });
});

// Close connection
afterAll(async () => {
    await sequelizeDatabase.close();
});

// Test cases
describe('Basic Authentication Middleware', () => {
    test('should login for valid username and password', async () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'Basic ' + Buffer.from(`${userInfo.username}:${userInfo.password}`).toString('base64'),
            }
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();

        await basicAuth(request, response, next);

        expect(next).toHaveBeenCalled();
    });

    test('should not login for valid username but invalid password', async () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'Basic ' + Buffer.from(`${userInfo.username}:wrongpassword`).toString('base64'),
            }
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();

        await basicAuth(request, response, next);

        expect(response.statusCode).toBe(403);
    });

    test('should not login for invalid username', async () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'Basic ' + Buffer.from(`wronguser:${userInfo.password}`).toString('base64'),
            }
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();

        await basicAuth(request, response, next);

        expect(response.statusCode).toBe(403);
    });

    test('should not login if no authorization header is provided', async () => {
        const request = httpMocks.createRequest();
        const response = httpMocks.createResponse();
        const next = jest.fn();

        await basicAuth(request, response, next);

        expect(response.statusCode).toBe(401);
    });
});
