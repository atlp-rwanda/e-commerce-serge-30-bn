import { ProductService } from '../src/service/product.service';
import Product from '../src/models/products.Model';
import Category from '../src/models/products.Category.Model';
import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express, { Application } from 'express';
import { Server } from 'http';
import { Op } from 'sequelize';

jest.mock('../src/models/products.Model');
jest.mock('../src/models/products.Category.Model');

let server: Server;

const createTestServer = (): Application => {
  const app = express();
  app.use(express.json());
  return app;
};

describe('ProductService', () => {
  beforeAll((done) => {
    const app = createTestServer();
    server = app.listen(8001, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('searchProducts', () => {
    it('should return products based on search criteria', async () => {
      const criteria = { name: 'Test', minPrice: 10, maxPrice: 100, category: 'Electronics' };
      const mockCategory = { category_id: 1 };
      const mockProducts = [{ name: 'Test Product', price: 50, category_id: 1 }];

      (Category.findOne as jest.Mock).mockResolvedValue(mockCategory as never);
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts as never);

      const result = await ProductService.searchProducts(criteria);

      expect(result).toEqual(mockProducts);
      expect(Category.findOne).toHaveBeenCalledWith({ where: { name: criteria.category }, attributes: ['category_id'] });
      expect(Product.findAll).toHaveBeenCalledWith({
        where: {
          name: { [Op.like]: `%${criteria.name}%` },
          price: { [Op.gte]: criteria.minPrice, [Op.lte]: criteria.maxPrice },
          category_id: mockCategory.category_id
        }
      });
    });

    it('should return an empty array if category not found', async () => {
      const criteria = { name: 'Test', minPrice: 10, maxPrice: 100, category: 'NonExistentCategory' };

      (Category.findOne as jest.Mock).mockResolvedValue(null as never);

      const result = await ProductService.searchProducts(criteria);

      expect(result).toEqual([]);
      expect(Category.findOne).toHaveBeenCalledWith({ where: { name: criteria.category }, attributes: ['category_id'] });
      expect(Product.findAll).not.toHaveBeenCalled();
    });
  });
});
