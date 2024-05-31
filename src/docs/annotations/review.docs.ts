/**
 * @openapi
 * /api/v1/buyer/review/{id}:
 *   post:
 *     summary: Add a review by product's  ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product for reviews
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: review created  successfully
 *       400:
 *         description: Error occurred while adding a review
 *   get:
 *     summary: Get all reviews by product's ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the proudct's  review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Error occurred while fetching Review
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the review.
 *         comment:
 *           type: string
 *           description: The content of the review.
 *         rating:
 *           type: integer
 *           description: the rating for the product
 *       required:
 *         - title
 *         - comment
 *         - rating
 */

/**
* @openapi
* /api/v1/buyer/review/{id}:
*   put:
*     summary: Update a review by Review's ID
*     tags: [Review]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the review to update
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Review'
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Review updated successfully
*       400:
*         description: Error occurred while updating review
*       401:
*         description: Unauthorized
*       404:
*         description: Review not found
*       500:
*         description: Error occurred while updating review
*/

/**
* @openapi
* /api/v1/buyer/review/{id}:
*   delete:
*     summary: Delete a review by review Id
*     tags: [Review]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the review to delete
*         schema:
*           type: string
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: Review deleted successfully
*       400:
*         description: Error occurred while deleting review
*       401:
*         description: Unauthorized
*       404:
*         description: Review not found
*       500:
*         description: Error occurred while deleting review
*/




