import { OrderService } from '../src/service/order.service'; 
import Order from '../src/models/order.model'; 
import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express, { Application } from 'express';
import { Server } from 'http';

jest.mock('../src/models/order.model');

let server: Server;

const createTestServer = (): Application => {
  const app = express();
  app.use(express.json());
  return app;
};

describe('OrderService', () => {
  beforeAll((done) => {
    const app = createTestServer();
    server = app.listen(8000, done); 
  });

  afterAll((done) => {
    server.close(done); 
  });

  describe('getOrderStatus', () => {
    it('should return order status and expected delivery date', async () => {
      const userId = 'user123';
      const orderId = 'order123';
      const mockOrder = { status: 'shipped', expectedDeliveryDate: new Date('2024-06-10') };

      (Order.findOne as jest.Mock).mockResolvedValue(mockOrder as never);

      const result = await OrderService.getOrderStatus(userId, orderId);
      
      expect(result).toEqual(mockOrder);
      expect(Order.findOne).toHaveBeenCalledWith({ where: { id: orderId, userId } });
    });

    it('should throw an error if the order is not found', async () => {
      const userId = 'user123';
      const orderId = 'order123';

      (Order.findOne as jest.Mock).mockResolvedValue(null as never);

      await expect(OrderService.getOrderStatus(userId, orderId))
        .rejects
        .toThrow('Order not found');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the order status and expected delivery date', async () => {
      const orderId = 'order123';
      const status = 'delivered';
      const expectedDeliveryDate = new Date('2024-06-15');
      const mockUpdatedOrder = { status, expectedDeliveryDate };

      const mockOrder = { 
        status: 'processing', 
        expectedDeliveryDate: new Date('2024-06-01'), 
        save: jest.fn().mockResolvedValue(true as never) 
      };

      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder as never);

      const result = await OrderService.updateOrderStatus(orderId, status, expectedDeliveryDate);
      
      expect(result).toEqual(mockUpdatedOrder);
      expect(mockOrder.status).toBe(status);
      expect(mockOrder.expectedDeliveryDate).toEqual(expectedDeliveryDate);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should throw an error if the order is not found', async () => {
      const orderId = 'order123';
      const status = 'delivered';
      const expectedDeliveryDate = new Date('2024-06-15');

      (Order.findByPk as jest.Mock).mockResolvedValue(null as never);

      await expect(OrderService.updateOrderStatus(orderId, status, expectedDeliveryDate))
        .rejects
        .toThrow('Order not found');
    });
  });
});
