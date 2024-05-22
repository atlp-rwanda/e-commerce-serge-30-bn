/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UUID } from 'crypto';
import Cart from '../models/cart.model';
interface productProp {
  price: number;
  quantity: number;
  productId: UUID;
}
interface cartDataProp {
  userId: string;
  products: CartProduct[];
  totalPrice: number;
  totalQuantity: number;
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface CartProduct {
  productId: string;
  quantity: number;
  price: number;
}

export class CartService {
  public static async saveToCart(cartData: any): Promise<Cart> {
    try {
      const cart = await Cart.create(cartData);
      return cart;
    } catch (error) {
      throw new Error('Failed to save data to cart.');
    }
  }
  public static async getCartByUserId(data: string): Promise<Cart | null> {
    try {
      const cart = await Cart.findOne({ where: { userId: data } });
      return cart;
    } catch (error: any) {
      throw new Error('Failed to save data to cart' + error.message);
    }
  }

  public static async addToCart(cart: any, newItem: any) {
    const existingProductIndex = cart.products.findIndex(
      (product: productProp) => product.productId === newItem.productId,
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += newItem.quantity;
    } else {
      cart.products.push(newItem);
    }

    cart.totalPrice = cart.products.reduce(
      (total: number, product: productProp) =>
        total + product.price * product.quantity,
      0,
    );
    cart.totalQuantity = cart.products.reduce(
      (total: number, product: productProp) => total + product.quantity,
      0,
    );

    await Cart.update(
      {
        products: cart.products,
        totalPrice: cart.totalPrice,
        totalQuantity: cart.totalQuantity,
      },
      {
        where: { id: cart.id },
      },
    );

    return cart;
  }

  public static async getCartById(cartId: string): Promise<Cart | null> {
    try {
      const cart = await Cart.findByPk(cartId);
      return cart;
    } catch (error: any) {
      throw new Error('Failed to get cart: ' + error.message);
    }
  }

  public static async updateProductInCart(
    cartId: string,
    userId: string,
    productId: string,
    quantityChange: number,
  ): Promise<Cart | null> {
    const cart = await Cart.findOne({ where: { id: cartId, userId: userId } });
    if (!cart) {
      throw new Error(
        'You do not have access to this cart or it does not exist',
      );
    }

    const product = cart.products.find(
      (item: CartProduct) => item.productId === productId,
    );
    if (!product) {
      throw new Error(
        'Product does not exist in your cart. Consider adding it instead.',
      );
    }

    product.quantity += quantityChange;

    if (product.quantity <= 0) {
      cart.products = cart.products.filter(
        (p: CartProduct) => p.productId !== productId,
      );
    }

    const totalPrice = cart.products.reduce(
      (total: number, item: CartProduct) =>
        total + item.price * item.quantity,
      0,
    );
    const totalQuantity = cart.products.reduce(
      (total: number, item: CartProduct) => total + item.quantity,
      0,
    );

    await Cart.update(
      {
        products: cart.products,
        totalPrice: totalPrice,
        totalQuantity: totalQuantity,
      },
      {
        where: { id: cartId },
      },
    );

    const updatedCart = await Cart.findOne({ where: { id: cartId } });

    return updatedCart;
  }

  public static async clearCart(cartId: string){
    try {
      await Cart.destroy({
        where: {
          id: cartId
        },
      });

      const cart = await Cart.findOne({ where: { id: cartId } });

      if(!cart){
        return true;
      }
    } catch (error: any) {
      return new error('Failed to save data to cart' + error.message);
    }
  }
  
  public static async deleteCartItem(
    user_id: string,
    productId: string,
   ): Promise<Cart | null> {
   try {
    const cart = await Cart.findOne({ where: { userId: user_id } });
    if (cart) {
      const updatedCartProducts = cart.products.filter(product => product.productId !== productId);

      // Calculate new total price and total quantity
      let totalPrice = 0;
      let totalQuantity = 0;
      updatedCartProducts.forEach(product => {
        totalPrice += product.price * product.quantity;
        totalQuantity += product.quantity;
      });

      await Cart.update(
        {
          products: updatedCartProducts,
          totalPrice: totalPrice,
          totalQuantity: totalQuantity,
        },
        {
          where: { userId: user_id },
        }
      );
      const updatedCart = await Cart.findOne({ where: { userId: user_id } });
      return updatedCart;
    }
    return null;

   } catch (error: any) {
    return new error('Failed to save data to cart' + error.message); 
   }
  }

}
