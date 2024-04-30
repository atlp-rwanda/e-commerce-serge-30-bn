import request from 'supertest';
import { configureApp } from '../src/server';
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import AuthService from '../src/service/auth.service';
import { UserRole } from '../src/models/user.model';

jest.mock('../src/service/role.service');

const app = configureApp(); 

describe('PATCH /api/v1/role/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return a 401 when user is not found', async () => {
    jest.spyOn(AuthService, 'querySingleUser').mockRejectedValue(new Error('User not found'));

    const response = await request(app)
      .patch(`/api/v1/role/:id`)
      .send({ });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
  it('should return a 500 status for server error', async () => {
   
    const response = await request(app)
      .patch(`/api/v1/role/:id`)
      .send({ });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });

  it('should return a 200 status and updated user data', async () => {
    jest.spyOn(AuthService, 'querySingleUser').mockResolvedValue({user_id : 1, role: UserRole.ADMIN});

    const response = await request(app)
      .patch(`/api/v1/role/1`)
      .send({ role: 'ADMIN' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', role: 'ADMIN' });
  });

  it('should return a 500 status and error message when the update fails', async () => {
    jest.spyOn(AuthService, 'querySingleUser').mockRejectedValue(new Error('Update failed'));

    const response = await request(app)
      .patch(`/api/v1/role/1`)
      .send({ role: 'ADMIN' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Update failed');
  });

});


