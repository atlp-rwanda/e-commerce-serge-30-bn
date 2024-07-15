import { EventEmitter } from 'events';
import Product from '../models/products.Model';
import Notification from '../models/notifications.model';
import {
  SocketTrigger,
  sendNotification,
  triggerNotification,
} from '../utils/notification';
import User from '../models/user.model';
import Vendor from '../models/vendor.model';
import Wishlist from '../models/wishlist.model';
import Order from '../models/order.model';
import { logger } from '../config/Logger';

const NotificationEvents = new EventEmitter();

function getUserInfo(user: User): {
  email: string;
  name: string;
  UserId: string;
} {
  const email = user.email as string;
  const name = user.firstname as string;
  const UserId = user.user_id as string;
  return { email, name, UserId };
}

NotificationEvents.on('productCreated', async (productId: string) => {
  const productOne: Product = (await Product.findOne({
    where: {
      product_id: productId,
    },
  })) as Product;

  const vendor = await Vendor.findOne({
    where: { vendor_id: productOne.vendor_id },
  });
  if (!vendor) return;
  const vendorUser = await User.findOne({
    where: { user_id: vendor.user_id },
  });
  if (!vendorUser) {
    return;
  }
  const { email, name, UserId } = getUserInfo(vendorUser);

  const subject = `Congratulation `;
  const message = `
  Hi ${name},
  you have added new product ${productOne.name} to the store.
  Thank you,
  Team S
`;

  await Notification.create({
    message: message,
    isRead: false,
    userId: UserId,
  });

  SocketTrigger(UserId, email, message, subject);
  sendNotification(email, message, subject);
  triggerNotification(UserId);
});

NotificationEvents.on(
  'productWished',
  async (productId: string, userName: string) => {
    const productOne: Product = (await Product.findOne({
      where: {
        product_id: productId,
      },
    })) as Product;

    const vendor = await Vendor.findOne({
      where: { vendor_id: productOne.vendor_id },
    });

    if (!vendor) return;
    const vendorUser = await User.findOne({
      where: { user_id: vendor.user_id },
    });
    if (!vendorUser) {
      return;
    }
    const Buyer: User = (await User.findOne({
      where: { username: userName },
    })) as User;

    const { email, name, UserId } = getUserInfo(vendorUser);

    const subject = `Congratulation `;
    const message = `
  Hi ${name},
  ${userName} added your product ${productOne.name} to their wishlist.
  Thank you,
  Team S
`;
    const message1 = `
  Hi ${userName}, product ${productOne.name} was added to your wishlist.
  Thank you,
  Team S
`;

    await Notification.create({
      message: message,
      isRead: false,
      userId: UserId,
    });
    await Notification.create({
      message: message1,
      isRead: false,
      userId: Buyer.user_id,
    });

    SocketTrigger(UserId, email, message, subject);
    sendNotification(email, message, subject);
    triggerNotification(UserId);

    SocketTrigger(Buyer.user_id, email, message1, subject);
    sendNotification(email, message1, subject);
    triggerNotification(Buyer.user_id);
  },
);

NotificationEvents.on('productAvailable', async (product: Product) => {
  if (!product.product_id) {
    logger.error('Product ID is undefined');
    return;
  }

  const allwish = await Wishlist.findAll({
    where: { product_id: product.product_id },
  });

  allwish.forEach(async (el) => {
    const UserWished: User = (await User.findOne({
      where: { user_id: el.user_id },
    })) as User;
    const { email, name, UserId } = getUserInfo(UserWished);

    const subject = `The Product ${product.name} Is Now Available`;
    const message = `
    Hi ${name},
    The ${product.name} product is now ${product.available ? 'available' : 'unavailable'}. You can ${product.available ? 'buy it' : 'check back later'}.
    Thank you,
    Team S
    `;

    await Notification.create({
      message: message,
      isRead: false,
      userId: UserId,
    });

    SocketTrigger(UserId, email, message, subject);
    sendNotification(email, message, subject);
    triggerNotification(UserId);
  });
});

