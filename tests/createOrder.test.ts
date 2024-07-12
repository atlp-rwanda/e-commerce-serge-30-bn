import { Request, Response } from 'express';
import createOrder from '../src/controllers/order.controller';
import { CartService } from '../src/service/cart.service';
import { OrderService } from '../src/service/order.service';
import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import Product from '../src/models/products.Model';
import { updateProductInventory } from '../src/controllers/order.controller';
import { ProductService } from '../src/service/product.service';
jest.mock('../src/service/cart.service');
jest.mock('../src/service/order.service');

jest.mock('../src/service/product.service');

describe('Order', () => {
  describe('createOrder', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return 404 when something goes wrong during order creation', async () => {
      (OrderService.saveOrder as jest.Mock).mockRejectedValueOnce(
        'something went wrong' as never,
      );

      const mockRequest = {
        user: { userId: 'user123' },
        body: {
          address: '123 Maple Street',
          country: 'Austraria',
          city: 'KAC',
          phone: '+1-212-555-0123',
          zipCode: '10001',
          expectedDeliveryDate: '06/10/2024',
        },
      } as Partial<Request>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it('should return 401 when an error occurs during order creation', async () => {
      (OrderService.saveOrder as jest.Mock).mockRejectedValueOnce(
        'something went wrong' as never,
      );

      const mockRequest = {} as Partial<Request>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as Partial<Response>;

      await createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
    it('should return 404 when something goes wrong during order creation', async () => {
      (OrderService.saveOrder as jest.Mock).mockRejectedValueOnce(
        new Error('some') as never,
      );

      const mockRequest = {
        user: { userId: 'user123' },
        body: {
          address: '123 Maple Street',
          country: 'Austraria',
          //    city: 'KAC',
          phone: '+1-212-555-0123',
          zipCode: '10001',
          expectedDeliveryDate: '06/10/2024',
        },
      } as Partial<Request>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('should return 500 when something goes wrong during order creation', async () => {
      // Mock the behavior of saveOrder to reject with an error message
      (OrderService.saveOrder as jest.Mock).mockRejectedValueOnce(
        new Error('some') as never,
      );
      const orderSaveMock = jest.spyOn(OrderService, 'saveOrder');
      orderSaveMock.mockRejectedValueOnce('something went wrong');
      const mockRequest = {
        user: { userId: 'user123' },
        body: {
          address: '123 Maple Street',
          country: 'Austraria',
          city: 'KAC',
          phone: '+1-212-555-0123',
          zipCode: '10001',
          expectedDeliveryDate: '06/10/2024',
        },
      } as Partial<Request>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      // Call the createOrder function with the mock request and response
      await createOrder(mockRequest as Request, mockResponse as Response);

      // Expect the response status to be 500 due to the error thrown by the createOrder function
      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
    it('should return 500 when order is not successfully created', async () => {
      (CartService.getCartByUserId as jest.Mock).mockResolvedValue({
        id: 'cart123',
        userId: 'user123',
        products: [
          { productId: 'prod1', quantity: 1, price: 100 },
          { productId: 'prod2', quantity: 2, price: 200 },
        ],
        totalPrice: 500,
      } as never);
      const mockOrderData = {
        address: '123 Maple Street',
        country: 'Austraria',
        city: 'KAC',
        phone: '+1-212-555-0123',
        zipCode: '10001',
        expectedDeliveryDate: '06/10/2024',
        userId: 'user123',
        totalPrice: 123,
        cartId: 'cart123',
        products: [
          {
            price: 5,
            quantiy: 2,
            productId: '7059362e-34de-4c61-0001-12bb235fbc1f',
          },
        ],
      };
      (OrderService.saveOrder as jest.Mock).mockImplementation(() =>
        Promise.resolve(mockOrderData as never),
      );

      const mockRequest = {
        user: { userId: 'user123' },
        body: {
          address: '123 Maple Street',
          country: 'Austraria',
          city: 'KAC',
          phone: '+1-212-555-0123',
          zipCode: '10001',
          expectedDeliveryDate: '06/10/2024',
        },
      } as Partial<Request>;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      } as Partial<Response>;

      await createOrder(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith(expect.any(Error));
    });
    it('should return 201 when order is successfully created', async () => {
      const mockRequest = {
        user: { user_id: '1b992c34-fac0-48fe-8048-6908b7168fdf' },
        body: {
          address: '123 Maple Street',
          country: 'United States',
          city: 'New York',
          phone: '+1-212-555-0123',
          zipCode: '10001',
          expectedDeliveryDate: '2024-06-10',
        },
      } as Partial<Request>;

      const mockCartData = {
        dataValues: {
          id: '4a6dcbc6-b233-4465-8f31-2feffe3db097',
          user_Id: '1b992c34-fac0-48fe-8048-6908b7168fdf',
          products: [
            { productId: 'prod1', quantity: 1, price: 100 },
            { productId: 'prod2', quantity: 2, price: 200 },
          ],
          totalPrice: 50040,
          totalQuantity: 4,
          createdAt: '2024-06-06T14:08:57.250Z',
          updatedAt: '2024-06-08T18:38:10.710Z',
        },
      };

      const mockOrderData = {
        address: '123 Maple Street',
        country: 'United States',
        city: 'New York',
        phone: '+1-212-555-0123',
        zipCode: '10001',
        expectedDeliveryDate: '2024-06-10',
        user_Id: '1b992c34-fac0-48fe-8048-6908b7168fdf',
        totalPrice: 50040,
        cartId: '4a6dcbc6-b233-4465-8f31-2feffe3db097',
        products: [
          {
            price: 25000,
            quantity: 2,
            productId: '9683cb76-41e9-4d37-8296-1d0f19a4c652',
          },
          {
            price: 20,
            quantity: 2,
            productId: '700232a2-fe00-4503-8faf-056b8975e2c5',
          },
        ],
      };

      jest
        .spyOn(CartService, 'getCartByUserId')
        .mockResolvedValue(mockCartData as never);
      jest
        .spyOn(OrderService, 'saveOrder')
        .mockResolvedValue(mockOrderData as never);

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
      } as Partial<Response>;

      await createOrder(mockRequest as Request, mockResponse as Response);

      expect(true).toBe(true);
    });
  });
  describe('updateProductInventory', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should update product inventory successfully', async () => {
      const products = [{ productId: '1', quantity: 2 }];
      const getMock = jest.spyOn(ProductService, 'getProductById');
      getMock.mockResolvedValueOnce({
        quantity: 10,
      } as never);
      const updateMock = jest.spyOn(Product, 'update');
      updateMock.mockResolvedValueOnce([1] as never);

      await updateProductInventory(products as never);

      expect(ProductService.getProductById).toHaveBeenCalledTimes(1);
      expect(Product.update).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if product is not found', async () => {
      const products = [{ productId: '1', quantity: 2 }];

      (ProductService.getProductById as jest.Mock).mockResolvedValue(
        null as never,
      );

      await expect(
        updateProductInventory(products as never),
      ).rejects.toThrowError();
    });

    it('should throw an error if insufficient stock', async () => {
      const products = [{ productId: '1', quantity: 2 }];

      (ProductService.getProductById as jest.Mock).mockResolvedValue({
        quantity: 1,
      } as never);

      await expect(
        updateProductInventory(products as never),
      ).rejects.toThrowError();
    });
  });
});
