import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;
let orderId: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'pageyi4254@godsigma.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  token = loginResponse.body.token;
  orderId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc884';
});

describe('POST /api/v1/payment', () => {
  it('should create a new payment and a Stripe Checkout session', async () => {
    const response = await request(app)
      .post('/api/v1/payment/')
      .set('Cookie', `Authorization=${token}`)
      .send({
        orderId,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.session).toBeInstanceOf(Object);
    expect(response.body.createPayment).toBeInstanceOf(Object);
  });
});
it('should return 404 if order id is not provided', async () => {
  const response = await request(app)
    .post('/api/v1/payment/')
    .set('Cookie', `Authorization=${token}`)
    .send({});

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe('Order not found');
});
describe('GET /api/v1/payment/success', () => {
  it('should update the payment status to "completed"', async () => {
    const userId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc884';

    const response = await request(app)
      .get(`/api/v1/payment/success?userId=${userId}&orderId=${orderId}`)
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.message).toBe('Payment successful');
  });
});

describe('GET /api/v1/payment/cancel', () => {
  it('should update the payment status to "canceled"', async () => {
    const userId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc884';
    const response = await request(app)
      .get(`/api/v1/payment/cancel?userId=${userId}&orderId=${orderId}`)
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.message).toBe('Payment canceled');
  });
});

afterAll(() => {
  server.close();
});
