/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @openapi
 * /api/v1/products/search:
 *   post:
 *     summary: Search for products
 *     description: A user should be able to search for products by name, price range, category, etc.
 *     tags: 
 *       - Products
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product to search for
 *               minPrice:
 *                 type: number
 *                 description: Minimum price of the product
 *               maxPrice:
 *                 type: number
 *                 description: Maximum price of the product
 *               category:
 *                 type: string
 *                 description: Category of the product to search for
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
