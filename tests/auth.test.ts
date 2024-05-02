import request from 'supertest';
import { configureApp } from '../src/server';
import { describe, expect, it, jest } from '@jest/globals';
import AuthService from '../src/service/auth.service';

jest.mock('../src/service/auth.service');

const app = configureApp(); // Replace with your app entry point

describe('POST /api/v1/auth/forgot-password', () => {
  it('should return a 400 error for an empty email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return a 400 error for an invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'invalidEmail' });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});

describe('PUT /api/v1/auth/:userId/update-password', () => {
  it('should return a 401 error for an invalid old password', async () => {
    jest.spyOn(AuthService, 'verifyPassword').mockResolvedValue(false);

    const response = await request(app)
      .put(`/api/v1/auth/:userId/update-password`)
      .send({ oldPassword: 'wrongOldPassword', newPassword: 'newPassword', confirmPassword: 'newPassword' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid old password' });
  });

  it('should return a 401 error if new password and confirm password do not match', async () => {
    jest.spyOn(AuthService, 'verifyPassword').mockResolvedValue(true);

    const response = await request(app)
      .put(`/api/v1/auth/:userId/update-password`)
      .send({ oldPassword: 'validOldPassword', newPassword: 'newPassword', confirmPassword: 'newPassword123' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Password must match' });
  });

  it('should return a 500 error if user is not found when updating password', async () => {
    jest.spyOn(AuthService, 'verifyPassword').mockResolvedValue(true);
    jest.spyOn(AuthService, 'updatePassword').mockRejectedValue(new Error('User not found'));

    const response = await request(app)
      .put(`/api/v1/auth/:userId/update-password`)
      .send({ oldPassword: 'validOldPassword', newPassword: 'newPassword', confirmPassword: 'newPassword' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });

});