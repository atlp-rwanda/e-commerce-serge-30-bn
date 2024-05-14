/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import { server } from '../src/server';
import {
  describe,
  expect,
  it,
  afterAll,
  beforeEach,
  jest,
} from '@jest/globals';
import dotenv from 'dotenv';
import AuthService from '../src/service/auth.service';
import { CartService } from '../src/service/cart.service';
import jwt from 'jsonwebtoken';
jest.mock('../src/service/cart.service');
jest.mock('../src/service/auth.service');

dotenv.config();

let cartId: any;
const productId = '62414288-5be2-4e5c-b048-323bbeedd369';

beforeEach(async () => {
  server;
});

describe('POST /api/v1/cart', () => {
  it('should add a product to the cart', async () => {
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );

      const response = await request(server)
        .post('/api/v1/cart/addtocart')
        .set('Cookie', `Authorization=${token}`)
        .send({ productid: productId, quantity: 1 });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Item added to cart successfully');
      expect(response.body.cart).toBeInstanceOf(Object);
      cartId = response.body.cart.id;
    }
  });

  it('should return 404 if product does not exist', async () => {
    const nonExistentProductId = 'non-existent-product-id';
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );

      const response = await request(server)
        .post('/api/v1/cart')
        .set('Cookie', `Authorization=${token}`)
        .send({ productid: nonExistentProductId, quantity: 1 });

      expect(response.statusCode).toBe(404);
    }
  });
});

describe('PUT /api/v1/cart/updatecart/:cartId', () => {
  it('should update the product quantity in the cart', async () => {
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );

      await request(server)
        .post('/api/v1/cart/addtocart')
        .set('Cookie', `Authorization=${token}`)
        .send({ productid: productId, quantity: 1 });

      const response = await request(server)
        .put(`/api/v1/cart/updatecart/${cartId}`)
        .set('Cookie', `Authorization=${token}`)
        .send({ productId, quantity: 3 });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Cart updated successfully');
      expect(response.body.cart).toBeInstanceOf(Object);
      expect(response.body.cart.totalQuantity).toBeGreaterThan(0);
      expect(response.body.cart.totalPrice).toBeGreaterThan(0);
    }
  });

  it('should return 404 if product does not exist in the cart', async () => {
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );

      const response = await request(server)
        .put(`/api/v1/cart/updatecart/${cartId}`)
        .set('Cookie', `Authorization=${token}`)
        .send({ productId: 'non-existent-product-id', quantity: 3 });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'Product does not exist in your cart. Consider adding it instead.',
      );
    }
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(server)
      .put(`/api/v1/cart/updatecart/${cartId}`)
      .send({ productId, quantity: 3 });

    expect(response.statusCode).toBe(401);
  });

  it('should return 500 for an internal server error', async () => {
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );

      jest
        .spyOn(CartService, 'updateProductInCart')
        .mockRejectedValue(new Error('Internal server error'));

      const response = await request(server)
        .put(`/api/v1/cart/updatecart/${cartId}`)
        .set('Cookie', `Authorization=${token}`)
        .send({ productId, quantity: 3 });

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    }
  });
});

afterAll(async () => {
  server.close();
});
