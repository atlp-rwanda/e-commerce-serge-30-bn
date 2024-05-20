import { Response } from 'express';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/product.service';

const addItemToCart = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { productid, quantity } = req.body;
    const { user_id } = userId;

    const productDetails = await ProductService.getProductById(productid);
    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    if (productDetails.quantity < quantity) {
      return res
        .status(400)
        .json({ message: 'Insufficient quantity available.' });
    }

    let cart = await CartService.getCartByUserId(user_id);
    if (!cart) {
      const cartData = {
        userId: user_id,
        products: [
          { productId: productid, quantity, price: productDetails.price },
        ],
        totalPrice: productDetails.price * quantity,
        totalQuantity: quantity,
      };
      cart = await CartService.saveToCart(cartData);
    } else {
      cart = await CartService.addToCart(cart, {
        productId: productid,
        quantity,
        price: productDetails.price,
      });
    }

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default addItemToCart;
