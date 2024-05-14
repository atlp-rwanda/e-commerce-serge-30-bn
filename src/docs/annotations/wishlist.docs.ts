/**
 * @swagger
 * tags:
 *   - wishlist
 */

/**
 * @swagger
 * /api/v1/wishlist/{product_id}:
 *   get:
 *     summary: Add a product to the user's wishlist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         type: integer
 *         description: The ID of the product to add to the wishlist.
 *     responses:
 *       '201':
 *         description: Product added to wishlist successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the product was added.
 *                 product:
 *                   type: object
 *                   description: The added wishlist item details.
 *       '404':
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the product was not found.
 *       '409':
 *         description: Product already in wishlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the product already exists in the wishlist.
 *     tags:
 *       - wishlist
 */

/**
 * @swagger
 * /api/v1/wishlist:
 *   get:
 *     summary: Get the user's wishlist.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User's wishlist retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wishlist:
 *                   type: array
 *                   description: Array of wishlist items for the user.
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: User ID of the wishlist owner.
 *                       product_id:
 *                         type: integer
 *                         description: Product ID of the wishlisted item.
 *                       # Add other product properties here based on your Product model.
 *       '404':
 *         description: No product in wishlist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message indicating the user's wishlist is empty.
 *     tags:
 *       - wishlist
 */

/**
 * @swagger
 * /api/v1/wishlist/{wishlistId}:
 *   delete:
 *     summary: Delete a wishlist item.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         required: true
 *         type: integer
 *         description: The ID of the wishlist item to delete.
 *     responses:
 *       '200':
 *         description: Wishlist item deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the wishlist item was deleted.
 *       '404':
 *         description: Wishlist item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the wishlist item was not found.
 *     tags:
 *       - wishlist
 */
