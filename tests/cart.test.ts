import request, { Request, Response } from 'supertest';
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
import { cartController } from '../src/controllers/cart.controller';
import { ProductService } from '../src/service/product.service';
import Cart from '../src/models/cart.model';

dotenv.config();

let cartId: string;
const productId = '700232a2-fe00-4503-8faf-056b8975e2c5';

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
  it('should return 401 when an error occurs during order creation', async () => {
    const req = {} as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Partial<Response>;
    await cartController.addItemToCart(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(401);
  });
  it('should return 500 with product not found message if product does not exist', async () => {
    const mockGetProductById = jest.spyOn(ProductService, 'getProductById');

    mockGetProductById.mockRejectedValueOnce(new Error());

    const req = {
      user: { user_id: 'test123' },
    } as Partial<Request>;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Partial<Response>;

    await cartController.addItemToCart(req as never, res as never);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);

    mockGetProductById.mockRestore();
  });
  it('should return 404 if product does not exist in the cart', async () => {
    const loginResponse = await request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'twizald.02@gmail.com',
        password: '123123',
      });
    const token = loginResponse.body.token;
    const response = await request(server)
      .post(`/api/v1/cart/addtocart`)
      .set('Cookie', `Authorization=${token}`)
      .send({
        productid: 'c0abe869-6203-413f-0000-73b2361579b7',
        quantity: 3,
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Product not found.');
  });
  it('should create a new cart and return it', async () => {
    const cartData = {
      user_id: '123',
      product_id: '456',
      quantity: 1,
    };

    const mockCartCreate = jest.spyOn(Cart, 'create');
    mockCartCreate.mockResolvedValueOnce({
      id: 1,
      user_id: '123',
      product_id: '456',
      quantity: 1,
    } as never);

    const result = await CartService.saveToCart(cartData);

    expect(mockCartCreate).toHaveBeenCalledTimes(1);
    expect(mockCartCreate).toHaveBeenCalledWith(cartData);
    expect(result).toEqual({
      id: 1,
      user_id: '123',
      product_id: '456',
      quantity: 1,
    });

    mockCartCreate.mockRestore();
  });
  it('should create a new cart and return it', async () => {
    const mockCartCreate = jest.spyOn(Cart, 'findByPk');
    mockCartCreate.mockResolvedValueOnce({
      id: 1,
      user_id: '123',
      product_id: '456',
      quantity: 1,
    } as never);

    const result = await CartService.getCartById('123');
    console.log(result);
    expect(mockCartCreate).toHaveBeenCalledTimes(1);

    mockCartCreate.mockRestore();
  });
  it('should throw an error if creating a new cart fails', async () => {
    const cartData = {
      user_id: '123',
      product_id: '456',
      quantity: 1,
    };

    const mockCartCreate = jest.spyOn(Cart, 'create');
    mockCartCreate.mockRejectedValueOnce(new Error('Failed to create cart'));

    await expect(CartService.saveToCart(cartData)).rejects.toThrowError(
      'Failed to save data to cart.',
    );

    mockCartCreate.mockRestore();
  });
  it('should throw an error if creating a new cart fails', async () => {
    const mockCartCreate = jest.spyOn(Cart, 'findOne');
    mockCartCreate.mockRejectedValueOnce(new Error('Failed to create cart'));

    await expect(CartService.getCartByUserId('123')).rejects.toThrowError();

    mockCartCreate.mockRestore();
  });
  it('should throw an error if creating a new cart fails', async () => {
    const mockCartCreate = jest.spyOn(Cart, 'findOne');
    mockCartCreate.mockRejectedValueOnce(new Error('Failed to create cart'));

    await expect(CartService.getCartById('123')).rejects.toThrowError();

    mockCartCreate.mockRestore();
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
    expect(response.body.message).toBe('Product not found.');

    await request(server)
      .delete(`/api/v1/cart/deletecartitem/${productId}`)
      .set('Cookie', `Authorization=${token}`);
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
    const response = await request(server).get('/api/v1/cart/viewcart');

    expect(response.statusCode).toBe(401);
  });

  it("should return 404 if user's cart is empty", async () => {
    // Mocking the scenario where the user's cart is empty
    jest.spyOn(CartService, 'getCartByUserId').mockResolvedValue(null);
    const email = 'yuppiegvng@gmail.com';
    const user = await AuthService.getUserByEmail(email);

    if (user) {
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign(
        { user: passwordRemoved },
        process.env.JWT_SECRET || '',
        { expiresIn: '1h' },
      );

      const response = await request(server)
        .get('/api/v1/cart/viewcart')
        .set('Cookie', `Authorization=${token}`);

      expect(response.statusCode).toBe(404);
    }
  });

  it("should return user's cart with status code 200", async () => {
    const email = 'yuppiegvng@gmail.com';
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
        .set('Cookie', `Authorization=${token}`);
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
