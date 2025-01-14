/**
 * @openapi
 * /api/v1/users/profile:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Error occurred while updating profile
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Error occurred while fetching profile
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         gender:
 *           type: string
 *           description: The gender of the profile.
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The birthdate of the profile.
 *         preferred_language:
 *           type: string
 *           description: The preferred language of the profile.
 *         preferred_currency:
 *           type: string
 *           description: The preferred currency of the profile.
 *         location:
 *           type: string
 *           description: The location of the profile.
 *       required:
 *         - gender
 *         - birthdate
 *         - preferred_language
 *         - preferred_currency
 *         - location
 */
