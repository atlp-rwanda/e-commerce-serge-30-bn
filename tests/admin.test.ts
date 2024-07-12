import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { server } from '../src/server';
import { disableUserAccount } from '../src/controllers/user.controller';
import { UserService } from '../src/service/user.service';
import { jest, describe, it, beforeAll,afterAll,expect } from '@jest/globals';

interface UserData {
  user_id: string;
  username: string;
  email: string;
  active: boolean;
  save: jest.Mock;
}

interface DisableUserFunction {
  (userId: string): Promise<UserData | string>;
}

const mockUser: UserData = {
  user_id: 'testuser123',
  username: 'testuser',
  email: 'test@example.com',
  active: true,
  save: jest.fn(),
};



jest.mock('../src/service/user.service');

const disableUserRoute = '/api/v1/admin/disable/:user_id';

const app = express();
app.use(bodyParser.json());
app.put(disableUserRoute, disableUserAccount);

let authToken: string;

beforeAll(async () => {
  server;
  authToken = 'mockAuthToken';
});

describe('POST /api/v1/admin/disable/:user_id', () => {
  it('should return 500 when met with server error while disabling user account', async () => {
    (UserService.disableUser as jest.MockedFunction<DisableUserFunction>)
      .mockResolvedValue(mockUser);

    const response = await request(app)
      .put('/api/v1/admin/disable/testuser123')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should return 200 with custom message if user is already disabled', async () => {
    (UserService.disableUser as jest.MockedFunction<DisableUserFunction>)
      .mockResolvedValue('User is already not active');

    const response = await request(app)
      .put('/api/v1/admin/disable/disableduser123')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User is already not active');
  });

  it('should return 200 to confirm a user doesn\'t exists', async () => {
    (UserService.disableUser as jest.MockedFunction<DisableUserFunction>)
      .mockResolvedValue('User does not exist');

    const response = await request(app)
      .put('/api/v1/admin/disable/nonexistentuser')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User does not exist');
  });

  it('should return 500 if an error occurs during processing', async () => {
    (UserService.disableUser as jest.MockedFunction<DisableUserFunction>)
      .mockRejectedValue(new Error('Internal server error'));

    const response = await request(app)
      .put('/api/v1/admin/disable/testuser123')
      .set('Authorization', `Bearer ${authToken}`)
      .send();
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
afterAll(async () => {
  server.close();
});