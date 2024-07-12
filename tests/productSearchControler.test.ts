import request from 'supertest';
import { server } from '../src/server';
import { sequelize } from '../src/db/config';
import { describe, it, expect, beforeAll, afterAll} from '@jest/globals';


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
        expect.objectContaining({"available": false, "category_id": "8e144232-0810-4a35-a2c3-b5bfc5cb91be", "createdAt": "2024-06-06T17:41:42.690Z", "description": "This is the iphone phone to buy please", "discount": 0, "expired": true, "expiry_date": "2024-06-06T15:08:39.547Z", "finalRatings": 0, "image_url": ["https://www.youtube.com/watch?v=Z_G86SKXP3s", "https://www.youtube.com/watch?v=Z_G86SKXP3s", "https://www.youtube.com/watch?v=Z_G86SKXP3s", "https://www.youtube.com/watch?v=Z_G86SKXP3s"], "name": "iPhone 15", "price": 20, "product_id": "700232a2-fe00-4503-8faf-056b8975e2c5", "quantity": 8, "reviewsCount": 0, "updatedAt": "2024-06-08T18:45:15.093Z", "vendor_id": "05f3b702-3a35-4701-9633-d53642f51912"})
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
  });