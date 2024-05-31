'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('cart', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onDelete: 'CASCADE',
      },
      products: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      },
      totalPrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalQuantity: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
      },
    });
  },

  async down (queryInterface) {
    queryInterface.dropTable("cart")
  }
};
