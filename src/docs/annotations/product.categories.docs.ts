/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The username of the product category.
 *         description:
 *           type: string
 *           description: The detailed description of the product category.
 *       required:
 *         - name
 *         - description
 */

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     summary: Create a new product category
 *     description: Creates a new product category with the provided name and description.
 *     tags:
 *       - Product Categories
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
 *     responses:
 *       '200':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/categories/all:
 *   get:
 *     summary: Get all product categories
 *     description: Retrieves all product categories.
 *     tags:
 *       - Product Categories
 *     responses:
 *       '200':
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/categories/{category_id}:
 *   get:
 *     summary: Get a product category by ID
 *     description: Retrieves a product category by its ID.
 *     tags:
 *       - Product Categories
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product category to retrieve
 *     responses:
 *       '200':
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/categories/{category_id}:
 *   patch:
 *     summary: Update a product category by ID
 *     description: Updates a product category by its ID.
 *     tags:
 *       - Product Categories
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/categories/{category_id}:
 *   delete:
 *     summary: Delete a product category by ID
 *     description: Deletes a product category by its ID.
 *     tags:
 *       - Product Categories
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product category to delete
 *     responses:
 *       '200':
 *         description: Category deleted successfully
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
 *                   example: Category deleted successfully
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
