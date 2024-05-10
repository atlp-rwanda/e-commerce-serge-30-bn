import { Response } from 'express';
import { ProductService } from '../service/product.service';
import { CustomRequest } from '../middleware/authentication/auth.middleware';
import { VendorService } from '../service/vendor.service';
import { CategoryService } from '../service/products.category.service';

export const productsController = {
  async createProduct(req: CustomRequest, res: Response) {
    try {
      const {
        name,
        description,
        price,
        category_name,
        expiry_date,
        image_url,
        quantity,
        discount,
      } = req.body;
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const user_id = req.user.user_id;
      const vendor =
        await VendorService.getVendorByAuthenticatedUserId(user_id);
      if (!vendor) {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid vendor' });
      }

      const existingProduct = await ProductService.getProductByNameAndVendorId(
        name,
        vendor.vendor_id,
      );
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message:
            'Product already exists in your stock please!. Consider updating your stock levels.',
          data: existingProduct,
        });
      }

      const category = await CategoryService.getCategoryByName(category_name);
      if (!category) {
        throw new Error('Category not found');
      }

      const product = await ProductService.createProduct(
        name,
        description,
        price,
        category.category_id,
        expiry_date,
        vendor.vendor_id,
        image_url,
        quantity,
        discount,
      );
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  },
};
