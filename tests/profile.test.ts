import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { server } from '../src/server';
import jwt from 'jsonwebtoken';
import User from '../src/models/user.model';
import AuthService from '../src/service/auth.service';

let token: string;
beforeAll(async () => {
  server;
  await request(server).post('/api/v1/create').send({
    username: 'test',
    email: 'user@test.com',
    password: 'test123',
    firstname: 'test',
    lastname: 'test',
  });

  const email = 'user@test.com';
  const user = await AuthService.getUserByEmail(email);

  if (user) {
    const passwordRemoved = { ...user.toJSON(), password: undefined };
    token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', {
      expiresIn: '1h',
    });
  }
});

describe('profile part - PUT ', () => {
  it('should return 201', async () => {
    const response = await request(server)
      .put(`/api/v1/users/profile`)
      .set('Cookie', `Authorization=${token}`)
      .send({ gender: 'Male' });
    expect(response.status).toBe(201);
  });
  it('should return 400... empty', async () => {
    const responseEmpty = await request(server)
      .put(`/api/v1/users/profile`)
      .set('Cookie', `Authorization=${token}`)
      .send({});
    expect(responseEmpty.status).toBe(400);
    expect(responseEmpty.body).toEqual({ message: 'no fields to update' });
  });

  it('should return 400... validation', async () => {
    const responseValidation = await request(server)
      .put(`/api/v1/users/profile`)
      .set('Cookie', `Authorization=${token}`)
      .send({ gender: 'invalidgender' });
    expect(responseValidation.status).toBe(400);
    expect(responseValidation.body).toEqual({
      message: '"gender" must be one of [male, female, other]',
    });
  });

  it('should return 401 error for invalid token', async () => {
    const responseInvalidToken = await request(server)
      .put(`/api/v1/users/profile`)
      .set('Cookie', `Authorization=invalid`)
      .send({ gender: 'Male' });
    expect(responseInvalidToken.status).toBe(401);
    expect(responseInvalidToken.body).toEqual({
      message: 'Unauthorized access: token has expired or it is malformed',
    });
  });

  it('should return 401 error for missing authorization token', async () => {
    const responseMissingToken = await request(server)
      .put(`/api/v1/users/profile`)
      .send({ email: 'test@example.com', username: 'testuser' });
    expect(responseMissingToken.status).toBe(401);
    expect(responseMissingToken.body).toEqual({
      message: 'Unauthenticated access: missing token',
    });
  });
});

describe('profile part - GET ', () => {
  it('should return 401 error for missing authorization token', async () => {
    const response = await request(server).get(`/api/v1/users/profile`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Unauthenticated access: missing token',
    });
  });

  it('should return 401 error for invalid token', async () => {
    const response = await request(server)
      .get(`/api/v1/users/profile`)
      .set('Cookie', `Authorization=invalid`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'Unauthorized access: token has expired or it is malformed',
    });
  });

  it('should return 200 and a profile', async () => {
    const response = await request(server)
      .get(`/api/v1/users/profile/`)
      .set('Cookie', `Authorization=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('profile');
  });
});

afterAll(async () => {
  const createdUser = await User.findOne({
    where: { email: 'user@test.com' },
  });

  if (createdUser) {
    await createdUser.destroy();
  }
  const deletedUser = await User.findOne({
    where: { email: 'user@test.com' },
  });
  expect(deletedUser).toBeNull();
  server.close();
});
