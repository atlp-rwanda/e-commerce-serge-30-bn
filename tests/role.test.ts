import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'mahirwemahirwe@gmail.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  console.log(token);
  token = loginResponse.body.token;
});

describe('PATCH /api/v1/product/:userId', () => {
    it('should require authentication', async () => {
      const userId = 'valid-user-id'; // Replace with a valid product ID
      const response = await request(app)
        .patch(`/api/v1/role/${userId}`)
        .send();
  
      expect(response.status).toBe(401);
    });
  });

afterAll(() => {
  server.close();
});