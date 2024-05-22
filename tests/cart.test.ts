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
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }

    const response = await request(server)
      .post('/api/v1/cart/addtocart')
      .set('Cookie', `Authorization=${token}`)
      .send({ productid: productId, quantity: 1 });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Item added to cart successfully');
    cartId = response.body.cart.id;
    console.log(cartId);
  });

  it('should return 404 if product does not exist', async () => {
    const nonExistentProductId = 'non-existent-product-id';
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }

    const response = await request(server)
      .post('/api/v1/cart')
      .set('Cookie', `Authorization=${token}`)
      .send({ productid: nonExistentProductId, quantity: 1 });

    expect(response.statusCode).toBe(404);

    await request(server).post('/api/v1/cart/clearcart');
  });
});

describe('PATCH /api/v1/cart/updatecart/:cartId', () => {
  it('should update the product quantity in the cart', async () => {
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }

    await request(server)
        .post('/api/v1/cart/addtocart')
        .set('Cookie', `Authorization=${token}`)
        .send({ productid: productId, quantity: 1 });

      const response = await request(server)
        .patch(`/api/v1/cart/updatecart/${cartId}`)
        .set('Cookie', `Authorization=${token}`)
        .send({ productId, quantity: 3 });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Cart updated successfully');
      expect(response.body.cart).toBeInstanceOf(Object);
      expect(response.body.cart.totalQuantity).toBeGreaterThan(0);
      expect(response.body.cart.totalPrice).toBeGreaterThan(0);

  });

  it('should return 404 if product does not exist in the cart', async () => {
    const email = 'tuyishimehope01@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }

    const response = await request(server)
        .patch(`/api/v1/cart/updatecart/${cartId}`)
        .set('Cookie', `Authorization=${token}`)
        .send({ productId: 'c0abe869-6203-413f-0000-73b2361579b7', quantity: 3 });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe(
        'Product not found.',
      );

      await request(server)
        .delete(`/api/v1/cart/deletecartitem/${productId}`)
        .set('Cookie', `Authorization=${token}`)
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(server)
      .patch(`/api/v1/cart/updatecart/${cartId}`)
      .send({ productId, quantity: 3 });

    expect(response.statusCode).toBe(401);
  });
});

describe('GET /api/v1/cart/viewcart', () => {

  it('should return 401 if user is not authenticated', async () => {
      const response = await request(server)
          .get('/api/v1/cart/viewcart');

      expect(response.statusCode).toBe(401);
  });

  it('should return 404 if user\'s cart is empty', async () => {
    // Mocking the scenario where the user's cart is empty
    jest.spyOn(CartService, 'getCartByUserId').mockResolvedValue(null);
    const email = 'yuppiegvng@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if(user){
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

      const response = await request(server)
        .get('/api/v1/cart/viewcart')
        .set('Cookie', `Authorization=${token}`)

    expect(response.statusCode).toBe(404);
    }
});

  it('should return user\'s cart with status code 200', async () => {
    const email = 'yuppiegvng@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if(user){
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

      await request(server)
        .post('/api/v1/cart/addtocart')
        .set('Cookie', `Authorization=${token}`)
        .send({ productid: productId, quantity: 1 });

      const response = await request(server)
        .get('/api/v1/cart/viewcart')
        .set('Cookie', `Authorization=${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.cart).toHaveProperty('id');
        expect(response.body.cart).toHaveProperty('userId');
        expect(response.body.cart).toHaveProperty('products');
        expect(response.body.cart).toHaveProperty('totalPrice');
        expect(response.body.cart.products).toBeInstanceOf(Array);

        await request(server)
        .delete(`/api/v1/cart/deletecartitem/${productId}`)
        .set('Cookie', `Authorization=${token}`)
    }
  });
});

describe('POST /api/v1/cart/clearcart', () => {
  it('Should clear the cart and return 200', async () => {
    const cartData = {
      userId: 'b1950838-d809-4124-a154-a03380990270',
      products: [
        {
          productId: '7059362e-34de-4c61-0001-12bb235fbc1f',
          quantiy: 2,
          price: 5,
        },
      ],
      totalPrice: 10,
      totalQuantity: 2,
    };

    CartService.saveToCart(cartData);

    const email = 'olivierbyiringiro025@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }
    const response = await request(server)
      .post('/api/v1/cart/clearcart')
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Cart cleared succefully');
  });

  it('Should return 401 if the user is not logged in', async () => {
    const response = await request(server).post('/api/v1/cart/clearcart');

    expect(response.statusCode).toBe(401);
  });

  it('Should return 404 if the user doesnt have items in cart', async () => {
    const email = 'olivierbyiringiro025@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }
    const response = await request(server)
      .post('/api/v1/cart/clearcart')
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Cart not found');
  });
});

describe('DELETE /api/v1/cart/deletecartitem/:productId', () => {
  const cartData = {
    userId: 'b1950838-d809-4124-a154-a03380990270',
    products: [
      {
        productId: '7059362e-34de-4c61-0001-12bb235fbc1f',
        quantiy: 2,
        price: 5,
      },
    ],
    totalPrice: 10,
    totalQuantity: 2,
  };

  it('Should return 404 if the product is not in your cart', async () => {
    CartService.saveToCart(cartData);
    const email = 'olivierbyiringiro025@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }
    const response = await request(server)
      .delete('/api/v1/cart/deletecartitem/4c61-0001')
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('The product is not in your cart');
  });

  it('Should Delete the item from cart and return 200', async () => {
    const email = 'olivierbyiringiro025@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }
    const response = await request(server)
      .delete(
        `/api/v1/cart/deletecartitem/7059362e-34de-4c61-0001-12bb235fbc1f`,
      )
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Product removed successfully');
  });

  it('Should return 200 if the cart is already empty', async () => {
    const email = 'olivierbyiringiro025@gmail.com';
    const user = await AuthService.getUserByEmail(email);
    let token;

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );
    }
    const response = await request(server)
      .delete(
        `/api/v1/cart/deletecartitem/7059362e-34de-4c61-0001-12bb235fbc1f`,
      )
      .set('Cookie', `Authorization=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Your cart is empty');
  });

  it('Should return 401 if the user is not logged in', async () => {
    const response = await request(server).delete(
      '/api/v1/cart/deletecartitem/7059362e-34de-4c61-0001-12bb235fbc1f',
    );

    expect(response.statusCode).toBe(401);
  });
});

afterAll(async () => {
  server.close();
});
