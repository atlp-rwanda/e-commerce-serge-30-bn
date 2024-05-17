import { Request, Response } from 'express';
import { CategoryService } from '../src/service/products.category.service';
import { productsCategoryController } from '../src/controllers/products.category.controller';
import Category from '../src/models/products.Category.Model';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

jest.mock('../src/models/products.Category.Model');

describe('Product Category Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const name = 'Test Category';
      const description = 'This is a test category';
      const category: Partial<Category> = {
        name,
        description,
      };

      const createCategoryMock = jest.spyOn(CategoryService, 'createCategory');
      createCategoryMock.mockResolvedValueOnce(category as Category);

      req.body = { name, description };
      await productsCategoryController.createCategory(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    });

    it('should handle errors', async () => {
      const name = 'Test Category';
      const description = 'This is a test category';

      const createCategoryMock = jest.spyOn(CategoryService, 'createCategory');
      createCategoryMock.mockRejectedValueOnce(
        new Error('Internal Server Error'),
      );

      req.body = { name, description };
      await productsCategoryController.createCategory(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getAllCategories', () => {
    it('should get all categories', async () => {
      const categories: Partial<Category>[] = [
        { name: 'Test Category 1', description: 'This is a test category' },
        {
          name: 'Test Category 2',
          description: 'This is another test category',
        },
      ];

      const getAllCategoriesMock = jest.spyOn(
        CategoryService,
        'getAllCategories',
      );
      getAllCategoriesMock.mockResolvedValueOnce(categories as Category[]);

      await productsCategoryController.getAllCategories(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    });
  });

  describe('getCategoryById', () => {
    it('should get a category by ID', async () => {
      const category: Partial<Category> = {
        name: 'Test Category',
        description: 'This is a test category',
      };

      const getCategoryByIdMock = jest.spyOn(
        CategoryService,
        'getCategoryById',
      );
      getCategoryByIdMock.mockResolvedValueOnce(category as Category);

      req.params = { category_id: '1' };
      await productsCategoryController.getCategoryById(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      });
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const category: Partial<Category> = {
        name: 'Test Category',
        description: 'This is a test category',
      };

      const updateCategoryMock = jest.spyOn(CategoryService, 'updateCategory');
      updateCategoryMock.mockResolvedValueOnce(category as Category);

      req.params = { category_id: '1' };
      req.body = {
        name: 'Updated Category',
        description: 'This is an updated category',
      };
      await productsCategoryController.updateCategory(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const deleteCategoryMock = jest.spyOn(CategoryService, 'deleteCategory');
      deleteCategoryMock.mockResolvedValueOnce();

      req.params = { category_id: '1' };
      await productsCategoryController.deleteCategory(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category deleted successfully',
      });
    });
  });
});
