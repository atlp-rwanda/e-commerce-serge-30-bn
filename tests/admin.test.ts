
import { Request, Response } from 'express';
import AdminService, { UsersData } from '../src/service/admin.service';
import { disableUserAccount } from '../src/controllers/user.controller';
import { jest, describe, beforeEach,afterAll, it, expect } from '@jest/globals';
import { CustomRequest } from '../src/middleware/authentication/auth.middleware';
import request from 'supertest';
import { server } from '../src/server';
jest.mock('../src/service/admin.service');
describe('disableUserAccount', () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    process.env.ADMIN_EMAIL = 'admin@example.com';
  });
   it("should return 404 status code if user is doesn 't exist", async () => {
     const res = await request(server).put('/api/v1/admin/disable/:user_id');
     expect(res.status).toBe(404);
   });
  it('should handle AdminService.disableUser returning a string', async () => {
    (
      AdminService.disableUser as jest.MockedFunction<
        typeof AdminService.disableUser
      >
    ).mockResolvedValue('User not found');

    req.params = { user_id: '12345' };

    await disableUserAccount(req as Request, res as Response);

    expect(AdminService.disableUser).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should return 500 if admin email is not defined', async () => {
    delete process.env.ADMIN_EMAIL;

    const mockUser: UsersData = {
      email: 'user@example.com',
      username: 'testuser',
      verified: true,
    };

    (
      AdminService.disableUser as jest.MockedFunction<
        typeof AdminService.disableUser
      >
    ).mockResolvedValue(mockUser);

    req.params = { user_id: '12345' };

    await disableUserAccount(req as Request, res as Response);

    expect(AdminService.disableUser).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });

  it('should handle errors gracefully', async () => {
    (
      AdminService.disableUser as jest.MockedFunction<
        typeof AdminService.disableUser
      >
    ).mockRejectedValue(new Error('Some error'));

    req.params = { user_id: '12345' };

    await disableUserAccount(req as Request, res as Response);

    expect(AdminService.disableUser).toHaveBeenCalledWith('12345');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

afterAll(() => {
  server.close();
});
