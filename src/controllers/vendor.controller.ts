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
      if (!user || !user.verified) {
        return res.status(400).json({
          success: false,
          message: 'You do not have full permissions to become a vendor',
        });
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
      if (
        (error as Error).message === 'Vendor with this user_id already exists'
      ) {
        return res.status(409).json({
          success: false,
          message:
            "This account is already associated with an existing vendor account. You can't create multiple vendor accounts with the same account.",
        });
      }
      if (error instanceof Error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getAllVendors(req: CustomRequest, res: Response) {
    try {
      const vendors = await VendorService.getAllVendors();
      if (!vendors || vendors.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'No vendors found' });
      }
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getVendorById(req: CustomRequest, res: Response) {
    try {
      const { vendor_id } = req.params;
      if (!vendor_id) {
        return res
          .status(400)
          .json({ success: false, message: 'Vendor ID is required' });
      }
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
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
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
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async deleteVendor(req: CustomRequest, res: Response) {
    try {
      const { vendor_id } = req.params;
      await VendorService.deleteVendor(vendor_id);
      return res
        .status(200)
        .json({ success: true, message: 'Vendor deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
