/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
      },
      stripeId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      momoId: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      orderId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      payment_method: {
        allowNull: false,
        type: Sequelize.ENUM('Stripe', 'MOMO'),
      },
      payment_status: {
        type: Sequelize.ENUM(
          'Pending',
          'Completed',
          'Failed',
          'Refunded',
          'Canceled',
        ),
        defaultValue: 'Pending',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('payment');
  },
};
