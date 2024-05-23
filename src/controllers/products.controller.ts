
import { Response } from 'express';
import { ProductService, deleteItemService } from '../service/product.service';
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
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  //update product with by id
  async updateProduct(req: CustomRequest, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(201).json({ message: 'Unauthorized access denied' });
      }

      const { productId } = req.params;
      const uuidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      if (!uuidRegex.test(productId)) {
        return res.status(400).json({ message: 'Invalid product id' });
      }

      const updatedProduct = await ProductService.updateProduct(
        user,
        productId,
        req.body,
      );

      return res.send({
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Getting a single product by ID
  async getProductById(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const { product_id } = req.params;
      let product = await ProductService.getProductById(product_id);
      const role = req.user.role;

      if (role === 'VENDOR') {
        const vendor = await VendorService.getVendorByAuthenticatedUserId(
          req.user.user_id,
        );
        if (!vendor) {
          return res.status(404).json({ message: 'Vendor not found' });
        }
        product = await ProductService.getProductByVendorId(
          product_id,
          vendor.vendor_id,
        );
      }
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${role === 'VENDOR' ? 'Product not found in your collection' : 'Product not found'}`,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Product retrieved successfully',
        data: product,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  async getAllProducts(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      let products = await ProductService.UsergetAllProducts();
      const role = req.user.role;

      if (req.user.role === 'VENDOR') {
        const vendor = await VendorService.getVendorByAuthenticatedUserId(
          req.user.user_id,
        );
        if (!vendor) {
          return res.status(404).json({ message: 'Vendor not found' });
        }
        products = await ProductService.getProductsByVendorId(vendor.vendor_id);
      }
      if (!products) {
        return res.status(404).json({
          success: false,
          message: `${role === 'VENDOR' ? 'Products not found in your collection' : 'Products not found'}`,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: products,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async changeStatus(req: CustomRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const { id } = req.params;
      const { status } = req.body;
      const message = await ProductService.modifyStatus(id, status, req.user);
      return res
        .status(200)
        .json({ message: 'Status updated successfully', status: message });
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
    }
  },

};

// delete product from a collection

export const deleteItem = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { id } = req.params;

    const message = await deleteItemService(id, req.user);

    return res.status(200).json({ message: message });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
