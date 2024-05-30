'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'expired', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'expired');
  },
};
