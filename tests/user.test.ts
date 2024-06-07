/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import {
  sendEmailVerification,
  verifyAuthenticationCode,
} from '../src/controllers/auth.controller';
import { UserService } from '../src/service/user.service';
import { VerifyTokenService } from '../src/service/VerifyToken.service';
import User, { UserRole } from '../src/models/user.model';
import {
  jest,
  describe,
  it,
  beforeAll,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from '@jest/globals';
import { server } from '../src/server';

import { sendEmail } from '../src/helpers/sendEmail';
const mockUser = {
  user_id: 'testuser123',
  username: 'testuser',
  email: 'test@example.com',
  role: UserRole.USER,
  firstname: 'Test',
  lastname: 'User',
};

const mockToken = {
  dataValues: {
    email: 'test@example.com',
    token: '123456',
    expirationTime: new Date(Date.now() + 60 * 60 * 1000),
    used: false,
  },
  update: jest.fn().mockResolvedValue(null as never),
};

jest.mock('../src/service/user.service');
jest.mock('../src/service/verifyToken.service');
jest.mock('../src/service/VerifyToken.service');
jest.mock('../src/helpers/sendEmail');
jest.mock('../src/helpers/EmailTemplates/twoFactorAuthEmailTemplate');
const loginRoute = '/api/v1/auth/login';
const verifyCodeRoute = '/api/v1/auth/verify-authentication-code';
const sendCodeRoute = '/api/v1/auth/send-verification-email';

const app = express();
app.use(bodyParser.json());
app.post(sendCodeRoute, sendEmailVerification);
app.post(verifyCodeRoute, verifyAuthenticationCode);

let authToken: string;
describe('Two Factor Authentication', () => {
  describe('sendEmailVerification', () => {
    const mockEmails = 'test@example.com';
    const mockUsers = { dataValues: { username: 'testUser', user_id: 1 } };
    const mockTokens = '123456';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';

    it('should return 200 and send verification email successfully', async () => {
      (UserService.findUserBy as jest.Mock).mockResolvedValue(
        mockUsers as never,
      );
      (sendEmail as jest.Mock).mockResolvedValue({ success: true } as never);

      const response = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .send({ email: mockEmails });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Verification email sent successfully',
      );
      expect(UserService.findUserBy).toHaveBeenCalledWith(mockEmails);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: mockEmails,
          from: fromEmail,
          subject: 'Verification Code',
          template: expect.any(Function),
        }),
      );
    });

    it('should return 404 if user is not found', async () => {
      (UserService.findUserBy as jest.Mock).mockResolvedValue(null as never);

      const response = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .send({ email: mockEmails });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 on internal server error', async () => {
      (UserService.findUserBy as jest.Mock).mockRejectedValue(
        new Error('Internal server error') as never,
      );

      const response = await request(app)
        .post('/api/v1/auth/send-verification-email')
        .send({ email: mockEmails });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
  describe('POST /api/v1/auth/verify-authentication-code', () => {
    beforeEach(() => {
      server;
    });
    afterEach(async () => {
      server.close();
    });
    beforeAll(async () => {
      const loginResponse = await request(app)
        .post(loginRoute)
        .send({ email: 'tuyishimehope01@gmail.com', password: '123456' });

      authToken = loginResponse.body.token;
    });
    it('should verify authentication code and return 200', async () => {
      (UserService.findUserBy as jest.Mock).mockResolvedValue(
        mockUser as never,
      );
      (VerifyTokenService.findEmailAndToken as jest.Mock).mockResolvedValue(
        mockToken as never,
      );

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'test@example.com', code: '123456' });

      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should return 404 if user does not exist', async () => {
      (UserService.findUserBy as jest.Mock).mockResolvedValue(null as never);

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'nonexistent@example.com', code: '123456' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 404 if token does not exist', async () => {
      (UserService.findUserBy as jest.Mock).mockResolvedValue(
        mockUser as never,
      );
      (VerifyTokenService.findEmailAndToken as jest.Mock).mockResolvedValue(
        null as never,
      );

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'test@example.com', code: 'invalid' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Token not found');
    });

    it('should return 400 if token is expired', async () => {
      const expiredToken = {
        ...mockToken,
        dataValues: {
          ...mockToken.dataValues,
          expirationTime: new Date(Date.now() - 60 * 60 * 1000),
        },
      };
      (UserService.findUserBy as jest.Mock).mockResolvedValue(
        mockUser as never,
      );
      (VerifyTokenService.findEmailAndToken as jest.Mock).mockResolvedValue(
        expiredToken as never,
      );

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'test@example.com', code: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Token has expired');
    });

    it('should return 400 if token is used', async () => {
      const usedToken = {
        ...mockToken,
        dataValues: {
          ...mockToken.dataValues,
          used: true,
        },
      };
      (UserService.findUserBy as jest.Mock).mockResolvedValue(
        mockUser as never,
      );
      (VerifyTokenService.findEmailAndToken as jest.Mock).mockResolvedValue(
        usedToken as never,
      );

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'test@example.com', code: '123456' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Token has expired');
    });

    it('should return 400 if authentication code is invalid', async () => {
      const invalidToken = {
        ...mockToken,
        dataValues: {
          ...mockToken.dataValues,
          token: '654321',
          used: false,
          expirationTime: new Date(Date.now() + 60 * 60 * 1000),
        },
      };
      (UserService.findUserBy as jest.Mock).mockResolvedValue(
        mockUser as never,
      );
      (VerifyTokenService.findEmailAndToken as jest.Mock).mockResolvedValue(
        invalidToken as never,
      );

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'tuyishimehope01@gmail.com', code: '123456' });

      expect(response.status).toBe(400);
    });

    it('should return 500 if an error occurs during processing', async () => {
      (UserService.findUserBy as jest.Mock).mockRejectedValue(
        new Error('Internal server error') as never,
      );

      const response = await request(app)
        .post(verifyCodeRoute)
        .set('Authorization', 'Bearer ${authToken}')
        .send({ email: 'error@example.com', code: '123456' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });
});

afterAll(async () => {
  server.close();
});