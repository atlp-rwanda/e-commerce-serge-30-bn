import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'pageyi4254@godsigma.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  console.log(token);
  token = loginResponse.body.token;
});

describe('PATCH /product/:productId', () => {
  it('require authentication', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'; // Replace with a valid product ID
    const response = await request(app)
      .patch(`/api/v1/product/${productId}`)
      .send({});

    expect(response.status).toBe(401);
  });

  it('should return 400 for invalid product ID', async () => {
    const productId = 'invalid-product-id';

    const response = await request(app)
      .patch(`/api/v1/product/${productId}`)
      .set('Cookie', `Authorization=${token}`)
      .send({ name: 'product name' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid product id');
  });

  it('should return 404 for non-existing product', async () => {
    const productId = '95c04254-b7e0-4bc4-b5c4-970213660cb5'; // Replace with a non-existing product ID

    const response = await request(app)
      .patch(`/api/v1/product/${productId}`)
      .set('Cookie', `Authorization=${token}`)
      .send({ name: 'test product' });
    expect(response.body).toHaveProperty(
      'message',
      'This product is not found in your collection',
    );
  });
  it('should return 404 for empty request body', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000'; // Replace with a valid product ID

    const response = await request(app)
      .patch(`/api/v1/product/${productId}`)
      .set('Cookie', `Authorization=${token}`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      'message',
      'At least one attribute required to update product',
    );
  });
});
afterAll(async () => {
  server.close();
});
