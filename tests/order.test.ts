import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { CartService } from '../src/service/cart.service';
import { OrderService } from '../src/service/order.service';
import Order from '../src/models/order.model';
import { sequelize } from '../src/models/order.model';
import Cart from '../src/models/cart.model';

jest.mock('../src/models/order.model');

  describe('OrderService', () => {
    describe('getOrderById', () => {
      it('should throw an error if the order is not found', async () => {
        jest.spyOn(Order, 'findOne').mockResolvedValueOnce(null);
        const result = await OrderService.getOrderById('1234');
        expect(result).toBeNull();
      });
      it('should throw an error if the order is not found', async () => {
        jest.spyOn(Order, 'findOne').mockRejectedValueOnce(null as never);
        await expect(OrderService.getOrderById('1234')).rejects.toThrow();
        jest.restoreAllMocks();
      });
      it('should save the order successfully', async () => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
        };

        jest
          .spyOn(sequelize, 'transaction')
          .mockResolvedValue(mockTransaction as never);

        const mockCart = {
          products: [
            { productId: 'prod1', quantity: 1, price: 100 },
            { productId: 'prod2', quantity: 2, price: 200 },
          ],
        };
        jest
          .spyOn(CartService, 'getCartByUserId')
          .mockResolvedValue(mockCart as never);

        const mockCartItems = [
          { products: [{ productId: 'prod1' }], save: jest.fn() },
          { products: [{ productId: 'prod2' }], save: jest.fn() },
        ];
        jest.spyOn(Cart, 'findAll').mockResolvedValue(mockCartItems as never);

        const mockOrder = { id: 'order1' };
        jest.spyOn(Order, 'create').mockResolvedValue(mockOrder);

        const orderData = {
          userId: 'user1',
          address: '123 Street',
          country: 'Country',
          city: 'City',
          phone: '+123456789',
          zipCode: '12345',
          expectedDeliveryDate: '2024-06-10',
        };

        const result = await OrderService.saveOrder(orderData);

        expect(result).toEqual(mockOrder);
        expect(mockTransaction.commit).toHaveBeenCalled();
      });

      it('should throw an error if cart is not found', async () => {
        jest.spyOn(CartService, 'getCartByUserId').mockResolvedValue(null);

        const orderData = {
          userId: 'user1',
          address: '123 Street',
          country: 'Country',
          city: 'City',
          phone: '+123456789',
          zipCode: '12345',
          expectedDeliveryDate: '2024-06-10',
        };

        await expect(OrderService.saveOrder(orderData)).rejects.toThrow();
      });

      it('should throw an error if cart products are not an array', async () => {
        const mockCart = { products: null };
        jest
          .spyOn(CartService, 'getCartByUserId')
          .mockResolvedValue(mockCart as never);

        const orderData = {
          userId: 'user1',
          address: '123 Street',
          country: 'Country',
          city: 'City',
          phone: '+123456789',
          zipCode: '12345',
          expectedDeliveryDate: '2024-06-10',
        };

        await expect(OrderService.saveOrder(orderData)).rejects.toThrow();
      });

      it('should throw an error if ordered product is not found in the cart', async () => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
        };

        jest
          .spyOn(sequelize, 'transaction')
          .mockResolvedValue(mockTransaction as never);

        const mockCart = {
          products: [{ productId: 'prod1', quantity: 1, price: 100 }],
        };
        jest
          .spyOn(CartService, 'getCartByUserId')
          .mockResolvedValue(mockCart as never);

        const mockCartItems = [
          { products: [{ productId: 'prod2' }], save: jest.fn() },
        ];
        jest.spyOn(Cart, 'findAll').mockResolvedValue(mockCartItems as never);

        const orderData = {
          userId: 'user1',
          address: '123 Street',
          country: 'Country',
          city: 'City',
          phone: '+123456789',
          zipCode: '12345',
          expectedDeliveryDate: '2024-06-10',
        };

        await expect(OrderService.saveOrder(orderData)).rejects.toThrow(
          'Ordered product not found in the cart.',
        );
      });

      it('should rollback transaction if there is an error', async () => {
        const mockTransaction = {
          commit: jest.fn(),
          rollback: jest.fn(),
        };

        jest
          .spyOn(sequelize, 'transaction')
          .mockResolvedValue(mockTransaction as never);

        const mockCart = {
          products: [{ productId: 'prod1', quantity: 1, price: 100 }],
        };
        jest
          .spyOn(CartService, 'getCartByUserId')
          .mockResolvedValue(mockCart as never);

        jest.spyOn(Cart, 'findAll').mockRejectedValue(new Error('DB error'));

        const orderData = {
          userId: 'user1',
          address: '123 Street',
          country: 'Country',
          city: 'City',
          phone: '+123456789',
          zipCode: '12345',
          expectedDeliveryDate: '2024-06-10',
        };

        await expect(OrderService.saveOrder(orderData)).rejects.toThrow(
          'Failed to save order. DB error',
        );
        expect(mockTransaction.rollback).toHaveBeenCalled();
      });
    });
  });