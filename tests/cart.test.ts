/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import {  server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();

let token:any;
let cartId:any;
const productId = '62414288-5be2-4e5c-b048-323bbeedd369';

beforeEach(async () => {
  const loginResponse = await request(server).post('/api/v1/auth/login').send({
    email: 'tuyishimehope01@gmail.com',
    password: '123456',
  });
  token = loginResponse.body.token;
});

describe('POST /api/v1/cart', () => {
    it('should add a product to the cart', async () => {
        const response = await request(server)
            .post('/api/v1/cart/addtocart')
            .set('Cookie', `Authorization=${token}`)
            .send({ productid: productId, quantity: 1 });
    
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Item added to cart successfully');
        expect(response.body.cart).toBeInstanceOf(Object);
        cartId = response.body.cart.id;
    });

    it('should return 404 if product does not exist', async () => {
        const nonExistentProductId = 'non-existent-product-id';
        const response = await request(server)
            .post('/api/v1/cart')
            .set('Cookie', `Authorization=${token}`)
            .send({ productid: nonExistentProductId, quantity: 1 });

        expect(response.statusCode).toBe(404);
    })
})
afterAll(async () => {
  server.close();
});
