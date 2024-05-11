import express from 'express';
import { vendorController } from '../controllers/vendor.controller';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import { validateSchema, vendorSchema } from '../validations/vendor.validation';

const vendorRoutes = express.Router();

vendorRoutes.post(
  '/vendors',
  validateSchema(vendorSchema.vendor),
  isAuthenticated,
  vendorController.createVendor,
);
vendorRoutes.get('/vendors', vendorController.getAllVendors);
vendorRoutes.get('/vendors/:vendor_id', vendorController.getVendorById);
vendorRoutes.patch(
  '/vendors/:vendor_id',
  isAuthenticated,
  vendorController.updateVendor,
);
vendorRoutes.delete(
  '/vendors/:vendor_id',
  isAuthenticated,
  vendorController.deleteVendor,
);

export default vendorRoutes;
