/**
 * @openapi
 * components:
 *   schemas:
 *     Vendor:
 *       type: object
 *       properties:
 *         vendor_id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the vendor.
 *         store_name:
 *           type: string
 *           description: The name of the vendor's store.
 *         store_description:
 *           type: string
 *           description: The description of the vendor's store.
 *       required:
 *         - store_name
 *         - store_description
 */

/**
 * @openapi
 * /api/v1/vendors:
 *   post:
 *     summary: Create a new vendor
 *     description: Creates a new vendor if the user has vendor permissions.
 *     tags:
 *       - Vendors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               store_description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Vendor created successfully
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
 *                   example: Vendor created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Vendor'
 *       '400':
 *         description: Bad request (e.g., invalid data or missing fields)
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
 *                   example: Invalid user
 *       '500':
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/vendors/all:
 *   get:
 *     summary: Get all vendors
 *     description: Retrieves all vendors.
 *     tags:
 *       - Vendors
 *     responses:
 *       '200':
 *         description: Vendors retrieved successfully
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
 *                   example: Vendors retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vendor'
 *       '404':
 *         description: No vendors found
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
 *                   example: No vendors found
 *       '500':
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/vendors/{vendor_id}:
 *   get:
 *     summary: Get a vendor by ID
 *     description: Retrieves a vendor by its ID.
 *     tags:
 *       - Vendors
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         description: ID of the vendor to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vendor retrieved successfully
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
 *                   example: Vendor retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Vendor'
 *       '404':
 *         description: Vendor not found
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
 *                   example: Vendor not found
 *       '500':
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/vendors/{vendor_id}:
 *   patch:
 *     summary: Update a vendor
 *     description: Updates a vendor's details.
 *     tags:
 *       - Vendors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         description: ID of the vendor to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_name:
 *                 type: string
 *               store_description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Vendor updated successfully
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
 *                   example: Vendor updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Vendor'
 *       '404':
 *         description: Vendor not found
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
 *                   example: Vendor not found
 *       '500':
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */

/**
 * @openapi
 * /api/v1/vendors/{vendor_id}:
 *   delete:
 *     summary: Delete a vendor
 *     description: Deletes a vendor by its ID.
 *     tags:
 *       - Vendors
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         description: ID of the vendor to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Vendor deleted successfully
 *       '500':
 *         description: Internal Server Error
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
 *                   example: Internal Server Error
 */
