import { Request, Response } from 'express';
import { VendorService } from '../src/service/vendor.service';
import { vendorController } from '../src/controllers/vendor.controller';
import Vendor from '../src/models/vendor.model';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import { CustomRequest } from '../src/middleware/authentication/auth.middleware';

jest.mock('../src/models/vendor.model');

describe('Vendor Controller', () => {
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  describe('getAllVendors', () => {
    it('should retrieve all vendors successfully', async () => {
      const vendors: Partial<Vendor>[] = [
        {
          store_name: 'Test Store 1',
          store_description: 'This is a test store 1',
          user_id: 'testuser1',
        },
        {
          store_name: 'Test Store 2',
          store_description: 'This is a test store 2',
          user_id: 'testuser2',
        },
      ];

      const getAllVendorsMock = jest.spyOn(VendorService, 'getAllVendors');
      getAllVendorsMock.mockResolvedValueOnce(vendors as Vendor[]);

      await vendorController.getAllVendors(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vendors retrieved successfully',
        data: vendors,
      });
    });

    it('should return 404 when no vendors are found', async () => {
      const getAllVendorsMock = jest.spyOn(VendorService, 'getAllVendors');
      getAllVendorsMock.mockResolvedValueOnce([]);

      await vendorController.getAllVendors(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'No vendors found',
      });
    });
  });

  describe('getVendorById', () => {
    it('should retrieve a vendor by id successfully', async () => {
      const vendor: Partial<Vendor> = {
        store_name: 'Test Store',
        store_description: 'This is a test store',
        user_id: 'testuser',
      };

      const getVendorByIdMock = jest.spyOn(VendorService, 'getVendorById');
      getVendorByIdMock.mockResolvedValueOnce(vendor as Vendor);

      req.params = { vendor_id: 'testvendor' };
      await vendorController.getVendorById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vendor retrieved successfully',
        data: vendor,
      });
    });

    it('should return 400 when vendor_id is not provided', async () => {
      await vendorController.getVendorById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vendor ID is required',
      });
    });

    it('should return 404 when the vendor is not found', async () => {
      const getVendorByIdMock = jest.spyOn(VendorService, 'getVendorById');
      getVendorByIdMock.mockResolvedValueOnce(null as never);

      req.params = { vendor_id: 'testvendor' };
      await vendorController.getVendorById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vendor not found',
      });
    });
  });

  describe('updateVendor', () => {
    it('should update a vendor successfully', async () => {
      const vendor: Partial<Vendor> = {
        store_name: 'Test Store',
        store_description: 'This is a test store',
        user_id: 'testuser',
      };

      const updateVendorMock = jest.spyOn(VendorService, 'updateVendor');
      updateVendorMock.mockResolvedValueOnce(vendor as Vendor);

      req.params = { vendor_id: 'testvendor' };
      req.body = {
        store_name: 'Updated Store',
        store_description: 'This is an updated test store',
      };
      await vendorController.updateVendor(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vendor updated successfully',
        data: vendor,
      });
    });

    it('should return 400 when vendor_id is not provided', async () => {
      await vendorController.updateVendor(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vendor ID is required',
      });
    });

    it('should return 404 when the vendor is not found', async () => {
      const updateVendorMock = jest.spyOn(VendorService, 'updateVendor');
      updateVendorMock.mockResolvedValueOnce(null as never);

      req.params = { vendor_id: 'testvendor' };
      await vendorController.updateVendor(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vendor not found',
      });
    });
  });

  describe('deleteVendor', () => {
    it('should delete a vendor successfully', async () => {
      const deleteVendorMock = jest.spyOn(VendorService, 'deleteVendor');
      deleteVendorMock.mockResolvedValueOnce();

      req.params = { vendor_id: 'testvendor' };
      await vendorController.deleteVendor(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Vendor deleted successfully',
      });
    });

    it('should return 400 when vendor_id is not provided', async () => {
      await vendorController.deleteVendor(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vendor ID is required',
      });
    });

    it('should return 404 when the vendor is not found', async () => {
      const deleteVendorMock = jest.spyOn(VendorService, 'deleteVendor');
      deleteVendorMock.mockRejectedValueOnce(new Error('Vendor not found'));

      req.params = { vendor_id: 'testvendor' };
      await vendorController.deleteVendor(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vendor not found',
      });
    });
  });
});
