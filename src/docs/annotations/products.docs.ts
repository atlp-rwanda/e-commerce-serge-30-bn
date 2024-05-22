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

/**
 * @openapi
 * /api/v1/product/{product_id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product by its ID. Requires authentication.
 *     tags:
 *       - Products
 *     parameters:
 *        - name: product_id
 *          in: path
 *          description: The ID of the product to retrieve.
 *          required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
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
 *                   example: Product retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       '401':
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *       '404':
 *         description: Product or Vendor not found
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
 *                   examples:
 *                     productNotFound:
 *                       summary: Product not found
 *                       value: Product not found
 *                     vendorNotFound:
 *                       summary: Vendor not found
 *                       value: Vendor not found
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An unexpected error occurred
 */

/**
 * @openapi
 * /api/v1/product/{productId}:
 *   patch:
 *     summary: Update an existing product
 *     description: Updates an existing product if the user has vendor permissions.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - name: productId
 *          in: path
 *          description: The unique identifier of the product.
 *          required: true
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
 *         description: Product updated successfully
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
 *                   example: Product updated successfully
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

/**
 * @openapi
 * /api/v1/products/all:
 *   get:
 *     summary: Retrieve all products
 *     description: Retrieve all products available in the system. If the user is a vendor, it retrieves only the products associated with the vendor.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: Products retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @openapi
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product if the user is a vendor & his collection
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The id of the product.
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Product deleted successfully
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
 *                   example: Product deleted successfully
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You do not have permission to delete this product.
 *       '404':
 *         description: Not Found
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
 *                   example: Product not found.
 */

/**
 * @openapi
 * /api/v1/product/available/{id}:
 *   put:
 *     summary: Change status by ID of the product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to set status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: New status for the product
 *     responses:
 *       200:
 *         description: Product status successfully changed!
 *       400:
 *         description: Error occurred while updating status
 */
