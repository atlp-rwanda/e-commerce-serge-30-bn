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
