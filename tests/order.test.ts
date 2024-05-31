import request from 'supertest';
import { configureApp, server } from '../src/server';
import {
  describe,
  expect,
  it,
  afterAll,
  beforeEach,
} from '@jest/globals';
import dotenv from 'dotenv';

dotenv.config();
let token: string | undefined;

const app = configureApp();
beforeEach(async () => {
  server;
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'tuyishimehope01@gmail.com',
    password: '123456',
  });
  token = loginResponse.body.token;
});

describe('POST /api/v1/cart', () => {
  it('should create order', async () => {
    const response = await request(server)
      .post('/api/v1/checkout')
      .set('Cookie', `Authorization=${token}`)
      .send({
        address: '123 Maple Street',
        country: 'United States',
        city: 'New York',
        phone: '+1-212-555-0123',
        zipCode: '10001',
        expectedDeliveryDate: '06/10/2024',
      });

    expect(response.statusCode).toBe(201);
  });

  it('should return 404 if user id is not provided', async () => {
    const response = await request(app)
      .post('/api/v1/checkout')
      .set('Cookie', `Authorization=123`)
      .send({});

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
      'Unauthorized access: token has expired or it is malformed',
    );
  });
    it('should return 500 if user id is not provided', async () => {
      const response = await request(server).post('/api/v1/checkout').set('Cookie', `Authorization=${token}`).send({
        address: '123 Maple Street',
        country: 'United States',
        city: 'New York',
        phone: '+1-212-555-0123',
        zipCode: '10001',
        // expectedDeliveryDate: '06/10/2024',
      });

      expect(response.statusCode).toBe(500);
    });

});

afterAll(async () => {
  server.close();
});
