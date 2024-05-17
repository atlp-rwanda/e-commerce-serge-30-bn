import Category from '../models/products.Category.Model';
import Product from '../models/products.Model';

export class CategoryService {
  public static async createCategory(
    name: string,
    description: string,
  ): Promise<Category> {
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }
    const category = await Category.create({ name, description });
    return category;
  }

  public static async getAllCategories(): Promise<Category[]> {
    const categories = await Category.findAll({ include: [Product] });
    if (!categories) {
      throw new Error('No Category was Found');
    }
    return categories;
  }

  public static async getCategoryById(category_id: string): Promise<Category> {
    const category = await Category.findOne({
      where: { category_id },
      include: [Product],
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public static async getCategoryByName(name: string): Promise<Category> {
    const category = await Category.findOne({ where: { name } });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  public static async updateCategory(
    category_id: string,
    name: string,
    description: string,
  ): Promise<Category> {
    const category = await Category.findByPk(category_id);
    if (!category) {
      throw new Error('Category not found');
    }
    category.name = name;
    category.description = description;
    await category.save();
    return category;
  }

  public static async deleteCategory(category_id: string): Promise<void> {
    const category = await Category.findOne({ where: { category_id } });
    if (!category) {
      throw new Error('Category not found');
    }
    await Category.destroy({ where: { category_id } });
  }
}
