import Vendor from '../models/vendor.model';
import Product from '../models/products.Model';
import { User } from 'models';
import Category from '../models/products.Category.Model';

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
    try {
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
    } catch (error) {
      console.log(error);
      throw new Error('Internal Server Error');
    }
  }
  public static async getProductByNameAndVendorId(
    name: string,
    vendor_id: string,
  ): Promise<Product | null> {
    try {
      const product = await Product.findOne({ where: { name, vendor_id } });
      return product;
    } catch (error) {
      throw new Error('Internal Server Error');
    }
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
}
