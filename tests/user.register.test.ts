import request from 'supertest';
// import { configureApp } from '../src/server';
import {
  describe,
  expect,
  it,
  jest,
  afterEach,beforeAll,
  afterAll,
} from '@jest/globals';
import { UserService } from '../src/service/user.service';
import User from '../src/models/user.model';
import { server } from '../src/server';
// const app = configureApp();

beforeAll(() => {
  server;
});


beforeAll(() => {
  server;
});
describe('POST /create', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 400 error for missing required fields', async () => {
    const response = await request(server).post('/api/v1/create').send({}); // Sending empty object to simulate missing required fields
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a 400 error for invalid email', async () => {
    const userData = {
      username: 'testuser',
      email: 'invalidEmail', // Invalid email format
      password: 'password',
      firstname: 'John',
      lastname: 'Doe',
    };

    const response = await request(server)
      .post('/api/v1/create')
      .send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a 400 error for invalid password', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'pass', // Invalid password (less than 6 characters)
      firstname: 'John',
      lastname: 'Doe',
    };

    const response = await request(server)
      .post('/api/v1/create')
      .send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a 400 error for existing email', async () => {
    // Simulate the error condition where the email already exists
    jest
      .spyOn(UserService, 'createUser')
      .mockRejectedValue(new Error('Email already exists'));

    const userData = {
      username: 'testuser',
      email: 'existing@example.com', // Use an existing email
      password: 'password',
      firstname: 'John',
      lastname: 'Doe',
    };

    const response = await request(server)
      .post('/api/v1/create')
      .send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Email is already registered',
    );
  });

  it('should create a new user successfully', async () => {
    const userData = {
      username: 'testuser21',
      email: 'test@example21.com',
      password: 'password',
      firstname: 'John',
      lastname: 'Doe',
    };

    const response = await request(server)
      .post('/api/v1/create')
      .send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Account created!');
    expect(response.body).toHaveProperty('data');

    // Retrieve the created user
    const createdUser = await User.findOne({
      where: { email: userData.email },
    });

    if (createdUser) {
      await createdUser.destroy();
    }
    const deletedUser = await User.findOne({
      where: { email: userData.email },
    });
    expect(deletedUser).toBeNull();
  });
});
afterAll(()=>{
  server.close();
})
