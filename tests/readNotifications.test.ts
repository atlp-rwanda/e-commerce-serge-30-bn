import request from 'supertest';
import { configureApp, server } from '../src/server';
import { sequelize } from '../src/db/config';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();

let token: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'twizald.02@gmail.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  console.log(token);
  token = loginResponse.body.token;
});

describe('NotificationController', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
  });

  it('should get all notifications for a user', async () => {
    const response = await request(app)
      .get('/api/v1/notifications/all')
      .set('Cookie', `Authorization=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'all notifications',
      notifications: expect.arrayContaining([
        expect.objectContaining({ userId: expect.any(String) }),
      ]),
    });
  });

  it('should mark an unread notification as read', async () => {
    const notificationId = '16c97af5-0fb8-46b5-a126-99e93359faf2';
    const response = await request(app)
      .patch(`/api/v1/notifications/${notificationId}/read`)
      .set('Cookie', `Authorization=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Notification marked as read' });
  });

  it('should not mark an already read notification as read', async () => {
    const notificationId = '16c97af5-0fb8-46b5-a126-99e93359faf2';
    const response = await request(app)
      .patch(`/api/v1/notifications/${notificationId}/read`)
      .set('Cookie', `Authorization=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Notification is already read' });
  });

  it('should mark all notifications as read', async () => {
    const response = await request(app)
      .patch('/api/v1/notifications/all/read')
      .set('Cookie', `Authorization=${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'All notifications are already read',
    });
  });
});
