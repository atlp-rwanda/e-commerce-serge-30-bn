import { Response } from 'express';
import { VendorService } from '../service/vendor.service';
import { UserService } from '../service/user.service';
import { CustomRequest } from '../middleware/authentication/auth.middleware';

export const vendorController = {
  async createVendor(req: CustomRequest, res: Response) {
    try {
      const { store_name, store_description } = req.body;
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }
      const { user_id } = req.user;
      const user = await UserService.getUserById(user_id);
      if (!user || !user.verified || user.role.toString() !== 'VENDOR') {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid user' });
      }
      const vendor = await VendorService.createVendor(
        store_name,
        store_description,
        user_id.toString(),
      );
      return res.status(201).json({
        success: true,
        message: 'Vendor created successfully',
        data: vendor,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  },

  async getAllVendors(req: CustomRequest, res: Response) {
    try {
      const vendors = await VendorService.getAllVendors();
      return res.status(200).json({
        success: true,
        message: 'Vendors retrieved successfully',
        data: vendors,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  },

  async getVendorById(req: CustomRequest, res: Response) {
    try {
      const { vendor_id } = req.params;
      const vendor = await VendorService.getVendorById(vendor_id);
      if (!vendor) {
        return res
          .status(404)
          .json({ success: false, message: 'Vendor not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Vendor retrieved successfully',
        data: vendor,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  },

  async updateVendor(req: CustomRequest, res: Response) {
    try {
      const { vendor_id } = req.params;
      const { store_name, store_description } = req.body;
      const vendor = await VendorService.updateVendor(
        vendor_id,
        store_name,
        store_description,
      );
      if (!vendor) {
        return res
          .status(404)
          .json({ success: false, message: 'Vendor not found' });
      }
      return res.status(200).json({
        success: true,
        message: 'Vendor updated successfully',
        data: vendor,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  },

  async deleteVendor(req: CustomRequest, res: Response) {
    try {
      const { vendor_id } = req.params;
      await VendorService.deleteVendor(vendor_id);
      return res
        .status(204)
        .json({ success: true, message: 'Vendor deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  },
};
