import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';
import { getOrderStatus, updateOrderStatus } from '../src/controllers/order.controller';
import { OrderService } from '../src/service/order.service';
import User from '../src/models/user.model';
import { WebSocketService } from '../src/utils/orderStatusWebsocket';
import { Server } from 'http';
import { describe, expect, it, afterAll, jest } from '@jest/globals';

jest.mock('../src/service/order.service');

interface AuthenticatedRequest extends Request {
  user?: User;
  webSocketService?: WebSocketService;
  params: {
    orderId: string;
  };
  body: {
    status: string;
    expectedDeliveryDate: string;
  };
}

const app: Application = express();
app.use(express.json());

class MockWebSocketService extends WebSocketService {
  constructor(server: Server) {
    super(server);
    this.notifyOrderStatusChange = jest.fn();
  }
}

let mockWebSocketService: MockWebSocketService;
let server: Server;

const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers['userid']) {
    return res.status(400).json({ message: 'User not authenticated' });
  }
  (req as AuthenticatedRequest).user = {
    user_id: 'user123',
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'hashedpassword',
  } as User;
  (req as AuthenticatedRequest).webSocketService = mockWebSocketService;
  next();
};

app.get('/api/v1/orders/:orderId/status', mockAuthMiddleware, (req, res) => getOrderStatus(req as AuthenticatedRequest, res));
app.post('/api/v1/orders/:orderId/status', mockAuthMiddleware, (req, res) => updateOrderStatus(req as AuthenticatedRequest, res, mockWebSocketService));

describe('Order Status Controller', () => {
  beforeAll((done) => {
    server = app.listen(8002, () => {
      mockWebSocketService = new MockWebSocketService(server);
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('GET /api/v1/orders/:orderId/status', () => {
    it('should return order status (success)', async () => {
      const orderId = '1234';
      const mockOrderStatus: { status: string; expectedDeliveryDate: string; } = {
        status: 'shipped',
        expectedDeliveryDate: '2024-06-10T00:00:00.000Z'
      };

      (OrderService.getOrderStatus as jest.Mock).mockResolvedValueOnce(mockOrderStatus as never);

      const response = await request(app)
        .get(`/api/v1/orders/${orderId}/status`)
        .set('userid', 'user123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrderStatus);
      expect(OrderService.getOrderStatus).toHaveBeenCalledWith('user123', orderId);
    });

    it('should return 400 for unauthenticated requests', async () => {
      const orderId = '1234';

      const response = await request(app)
        .get(`/api/v1/orders/${orderId}/status`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User not authenticated' });
    });

    it('should return 500 for errors', async () => {
      const orderId = '1234';

      (OrderService.getOrderStatus as jest.Mock).mockRejectedValueOnce(new Error('Internal server error') as never);

      const response = await request(app)
        .get(`/api/v1/orders/${orderId}/status`)
        .set('userid', 'user123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('POST /api/v1/orders/:orderId/status', () => {
    it('should update order status and send notification (success)', async () => {
      const orderId = '1234';
      const status = 'delivered';
      const expectedDeliveryDate = '2024-06-15T00:00:00.000Z';
      const mockUpdatedOrder = { status, expectedDeliveryDate };
      const mockNotificationMessage = {
        message: 'Order status updated',
        orderId,
        status,
        expectedDeliveryDate: new Date(expectedDeliveryDate).toISOString(),  // Ensure the date is in ISO string format
      };

      (OrderService.updateOrderStatus as jest.Mock).mockResolvedValueOnce(mockUpdatedOrder as never);

      const response = await request(app)
        .post(`/api/v1/orders/${orderId}/status`)
        .send({ status, expectedDeliveryDate })
        .set('Content-Type', 'application/json')
        .set('userid', 'user123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Order status updated successfully',
        updatedOrder: mockUpdatedOrder,
        notificationMessage: mockNotificationMessage,
      });
      expect(OrderService.updateOrderStatus).toHaveBeenCalledWith(orderId, status, new Date(expectedDeliveryDate));
      expect(mockWebSocketService.notifyOrderStatusChange).toHaveBeenCalledWith(mockNotificationMessage);
    });

    it('should return 500 for errors', async () => {
      const orderId = '1234';
      const status = 'delivered';
      const expectedDeliveryDate = '2024-06-15T00:00:00.000Z';

      (OrderService.updateOrderStatus as jest.Mock).mockRejectedValueOnce(new Error('Internal server error') as never);

      const response = await request(app)
        .post(`/api/v1/orders/${orderId}/status`)
        .send({ status, expectedDeliveryDate })
        .set('Content-Type', 'application/json')
        .set('userid', 'user123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});
