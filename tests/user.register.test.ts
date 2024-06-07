import request from 'supertest';
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

beforeAll(() => {
  server;
});

afterEach(() => {
  server.close();
});

describe('POST /api/v1/create', () => {  
  it('should return a 400 error for missing required fields', async () => {
    const response = await request(server).post('/api/v1/create').send({}); // Sending empty object to simulate missing required fields
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a 400 error for invalid email', async () => {
    const userData = {
      username: 'testuser',
      email: 'invalidEmail', 
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
      password: 'pass', 
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
      email: 'existing@example.com', 
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

  it('should return a 400 error for existing username', async () => {
    jest
      .spyOn(UserService, 'createUser')
      .mockRejectedValue(new Error('Username already exists'));

    const userData = {
      username: 'testuser',
      email: 'existing@example.com', 
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
      'Username is already taken',
    );
  });
  
  jest.setTimeout(40000);
  it('should return 201 and create a new user successfully', async () => {
    const userData = {
      username: 'testuser21',
      email: 'test21@example.com',
      password: 'password',
      firstname: 'John',
      lastname: 'Doe',
    };

    const response = await request(server)
      .post('/api/v1/create')
      .send(userData);
    expect(response.status).toBe(201);  
    expect(response.body).toHaveProperty(
      'message',
      'Account created!',
    );
  });
});

afterAll(async()=>{
  // Retrieve the created user
  const createdUser = await User.findOne({
    where: { email: 'test21@example.com' },
  });

  if (createdUser) {
    await createdUser.destroy();
  }
  server.close();
})