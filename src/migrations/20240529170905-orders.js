'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     queryInterface.createTable('orders', {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      cartId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'cart',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.DataTypes.ENUM(
          'pending',
          'shipped',
          'delivered',
          'cancelled',
        ),
        defaultValue: 'pending',
      },
      address: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      totalPrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      expectedDeliveryDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      products: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },

  async down (queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     queryInterface.dropTable("orders");
  }
};
