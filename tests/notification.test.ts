import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll } from '@jest/globals';
import dotenv from 'dotenv';
import Notification from '../src/models/notifications.model';
dotenv.config();
const app = configureApp();


describe('Notification Controller', () => {
    describe('GET /notifications/all', () => {
      it('should respond with 401 if no cookie is provided', async () => {
        const response = await request(app).get('/notifications/all');
        expect(response.statusCode).toBe(401);
      });
  
      it('should respond with 400 if user ID is not found in the cookie', async () => {
        const response = await request(app).get('/notifications/all').set('Cookie', 'invalid_cookie');
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User ID is required');
      });
  
      it('should return all notifications for the user', async () => {
        const userId = '123';
        const notification1 = await Notification.create({ userId, message: 'Notification 1' });
        const notification2 = await Notification.create({ userId, message: 'Notification 2' });
        const response = await request(app).get('/notifications/all').set('Cookie', `user_id=${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('all notifications');
        expect(response.body.notifications).toHaveLength(2);
        expect(response.body.notifications).toContainEqual(notification1.dataValues);
        expect(response.body.notifications).toContainEqual(notification2.dataValues);
      });
    })
})
afterAll(() => {
    server.close();
  });
