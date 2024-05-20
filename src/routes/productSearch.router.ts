import express from 'express';
import { ProductController } from '../controllers/productSearch.controller';
const searchRoutes = express.Router();

searchRoutes.post('/products/search', ProductController.searchProducts);

export default searchRoutes;