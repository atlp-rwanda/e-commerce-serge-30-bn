import WishlistService from '../service/wishlist.service';
import { Response } from 'express';
import NotificationEvents from '../service/event.service';

async function addToWishlist(req: CustomRequest, res: Response) {
  try {
    const { productId } = req.params;
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const addedWishlist = await WishlistService.addToWishlist(
      productId,
      userId.user_id,
    );
    NotificationEvents.emit("productWished",productId, userId.username)
    res
      .status(201)
      .json({ message: 'Product added to wishlist', product: addedWishlist });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }

    console.error(error); // Log unexpected errors for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getUserWishlist(req: CustomRequest, res: Response) {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const wishlist = await WishlistService.getUserWishlist(userId.user_id);
    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ message: 'No product in wishlist' });
    }
    return res.status(200).json({ wishlist });
  } catch (error) {
    console.error(error); // Log unexpected errors for debugging
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteFromWishlist(req: CustomRequest, res: Response) {
  try {
    const { wishlistId } = req.params;
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    await WishlistService.deleteFromWishlist(wishlistId, userId.user_id);
    return res.status(200).json({ message: 'Wishlist deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
  }
}

export { addToWishlist, getUserWishlist, deleteFromWishlist };
