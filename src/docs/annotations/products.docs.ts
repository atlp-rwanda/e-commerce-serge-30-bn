/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         product_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the product.
 *         vendor_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the vendor associated with the product.
 *         category_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the category associated with the product.
 *         name:
 *           type: string
 *           description: The name of the product.
 *         description:
 *           type: string
 *           description: The detailed description of the product.
 *         price:
 *           type: number
 *           description: The price of the product.
 *         quantity:
 *           type: integer
 *           description: The quantity of the product available.
 *         image_url:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of URLs pointing to images of the product.
 *         discount:
 *           type: number
 *           description: The discount percentage applied to the product.
 *         expiry_date:
 *           type: string
 *           format: date-time
 *           description: The expiry date of the product.
 *       required:
 *         - name
 *         - description
 *         - price
 *         - quantity
 *         - image_urls
 */

/**
 * @openapi
 * /api/v1/product/create:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product if the user has vendor permissions.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_name:
 *                 type: string
 *               expiry_date:
 *                 type: string
 *                 format: date-time
 *               image_url:
 *                 type: array
 *                 items:
 *                   type: string
 *               quantity:
 *                 type: integer
 *               discount:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       '400':
 *         description: The product with this name already exists in your store. Consider updating it instead.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: The product with this name already exists in your store. Consider updating it instead.
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       '403':
 *         description: Forbidden (user does not have permission to add a product)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You do not have permission to add a product on this platform.
 */
