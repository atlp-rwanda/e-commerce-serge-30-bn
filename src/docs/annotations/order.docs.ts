/**
 * @openapi
 * /api/v1/checkout:
 *   post:
 *     summary: Create order
 *     description: Adding Products to the order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *                 description: The address of the buyer.
 *                 example: "123 Maple Street"
 *               country:
 *                 type: string
 *                 description: The country of the buyer.
 *                 example: "United States"
 *               city:
 *                 type: string
 *                 description: The city of the buyer.
 *                 example: "New York"
 *               phone:
 *                 type: string
 *                 description: The phone number of the buyer.
 *                 example: "+1-212-555-0123"
 *               zipCode:
 *                 type: string
 *                 description: The zip code of the buyer.
 *                 example: "10001"
 *               expectedDeliveryDate:
 *                 type: string
 *                 description: The expected delivery date.
 *                 example: "2024-06-10"
 *     responses:
 *       '200':
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Order created successfully.
 *                   example: "Order created successfully"
 *       '401':
 *         description: No Token Provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: No Token Provided.
 *                   example: "No Token Provided"
 *       '403':
 *         description: Not Authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Not Authorized.
 *                   example: "JWT Expired or Malformed"
 *     tags:
 *       - order
 */
