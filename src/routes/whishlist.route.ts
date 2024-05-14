import { Router } from 'express';
import { isAuthenticated } from '../middleware/authentication/auth.middleware';
import {
  addToWishlist,
  deleteFromWishlist,
  getUserWishlist,
} from '../controllers/wishlist.controller';
const wishListRoute = Router();
wishListRoute.get('/wishlist/:productId', isAuthenticated, addToWishlist);
// get wishilist for the user
wishListRoute.get('/wishlist', isAuthenticated, getUserWishlist);
//delete wishlist by id
wishListRoute.delete(
  '/wishlist/:wishlistId',
  isAuthenticated,
  deleteFromWishlist,
);

export default wishListRoute;
