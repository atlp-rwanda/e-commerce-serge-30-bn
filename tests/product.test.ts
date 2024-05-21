import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'mahirwe@gmail.com',
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

describe('GET /api/v1/product/:productId', () => {
    it('should require authentication', async () => {
      const productId = 'valid-product-id'; // Replace with a valid product ID
      const response = await request(app)
        .get(`/api/v1/product/${productId}`)
        .send();
  
      expect(response.status).toBe(401);
    });
    it("should return specific product by id", async () => {
      const res = await request(app)
      .get("/api/v1/product/c8903a64-f93c-4de1-baa0-6b02b0ca5518")
      .set('Cookie', `Authorization=${token}`)
      .send()

      expect(res.statusCode).toBe(200);
      
    });
  
    it('should return 404 when product is not found', async () =>{
      const productId = '95c04254-b7e0-4bc4-b5c4-970213660cb5';
      const role= 'VENDOR';
      const response = await request(app)
      .get(`/api/v1/product/${productId}`)
      .set('Cookie', `Authorization=${token}`)
      .send()

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: `${role === 'VENDOR'? 'Product not found in your collection' : 'Product not found' }`
      });
    })
  });
describe('GET /api/v1/product/all', () => {
  it('should require authentication', async () => {// Replace with a valid product ID
    const response = await request(app)
      .get(`/api/v1/product/all`)
      .send();

    expect(response.status).toBe(401);
  });
  it("should get all products in the table", async () => {
    const res = await request(app)
    .get("/api/v1/products/all")
    .set('Cookie', `Authorization=${token}`)
    
  expect(res.statusCode).toBe(200);
    
  });
});

afterAll(async () => {
  server.close();
});
