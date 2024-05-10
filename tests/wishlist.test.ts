import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;
let id: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'pageyi4254@godsigma.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  console.log(token);
  token = loginResponse.body.token;
});

describe('POST /api/v1/wishlist/:productId', () => {
  //create wishlist
  it('should add a product to the wishlist', async () => {
    // Arrange
    const productId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc884';

    // Act
    const response = await request(app)
      .get(`/api/v1/wishlist/${productId}`)
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
  });

  it('should return product already exist', async () => {
    // Arrange
    const productId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc884';

    // Act
    const response = await request(app)
      .get(`/api/v1/wishlist/${productId}`)
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Product already in wishlist');
  });

  //product doent exist
  it('should return 404 if product does not exist', async () => {
    // Arrange
    const productId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc885';

    // Act
    const response = await request(app)
      .get(`/api/v1/wishlist/${productId}`)
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Product not found');
  });
});
// get all wishlist
describe('GET /api/v1/wishlist', () => {
  it('should return all wishlist items', async () => {
    // Act
    const response = await request(app)
      .get('/api/v1/wishlist')
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    id = response.body.wishlist[0].id;
  });
});
// delete from wishlist
describe('DELETE /api/v1/wishlist/:wishlistId', () => {
  it('should delete a product from the wishlist', async () => {
    // Act
    const response = await request(app)
      .delete(`/api/v1/wishlist/${id}`)
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(200);
  });

  it('should return 404 if wishlist item does not exist', async () => {
    // Arrange
    const wishlistId = '103e01f1-1ee3-4a85-ad4f-a00aa21bc885';

    // Act
    const response = await request(app)
      .delete(`/api/v1/wishlist/${wishlistId}`)
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Wishlist not found');
  });

  // No product in wishlist
  it('should return 404 if wishlist is empty', async () => {
    // Act
    const response = await request(app)
      .get(`/api/v1/wishlist`)
      .set('Cookie', `Authorization=${token}`);
    // Assert
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No product in wishlist');
  });
});

afterAll(async () => {
  server.close();
});
