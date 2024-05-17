import express from 'express';
import { vendorController } from '../controllers/vendor.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { validateSchema, vendorSchema } from '../validations/vendor.validation';
import { isAuthorized } from '../middleware/user.authenticate';
import { UserRole } from '../models/user.model';

const vendorRoutes = express.Router();

vendorRoutes.post(
  '/vendors',
  isAuthenticated,
  isAuthorized(UserRole.VENDOR, UserRole.ADMIN),
  validateSchema(vendorSchema.vendor),
  vendorController.createVendor,
);
vendorRoutes.get(
  '/vendors/all',
  isAuthenticated,
  vendorController.getAllVendors,
);
vendorRoutes.get(
  '/vendors/:vendor_id',
  isAuthenticated,
  vendorController.getVendorById,
);
vendorRoutes.patch(
  '/vendors/:vendor_id',
  isAuthenticated,
  isAuthorized(UserRole.VENDOR, UserRole.ADMIN),
  validateSchema(vendorSchema.update),
  vendorController.updateVendor,
);
vendorRoutes.delete(
  '/vendors/:vendor_id',
  isAuthenticated,
  isAuthorized(UserRole.VENDOR, UserRole.ADMIN),
  vendorController.deleteVendor,
);

export default vendorRoutes;
