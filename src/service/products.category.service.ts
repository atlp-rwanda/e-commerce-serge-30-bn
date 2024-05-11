import Category from '../models/products.Category.Model';
import Product from '../models/products.Model';

export class CategoryService {
  public static async createCategory(
    name: string,
    description: string,
  ): Promise<Category> {
    try {
      const category = await Category.create({ name, description });
      return category;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  public static async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await Category.findAll({ include: [Product] });
      return categories;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  public static async getCategoryById(category_id: string): Promise<Category> {
    try {
      const category = await Category.findByPk(category_id, {
        include: [Product],
      });
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  public static async getCategoryByName(name: string): Promise<Category> {
    try {
      const category = await Category.findOne({ where: { name } });
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  public static async updateCategory(
    category_id: string,
    name: string,
    description: string,
  ): Promise<Category> {
    try {
      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new Error('Category not found');
      }
      category.name = name;
      category.description = description;
      await category.save();
      return category;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }

  public static async deleteCategory(category_id: string): Promise<void> {
    try {
      const category = await Category.findByPk(category_id);
      if (!category) {
        throw new Error('Category not found');
      }
      await category.destroy();
    } catch (error) {
      throw new Error('Internal Server Error');
    }
  }
}
