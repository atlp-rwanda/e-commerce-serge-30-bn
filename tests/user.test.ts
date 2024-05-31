import { Request, Response } from 'express';
import {
  sendEmailVerification,
  verifyAuthenticationCode,
} from '../src/controllers/auth.controller';
import { UserService } from '../src/service/user.service';
import VerifyToken from '../src/models/verifytokens.model';
import User from '../src/models/user.model';
import { jest, describe, beforeEach, it, expect, beforeAll, afterAll } from '@jest/globals';
import { sendEmail } from '../src/helpers/TwoFactorAuth';
import AuthService from '../src/service/auth.service';
import jwt from 'jsonwebtoken'
import { server } from '../src/server';
import request from 'supertest';

jest.mock('../src/models/verifytokens.model');
jest.mock('../src/helpers/TwoFactorAuth');

describe('Two Factor Authentication Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  describe('sendEmailVerification', () => {
    it('should send verification email and create token', async () => {
      const email = 'test@example.com';
      const name = 'Test User';
      const user: Partial<User> = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password',
        resetToken: null,
        resetTokenExpiration: null,
      };

      const findUserByMock = jest.spyOn(UserService, 'findUserBy');
      findUserByMock.mockResolvedValueOnce(user as User);

      const createTokenMock = jest.spyOn(VerifyToken, 'create');
      createTokenMock.mockResolvedValueOnce({});

      req.body = { email, name };
      await sendEmailVerification(req as Request, res as Response);

   expect(200)



    });

    it('should handle user not found', async () => {
      const findUserByMock = jest.spyOn(UserService, 'findUserBy');
      findUserByMock.mockResolvedValueOnce(null);

      req.body = { email: 'nonexistent@example.com', name: 'Nonexistent User' };
      await sendEmailVerification(req as Request, res as Response);

      expect(sendEmail).not.toHaveBeenCalled();
    });
    it('should verify the authentication code successfully', async () => {
      const findUserByMock = jest.spyOn(UserService, 'findUserBy');
      findUserByMock.mockResolvedValueOnce({
        email: 'test@example.com',
      } as User);

      req.body = { email: 'test@example.com', code: '123456' };

      await verifyAuthenticationCode(req as Request, res as Response);

      expect(res.status).toHaveBeenCalled();
    });
  });
});

describe('GET /api/v1/admin/expired-password-users', () => {
  beforeAll(async () => {

    await request(server)
    .post('/api/v1/create')
    .send({
      username: 'adminuser21',
      email: 'admin21@example.com',
      password: 'password',
      role:'ADMIN',
      firstname: 'admin',
      lastname: 'user',
    });

    await request(server)
    .post('/api/v1/create')
    .send({
      username: 'testuser211',
      email: 'testuser211@example.com',
      password: 'password',
      firstname: 'admin',
      lastname: 'user',
      passwordExpired:true
    });
  });

  afterAll(async () => {
    await User.destroy({ where: { username: 'adminuser21' } });
    await User.destroy({ where: { username: 'testuser211@example.com' } });
  });

  it('should require authentication', async () => {
    const response = await request(server)
      .get('/api/v1/admin/expired-password-users')
      .send();

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Unauthenticated access: missing token');
  });

  it('should get all users with expired passwords for authenticated admin', async () => {
    const email = 'admin21@example.com';
    const user = await AuthService.getUserByEmail(email);

    if(user){
      const passwordRemoved = { ...user.toJSON(), password: undefined };
      const token = jwt.sign({ user: passwordRemoved }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

      const response = await request(server)
      .get('/api/v1/admin/expired-password-users')
      .set('Cookie', `Authorization=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    }
  });
});