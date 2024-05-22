'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn('users', 'active', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'active');
  }
};
