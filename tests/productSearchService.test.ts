import { ProductService } from '../src/service/product.service'; 
import { sequelize } from '../src/db/config'; 
import { describe, it, expect, beforeAll, afterAll,jest } from '@jest/globals';

describe('ProductService', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should return products based on name', async () => {
    const products = await ProductService.searchProducts({ name: 'iPhone' });
    expect(products).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'iPhone' })]));
  });

  it('should return products based on price range', async () => {
    const products = await ProductService.searchProducts({ minPrice: 500, maxPrice: 100 }); 
    expect(products).toEqual(expect.arrayContaining([expect.objectContaining({ price: expect.any(Number) })]));
  });

  it('should return products based on category', async () => {
    const products = await ProductService.searchProducts({ category: 'string' });
    expect(products).toEqual(expect.arrayContaining([expect.objectContaining({ category_id: expect.any(String) })]));
  });

  it('should return an empty array if category is not found', async () => {
    const products = await ProductService.searchProducts({ category: 'nonexistent' });
    expect(products).toEqual([]);
  });

  it('should handle combined search criteria', async () => {
    const products = await ProductService.searchProducts({
      name: 'iPhone',
      minPrice: 0, 
      maxPrice: 100, 
      category: 'string',
    });
    expect(products).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'iPhone',
        price: expect.any(Number),
        category_id: expect.any(String)
      })
    ]));
  });

  it('should throw an error if Product.findAll fails', async () => {
    jest.spyOn(ProductService, 'searchProducts').mockImplementation(() => {
      throw new Error('Database error');
    });

    await expect(ProductService.searchProducts({ name: 'iPhone' }))
      .rejects
      .toThrow('Database error');

    jest.restoreAllMocks(); 
  });

  
 


});