NotificationEvents.on('newOrder', async (orders: Order, userId: string) => {
  const Buyer: User = (await User.findOne({
    where: { user_id: userId },
  })) as User;
  const { email, name, UserId } = getUserInfo(Buyer);

  const subject = `New Order `;
  const message = `
  Hi ${name},
  you have a new order which is Pending, you can make payment by bank or momo.
  Thank you ,
  `;

  // BUYER SIDE
  await Notification.create({
    message: message,
    isRead: false,
    userId: UserId,
  });
  SocketTrigger(UserId, email, message, subject);
  sendNotification(email, message, subject);
  triggerNotification(UserId);

  if (!Array.isArray(orders)) {
    console.error('orders is not an array', orders);
  }

  // SELLERS SIDE FOR MANY SELLERS
  for (const productInOrder of orders.products) {
    const product = (await Product.findOne({
      where: { product_id: productInOrder.productId },
    })) as Product;

    if (product) {
      const vendorUser = await Vendor.findOne({
        where: { vendor_id: product.vendor_id },
      });
      if (!vendorUser) return;
      const vendor = (await User.findOne({
        where: { user_id: vendorUser.user_id },
      })) as User;

      if (vendor) {
        const {
          email: emailSeller,
          name: nameSeller,
          UserId: UserIdSeller,
        } = getUserInfo(vendor);

        const subjectSeller = `Congratulations, you sold a new product 😇`;
        const messagesSeller = `
        Hi ${nameSeller},
        you sold ${product.name} to the client ${Buyer.firstname}.
        Thank you,
        Team S
        `;

        // Create a notification for the seller
        await Notification.create({
          message: messagesSeller,
          isRead: false,
          userId: UserIdSeller,
        });

        SocketTrigger(UserIdSeller, emailSeller, messagesSeller, subjectSeller);
        sendNotification(emailSeller, messagesSeller, subjectSeller);
        triggerNotification(UserIdSeller);
      } else {
        logger.error(`Vendor not found for product ID: ${product.product_id}`);
      }
    } else {
      logger.error(`Product not found with ID: ${productInOrder.productId}`);
    }
  }
});

NotificationEvents.on('makePayment', async (orders: Order, userId: string) => {
  const Buyer: User = (await User.findOne({
    where: { user_id: userId },
  })) as User;
  const { email, name, UserId } = getUserInfo(Buyer);

  const subject = `New Payment `;
  const message = `
  Hi ${name},
  you have paid successfully, you can make new orders.
  Thank you ,
  `;

  // BUYER SIDE
  await Notification.create({
    message: message,
    isRead: false,
    userId: UserId,
  });
  SocketTrigger(UserId, email, message, subject);
  sendNotification(email, message, subject);
  triggerNotification(UserId);

  // SELLERS SIDE FOR MANY SELLERS
  for (const productInOrder of orders.products) {
    const product = (await Product.findOne({
      where: { product_id: productInOrder.productId },
    })) as Product;

    if (product) {
      const vendorUser = await Vendor.findOne({
        where: { vendor_id: product.vendor_id },
      });
      if (!vendorUser) return;

      const vendor = (await User.findOne({
        where: { user_id: vendorUser.user_id },
      })) as User;

      if (vendor) {
        const {
          email: emailSeller,
          name: nameSeller,
          UserId: UserIdSeller,
        } = getUserInfo(vendor);

        const subjectSeller = `Congratulations, you sold a new product 😇`;
        const messagesSeller = `
        Hi ${nameSeller},
        you sold ${product.name} to the client ${Buyer.firstname}.
        Thank you ,
        Team S
        `;

        // Create a notification for the seller
        await Notification.create({
          message: messagesSeller,
          isRead: false,
          userId: UserIdSeller,
        });

        SocketTrigger(UserIdSeller, emailSeller, messagesSeller, subjectSeller);
        sendNotification(emailSeller, messagesSeller, subjectSeller);
        triggerNotification(UserIdSeller);
      } else {
        logger.error(`Vendor not found for product ID: ${product.product_id}`);
      }
    } else {
      logger.error(`Product not found with ID: ${productInOrder.productId}`);
    }
  }
});

