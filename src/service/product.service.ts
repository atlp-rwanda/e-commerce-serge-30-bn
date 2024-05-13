import Vendor from '../models/vendor.model';
import Product from '../models/products.Model';
import { User } from 'models';
import Category from '../models/products.Category.Model';
import { Op, WhereOptions } from 'sequelize';


interface SearchParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export class ProductService {
  public static async createProduct(
    name: string,
    description: string,
    price: number,
    category_id: string,
    expiry_date: Date,
    vendor_id: string,
    image_url: string[],
    quantity: number,
    discount: number,
  ): Promise<Product> {
    const vendor = await Vendor.findOne({ where: { vendor_id } });
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const product = await Product.create({
      name,
      description,
      price,
      category_id,
      expiry_date,
      vendor_id,
      image_url,
      quantity,
      discount,
    });
    return product;
  }
  public static async getProductByNameAndVendorId(
    name: string,
    vendor_id: string,
  ): Promise<Product | null> {
    const product = await Product.findOne({ where: { name, vendor_id } });
    return product;
  }
  public static async updateProduct(
    user: User,
    productId: string,
    updateData: Partial<User>,
  ) {
    const getVendor = await Vendor.findOne({
      where: { user_id: user.user_id },
    });
    if (!getVendor) {
      throw new Error('Vendor not found');
    }

    const getProduct = await Product.findOne({
      where: { product_id: productId, vendor_id: getVendor.vendor_id },
    });
    if (!getProduct) {
      throw new Error('This product is not found in your collection');
    }

    const updatedItem = await Product.update(updateData, {
      where: { product_id: productId },
      returning: true,
    });

    return updatedItem;
  }
  public static async getProductById(
    product_id: string,
  ): Promise<Product | null> {
 
      const product = await Product.findByPk(product_id,{include: [Vendor,Category]});
      return product;
  }
  public static async getProductByVendorId(
    product_id: string,vendor_id:string
  ): Promise<Product | null> {

      const product = await Product.findOne({where:{product_id:product_id,vendor_id:vendor_id},include: [Vendor,Category]});
      return product;
  }

  

  static async searchProducts(criteria: SearchParams): Promise<Product[]>  {
    const where: WhereOptions = {};

    if (criteria.name) {
      where.name = { [Op.like]: `%${criteria.name}%` };
    }

    if (criteria.minPrice !== undefined) {
      where.price = { ...where.price, [Op.gte]: criteria.minPrice };
   }

    if (criteria.maxPrice !== undefined) {
      where.price = { ...where.price, [Op.lte]: criteria.maxPrice };
    }

    if (criteria.category) {
      const category = await Category.findOne({
        where: { name: criteria.category },
        attributes: ['category_id'],
      });

      if (category) {
        where.category_id = category.category_id;
      } else {
        return [];
      }
    }

    try {
        const products = await Product.findAll({ where, });
        return products;
    } catch (error) {
      console.error('Error in ProductService.searchProducts:', error);
      const errorMessage = (error as Error).message;
      throw new Error(`Failed to search products: ${errorMessage}`);
    }
}

}
