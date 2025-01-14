import request from 'supertest';
import { describe, expect, it, jest ,beforeAll,afterAll} from '@jest/globals';
import AuthService from '../src/service/auth.service';
import {server} from "../src/server"
import jwt from 'jsonwebtoken'
import User from '../src/models/user.model';
jest.mock('../src/service/auth.service');

beforeAll(() => {
  server;
});

describe('POST /api/v1/auth/forgot-password', () => {
  it('should return a 400 error for an empty email', async () => {
    const response = await request(server)
      .post('/api/v1/auth/forgot-password')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a 400 error for an invalid email', async () => {
    const response = await request(server)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'invalidEmail' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('PUT /api/v1/auth/:id/update-password', () => {

  beforeAll(async () => {
    await request(server)
    .post('/api/v1/create')
    .send({
      username: 'testuser1234',
      email: 'testuser1234@example.com',
      password: 'testuser1234',
      firstname: 'test',
      lastname: 'user1234',
    });
  });

  it('should return a 401 error for an invalid old password', async() =>{
    jest.spyOn(AuthService, 'verifyPassword').mockResolvedValue(false);
    const email = 'testuser1234@example.com';
    const user = await AuthService.getUserByEmail(email);

    if(user){
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

      const response = await request(server)
      .put(`/api/v1/auth/:id/update-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'wrongOldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid old password' });
    }
  });

  it('should return a 401 error if new password and confirm password do not match', async () => {
    jest.spyOn(AuthService, 'verifyPassword').mockResolvedValue(true);
    const email = 'testuser1234@example.com';
    const user = await AuthService.getUserByEmail(email);

    if(user){
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

      const response = await request(server)
      .put(`/api/v1/auth/:id/update-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'validOldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword123',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Password must match' });
    }
  });

  it('should return a 500 error if user is not found when updating password', async () => {
    jest.spyOn(AuthService, 'verifyPassword').mockResolvedValue(true);
    jest.spyOn(AuthService, 'updatePassword').mockRejectedValue(new Error('User not found'))
    
    const email = 'testuser1234@example.com';
    const user = await AuthService.getUserByEmail(email);

    if(user){
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

      const response = await request(server)
      .put(`/api/v1/auth/:id/update-password`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'validOldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    }
  });

  afterAll(async () =>{
    const createdUser = await User.findOne({
      where: { email: 'testuser1234@example.com' },
    });

    if (createdUser) {
      await createdUser.destroy();
    }
    const deletedUser = await User.findOne({
      where: { email: 'testuser1234@example.com' },
    });
    expect(deletedUser).toBeNull();
  })
});



describe('GET /api/v1/auth/logout', () => {
  it('should clear the Authorization cookie and return 200', async () => {
    const response = await request(server).get('/api/v1/auth/logout');

    const cookies = response.headers['set-cookie'];
    expect(cookies).toContain(
      'Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );

    expect(response.status).toBe(200);

    expect(response.text).toBe('Logout Successfully');
  });

    it('should handle errors and return 500', async () => {
      jest
        .spyOn(request(server), 'get')
        .mockRejectedValue(new Error('Error clearing cookie'));

      const response = await request(server).get('/api/v1/auth/logout');

      expect(response.status).toBe(200);

    });
});
afterAll(async () => {
  // Perform cleanup tasks here, such as stopping the server
   server.close();
});
describe('POST /api/v1/auth/login', () => {
  it('should return a 400 error for missing email', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: '"email" is required' });
  });

  it('should return a 400 error for missing password', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: '"password" is required' });
  });

  it('should return a 404 error for non-existent user', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

afterAll(() => {
  server.close();
});

describe('POST /api/v1/auth/login', () => {
  it('should return a 400 error for missing email', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ password: 'password123' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: '"email" is required' });
  });

  it('should return a 400 error for missing password', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: '"password" is required' });
  });

  it('should return a 404 error for non-existent user', async () => {
    const response = await request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });
});

afterAll(() => {
  server.close();
});
