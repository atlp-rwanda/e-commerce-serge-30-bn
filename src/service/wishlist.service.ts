import Wishlist from '../models/wishlist.model';
import Product from '../models/products.Model';

class WishlistService {
  public static async addToWishlist(productId: string, userId: string) {
    const productExist = await Product.findByPk(productId);
    if (!productExist) {
      throw new Error('Product not found');
    }

    const wishlistExist = await Wishlist.findOne({
      where: { product_id: productId, user_id: userId },
    });
    if (wishlistExist) {
      throw new Error('Product already in wishlist');
    }

    const addedWishlist = await Wishlist.create({
      user_id: userId,
      product_id: productId,
    });
    return addedWishlist;
  }

  public static async getUserWishlist(userId: string) {
    const wishlist = await Wishlist.findAll({
      where: { user_id: userId },
      include: [Product],
    });
    return wishlist;
  }

  public static async deleteFromWishlist(wishlistId: string, userId: string) {
    const wishlist = await Wishlist.findOne({
      where: { id: wishlistId, user_id: userId },
    });
    if (!wishlist) {
      throw new Error('Wishlist not found');
    }

    await Wishlist.destroy({
      where: { id: wishlistId, user_id: userId },
    });
  }
}

export default WishlistService;
