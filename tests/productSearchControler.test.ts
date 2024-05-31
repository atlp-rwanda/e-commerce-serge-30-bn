import request from 'supertest';
import { server } from '../src/server';
import { sequelize } from '../src/db/config';
import { describe, it, expect, beforeAll, afterAll, jest} from '@jest/globals';
import { ProductService } from '../src/service/product.service';


describe('ProductController', () => {
    beforeAll(async () => {
      await sequelize.sync(); 
    });
  
    afterAll(async () => {
      await sequelize.close(); 
      server.close()
    });
  
    it('should search products by name', async () => {
      const response = await request(server)
        .post('/api/v1/products/search')
        .send({ name: 'iPhone' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'iPhone' })]));
    });
  
    it('should search products by price range', async () => {
      const response = await request(server)
        .post('/api/v1/products/search')
        .send({ minPrice: '0', maxPrice: '1000' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ price: expect.any(Number) })]));
    });
  
    it('should search products by category', async () => {
      const response = await request(server)
        .post('/api/v1/products/search')
        .send({ category: 'string' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ category_id: expect.any(String) })]));
    });
  
    it('should search products by multiple criteria', async () => {
      const response = await request(server)
        .post('/api/v1/products/search')
        .send({ name: 'iPhone', minPrice: '0', maxPrice: '100', category: 'string' });
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'iPhone',
          price: expect.any(Number),
          category_id: expect.any(String),
        })
      ]));
    });

    it('should return 404 when no products are found', async () => {
      const response = await request(server)
        .post('/api/v1/products/search')
        .send({ name: 'NonExistentProduct', minPrice: '0', maxPrice: '100', category: 'string' });
    
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'No products found'
      });
    });
  
    it('should handle errors and return 500 status', async () => {
        
        jest.spyOn(ProductService, 'searchProducts').mockImplementation(() => {
          throw new Error('Database error');
        });
    
        const response = await request(server)
          .get('/api/products')
          .query({ invalidField: 'invalidValue' });
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Internal server error' });
      });

      

  });