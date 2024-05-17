import Vendor from '../models/vendor.model';
import Product from '../models/products.Model';
export class VendorService {
  public static async createVendor(
    store_name: string,
    store_description: string,
    user_id: string,
  ): Promise<Vendor> {
    const existingVendor = await Vendor.findOne({ where: { user_id } });
    if (existingVendor) {
      throw new Error('Vendor already exists');
    }
    const vendor = await Vendor.create({
      store_name,
      store_description,
      user_id,
    });
    return vendor;
  }

  public static async getAllVendors(): Promise<Vendor[]> {
    const vendors = await Vendor.findAll({ include: [Product] });
    return vendors;
  }

  public static async getVendorById(vendor_id: string): Promise<Vendor> {
    const vendor = await Vendor.findOne({
      where: { vendor_id },
      include: [Product],
    });
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    return vendor;
  }

  public static async getVendorByAuthenticatedUserId(
    user_id: string,
  ): Promise<Vendor> {
    const vendor = await Vendor.findOne({ where: { user_id } });
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    return vendor;
  }

  public static async updateVendor(
    vendor_id: string,
    store_name: string,
    store_description: string,
  ): Promise<Vendor> {
    const vendor = await Vendor.findOne({ where: { vendor_id } });
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    vendor.store_name = store_name;
    vendor.store_description = store_description;
    await vendor.save();
    return vendor;
  }

  public static async deleteVendor(vendor_id: string): Promise<void> {
    const vendor = await Vendor.findOne({ where: { vendor_id } });
    if (!vendor) {
      throw new Error('Vendor not found');
    }
    await Vendor.destroy({ where: { vendor_id } });
  }
}
