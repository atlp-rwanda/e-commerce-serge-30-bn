'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'available', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('products','available');
  },
};
