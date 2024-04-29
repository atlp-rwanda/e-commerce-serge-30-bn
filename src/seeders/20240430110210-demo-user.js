/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          user_id: process.env.ADMIN_ID,
          username: 'admin',
          firstname: 'coder',
          lastname: 'john',
          verified: true,
          role: 'ADMIN',
          email: 'admin@example.com',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
