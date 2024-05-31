import request from 'supertest';
import { configureApp, server } from '../src/server';
import { describe, expect, it, afterAll, beforeEach } from '@jest/globals';
import dotenv from 'dotenv';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
dotenv.config();
const app = configureApp();
let token: string | undefined;
let socket: Socket;
beforeEach(async () => {
  const loginResponse = await request(app).post('/api/v1/auth/login').send({
    email: 'test@example.com',
    password: process.env.USER_PASSWORD_TESTS,
  });
  token = loginResponse.body.token;
  socket = io(`http://localhost:${process.env.PORT}`, {
    auth: {
      token: token,
    },
  });
});
describe('GET /chat', () => {
  it('should return the chat application', async () => {
    const response = await request(app).get('/chat');

    expect(response.status).toBe(200);

    expect(response.text).toContain('<title>Socket.IO chat</title>');
  });
});
describe('GET /api/v1/chats', () => {
  it('should require authentication', async () => {
    const response = await request(app).get('/api/v1/chats');
    expect(response.status).toBe(401);
  });

  it('should return all chats', async () => {
    const response = await request(app)
      .get('/api/v1/chats')

      .set('Cookie', `Authorization=${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('ok', true);
    expect(response.body).toHaveProperty('chat');
  });
});
describe('Socket.IO events', () => {
  it('should emit "welcome" event with user data', (done) => {
    socket.on('welcome', (userData) => {
      expect(userData).toHaveProperty('firstName');
      expect(userData).toHaveProperty('lastName');
      done();
    });
  });
  it('should emit "returnMessage" event when a message is sent', (done) => {
    socket.on('returnMessage', (messageData) => {
      expect(messageData).toHaveProperty('senderId');
      expect(messageData).toHaveProperty('socketId');
      expect(messageData).toHaveProperty('content');
      expect(messageData).toHaveProperty('senderName');
      expect(messageData).toHaveProperty('readStatus');
      expect(messageData).toHaveProperty('date');
      done();
    });
    socket.emit('sentMessage', {
      content: 'Test message',
      socketId: socket.id,
    });
  });
  it('should emit "typing" event when a user starts typing', (done) => {
    socket.on('typing', (typingData) => {
      expect(typingData).toHaveProperty('userId');
      expect(typingData).toHaveProperty('isTyping', true);
      done();
    });
    socket.emit('typing', true);
  });
});
afterAll(async () => {
  socket.disconnect();
  server.close();
});
