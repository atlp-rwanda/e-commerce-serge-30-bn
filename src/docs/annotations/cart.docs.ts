/**
 * @openapi
 * /api/v1/cart/addtocart:
 *   post:
 *     summary: Add product(s) to cart
 *     description: Adding items to the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productid:
 *                 type: UUID
 *                 description: The id of the product.
 *                 example: c0abe869-6203-413f-b996-73b2361579b7
 *               quantity:
 *                 type: number
 *                 description: quantity in number
 *                 example: 3
 *     responses:
 *       '201':
 *         description: Item added to cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Item added to cart successfully.
 *                   example: Item added to cart successfully
 *       '401':
 *         description: No Token Provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: No Token Provided.
 *                   example: No Token Provided
 *       '403':
 *         description: Not Authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not Authorized.
 *                   example: JWT Expired or Malformed
 *     tags:
 *       - cart
 */

/**
 * @openapi
 * /api/v1/cart/updatecart/{cartId}:
 *   patch:
 *     summary: Update product(s) in cart
 *     description: Updating items in the cart.
 *     parameters:
 *       - in: path
 *         name: cartId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The id of the product.
 *                 example: c0abe869-6203-413f-b996-73b2361579b7
 *               quantity:
 *                 type: number
 *                 description: The new quantity of the product.
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Item updated in cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Item updated in cart successfully.
 *                   example: Item updated in cart successfully
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Unauthorized.
 *                   example: Unauthorized
 *       '404':
 *         description: Product not found in cart or Cart not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Product not found in cart or Cart not found.
 *                   example: Product not found in cart
 *     tags:
 *       - cart
 */
