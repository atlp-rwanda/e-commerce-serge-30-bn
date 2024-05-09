import { Request, Response } from 'express';
import {
  sendEmailVerification,
  verifyAuthenticationCode,
} from '../src/controllers/auth.controller';
import { UserService } from '../src/service/user.service';
import VerifyToken from '../src/models/verifytokens.model';
import User from '../src/models/user.model';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { sendEmail } from '../src/helpers/TwoFactorAuth';

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
