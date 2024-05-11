import Vendor from '../models/vendor.model';
import Product from '../models/products.Model';

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
}
