import { Request, Response } from 'express';
import { CategoryService } from '../service/products.category.service';

export const productsCategoryController = {
  // Creating a new product's category
  async createCategory(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const category = await CategoryService.createCategory(name, description);
      return res.status(200).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  // Getting all product categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAllCategories();
      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  // Getting a single product category by ID
  async getCategoryById(req: Request, res: Response) {
    try {
      const { category_id } = req.params;
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
    }
  },

  // Updating a product category by ID
  async updateCategory(req: Request, res: Response) {
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
    }
  },

  // Deleting a product category by ID
  async deleteCategory(req: Request, res: Response) {
    try {
      const { category_id } = req.params;
      await CategoryService.deleteCategory(category_id);
      return res
        .status(204)
        .json({ success: true, message: 'Category deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },
};
