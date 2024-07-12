import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'martinemahirwe@gmail.com',
    password: process.env.USER_PASSWORD_TEST,
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
  it('should return a 200 status and updated user data', async () => {

    const response = await request(app)
      .patch(`/api/v1/role/47d0b1e8-f04b-402e-bb5e-57941be42964`)
      .send({ role: 'ADMIN' })
      .set('Cookie', `Authorization=${token}`);

    expect(response.status).toBe(200);
    
});
})

afterAll(() => {
server.close();
});