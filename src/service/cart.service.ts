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
}
