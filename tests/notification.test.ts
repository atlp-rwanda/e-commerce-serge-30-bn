import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
dotenv.config();
const app = configureApp();


let token: string | undefined;

beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'mahirweyanjye@gmail.com',
    password: process.env.USER_PASSWORD_TEST,
  });
  console.log(token);
  token = loginResponse.body.token;
});

describe('Notification Controller', () => {

    describe('GET /notifications/all', () => {
      it('should respond with 401 if no cookie is provided', async () => {
        const response = await request(app).get('/api/v1/notifications/all');
        expect(response.statusCode).toBe(401);
      });
  
      it('should return all notifications for the user', async () => {
        const res = await request(app)
          .get('/api/v1/notifications/all')
          .set('Cookie', `Authorization=${token}`);
    
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('all notifications');
      });
  
    })
})
afterAll(() => {
    server.close();
  });