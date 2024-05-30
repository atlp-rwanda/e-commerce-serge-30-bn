import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Payment, {
  PaymentMethod,
  PaymentStatus,
} from '../src/models/payment.model';

dotenv.config();
const app = configureApp();

let token: string | undefined;
let orderId: string | undefined;
let validPhoneNumber: string;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'pageyi4254@godsigma.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  token = loginResponse.body.token;
  orderId = 'ad114118-3fbd-443b-a849-dc02fd39d564';
  validPhoneNumber = '0123456789';
});

describe('POST /api/v1/payment/momo', () => {
  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).post('/api/v1/payment/momo').send({
      orderId,
      phoneNumber: validPhoneNumber,
    });

    expect(response.statusCode).toBe(401);
  });

  it('should return 404 if order is not found', async () => {
    const nonExistentOrderId = uuidv4();
    const response = await request(app)
      .post('/api/v1/payment/momo')
      .set('Cookie', `Authorization=${token}`)
      .send({
        orderId: nonExistentOrderId,
        phoneNumber: validPhoneNumber,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Order not found');
  });
  it('should return 400 if orderId is not a valid UUID', async () => {
    const invalidOrderId = 'invalid-uuid';
    const response = await request(app)
      .post('/api/v1/payment/momo')
      .set('Cookie', `Authorization=${token}`)
      .send({ orderId: invalidOrderId, phoneNumber: validPhoneNumber });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('"orderId" must be a valid GUID');
  });

  it('should return 400 if phoneNumber is not 10 digits', async () => {
    const invalidPhoneNumber = '1234';
    const response = await request(app)
      .post('/api/v1/payment/momo')
      .set('Cookie', `Authorization=${token}`)
      .send({ orderId, phoneNumber: invalidPhoneNumber });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('Phone number must be 10 digits');
  });

  it('should return 400 if phoneNumber is not a positive number', async () => {
    const invalidPhoneNumber = '-123456789';
    const response = await request(app)
      .post('/api/v1/payment/momo')
      .set('Cookie', `Authorization=${token}`)
      .send({ orderId, phoneNumber: invalidPhoneNumber });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain(
      'Phone number must be a positive number',
    );
  });

  it('should return 404 if order is not found', async () => {
    const nonExistentOrderId = uuidv4();
    const response = await request(app)
      .post('/api/v1/payment/momo')
      .set('Cookie', `Authorization=${token}`)
      .send({ orderId: nonExistentOrderId, phoneNumber: validPhoneNumber });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Order not found');
  });
  it('should return 400 if order is already paid', async () => {
    const paidPayment = await Payment.create({
      userId: '103e01f1-1ee3-4a85-ad4f-a00aa21bc884',
      orderId,
      amount: 100,
      payment_method: PaymentMethod.MOMO,
      payment_status: PaymentStatus.Completed,
      momoId: uuidv4(),
    });

    const response = await request(app)
      .post('/api/v1/payment/momo')
      .set('Cookie', `Authorization=${token}`)
      .send({
        orderId,
        phoneNumber: validPhoneNumber,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Order is already paid');

    await paidPayment.destroy();
  });
});

afterAll(() => {
  server.close();
});