NotificationEvents.on(
  'makemomoPayment',
  async (paymentRequest, userId: string) => {
    const Buyer: User = (await User.findOne({
      where: { user_id: userId },
    })) as User;

    const { email, name, UserId } = getUserInfo(Buyer);

    const subject = `New Payment `;
    const message = `
    Hi ${name},
    you have paid successfully.
    Thank you ,
    Team S
  `;

    // BUYER SIDE
    await Notification.create({
      message: message,
      isRead: false,
      userId: UserId,
    });

    SocketTrigger(UserId, email, message, subject);
    sendNotification(email, message, subject);
    triggerNotification(UserId);

    // SELLERS SIDE FOR MANY SELLERS
    const order = (await Order.findOne({
      where: { id: paymentRequest.orderId },
    })) as Order;

    if (!order) {
      logger.error('Order not found');
      return;
    }

    for (const productInOrder of order.products) {
      const product = (await Product.findOne({
        where: { product_id: productInOrder.productId },
      })) as Product;

      if (product) {
        const vendorUser = await Vendor.findOne({
          where: { vendor_id: product.vendor_id },
        });
        if (!vendorUser) return;

        const vendor = (await User.findOne({
          where: { user_id: vendorUser.user_id },
        })) as User;

        if (vendor) {
          const {
            email: emailSeller,
            name: nameSeller,
            UserId: UserIdSeller,
          } = getUserInfo(vendor);

          const subjectSeller = `Congratulations, you sold a new product 😇`;
          const messagesSeller = `
          Hi ${nameSeller},
          you sold ${product.name} to the client ${Buyer.firstname}.
          Thank you ,
          Team S
        `;

          await Notification.create({
            message: messagesSeller,
            isRead: false,
            userId: UserIdSeller,
          });

          SocketTrigger(
            UserIdSeller,
            emailSeller,
            messagesSeller,
            subjectSeller,
          );
          sendNotification(emailSeller, messagesSeller, subjectSeller);
          triggerNotification(UserIdSeller);
        } else {
          logger.error(
            `Vendor not found for product ID: ${product.product_id}`,
          );
        }
      } else {
        logger.error(`Product not found with ID: ${productInOrder.productId}`);
      }
    }
  },
);

NotificationEvents.on(
  'createCart',
  async (productId: string, userId: string) => {
    const productOne: Product = (await Product.findOne({
      where: {
        product_id: productId,
      },
    })) as Product;

    const vendor = await Vendor.findOne({
      where: { vendor_id: productOne.vendor_id },
    });
    if (!vendor) return;
    const vendorUser = await User.findOne({
      where: { user_id: vendor.user_id },
    });
    if (!vendorUser) {
      return;
    }
    const Buyer: User = (await User.findOne({
      where: { user_id: userId },
    })) as User;

    const { email, name, UserId } = getUserInfo(vendorUser);

    const subject = `Congratulation `;
    const message = `
  Hi ${name},
  ${Buyer.username} added your product to their cart.
  Thank you,
  Team S
  `;
    const message1 = `
  Hi ${Buyer.username},
  you have added ${productOne.name} to your cart.
  you can add more products,
  `;

    await Notification.create({
      message: message,
      isRead: false,
      userId: UserId,
    });

    await Notification.create({
      message: message1,
      isRead: false,
      userId: Buyer.user_id,
    });

    SocketTrigger(UserId, email, message, subject);
    sendNotification(email, message, subject);
    triggerNotification(UserId);

    SocketTrigger(Buyer.user_id, email, message1, subject);
    sendNotification(email, message1, subject);
    triggerNotification(Buyer.user_id);
  },
);

NotificationEvents.on('clearCart', async (userId: string) => {
  const vendor = await Vendor.findOne({
    where: { vendor_id: userId },
  });
  if (!vendor) return;
  const vendorUser = await User.findOne({
    where: { user_id: vendor.user_id },
  });
  if (!vendorUser) {
    return;
  }
  const Buyer: User = (await User.findOne({
    where: { user_id: userId },
  })) as User;

  const { email, name, UserId } = getUserInfo(vendorUser);

  const subject = `Add more Exciting products`;
  const message = `
  Hi ${name},
  ${Buyer.username} cleared their cart.
  Thank you,
  Team S
  `;
  const message1 = `
  Hi ${Buyer.username},
  you have cleared your cart.
  you can add more products,
  `;

  await Notification.create({
    message: message,
    isRead: false,
    userId: UserId,
  });

  await Notification.create({
    message: message1,
    isRead: false,
    userId: Buyer.user_id,
  });

  SocketTrigger(UserId, email, message, subject);
  sendNotification(email, message, subject);
  triggerNotification(UserId);

  SocketTrigger(Buyer.user_id, email, message1, subject);
  sendNotification(email, message1, subject);
  triggerNotification(Buyer.user_id);
});

export default NotificationEvents;
