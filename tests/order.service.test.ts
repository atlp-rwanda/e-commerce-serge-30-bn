import OrderStatusService from '../src/service/order.service';
import Order from '../src/models/order.model';

jest.mock('../src/models/order.model');

describe('OrderStatusService', () => {
  describe('getOrderStatus', () => {
    it('should return order status and expected delivery date', async () => {
      const mockOrder = {
        id: '1234',
        userId: 'user123',
        status: 'shipped',
        expectedDeliveryDate: new Date('2024-06-10'),
      };

      (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);

      const result = await OrderStatusService.getOrderStatus('user123', '1234');
      
      expect(result).toEqual({
        status: 'shipped',
        expectedDeliveryDate: new Date('2024-06-10'),
      });

      expect(Order.findOne).toHaveBeenCalledWith({ where: { id: '1234', userId: 'user123' } });
    });

    it('should throw an error if the order is not found', async () => {
      (Order.findOne as jest.Mock).mockResolvedValue(null);

      await expect(OrderStatusService.getOrderStatus('user123', '1234'))
        .rejects
        .toThrow('Order not found');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update the order status and expected delivery date', async () => {
      const mockOrder = {
        id: '1234',
        status: 'processing',
        expectedDeliveryDate: new Date('2024-06-01'),
        save: jest.fn().mockResolvedValue(true),
      };

      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      const result = await OrderStatusService.updateOrderStatus('1234', 'shipped', new Date('2024-06-15'));
      
      expect(result).toEqual({
        status: 'shipped',
        expectedDeliveryDate: new Date('2024-06-15'),
      });

      expect(mockOrder.status).toBe('shipped');
      expect(mockOrder.expectedDeliveryDate).toEqual(new Date('2024-06-15'));
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should throw an error if the order is not found', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(OrderStatusService.updateOrderStatus('1234', 'shipped', new Date('2024-06-15')))
        .rejects
        .toThrow('Order not found');
    });
  });
});
