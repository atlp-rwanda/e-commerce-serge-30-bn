import { Request, Response } from 'express';
import { CategoryService } from '../service/products.category.service';
import { CustomRequest } from 'middleware/authentication/auth.middleware';

export const productsCategoryController = {
  // Creating a new product's category
  async createCategory(req: CustomRequest, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await CategoryService.createCategory(name, description);
      return res.status(200).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error: unknown) {
      if (
        (error as Error).message === 'Category with this name already exists'
      ) {
        return res.status(409).json({
          success: false,
          message: (error as Error).message,
        });
      }
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Getting all product categories
  async getAllCategories( req:Request ,res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      if (!categories) {
        return res.status(404).json({ message: 'No categories found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Getting a single product category by ID
  async getCategoryById(req: CustomRequest, res: Response) {
    try {
      const { category_id } = req.params;
      if (!category_id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
      const category = await CategoryService.getCategoryById(category_id);
      return res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Updating a product category by ID
  async updateCategory(req: CustomRequest, res: Response) {
    try {
      const { category_id } = req.params;
      const { name, description } = req.body;
      const updatedCategory = await CategoryService.updateCategory(
        category_id,
        name,
        description,
      );
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Deleting a product category by ID
  async deleteCategory(req: CustomRequest, res: Response) {
    try {
      const { category_id } = req.params;
      if (!category_id) {
        return res.status(400).json({ message: 'Category ID is required' });
      }
      await CategoryService.deleteCategory(category_id);
      return res
        .status(200)
        .json({ success: true, message: 'Category deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
