/* eslint-disable no-undef */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'previousPasswords', {
      type: Sequelize.DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    });
    await queryInterface.addColumn('users', 'lastTimePasswordUpdate', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    });
    await queryInterface.addColumn('users', 'passwordExpired', {
     type: Sequelize.BOOLEAN,
     defaultValue: false,
     allowNull: false,
   });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'previousPasswords');
    await queryInterface.removeColumn('users', 'lastTimePasswordUpdate');
    await queryInterface.removeColumn('users', 'passwordExpired');
  }
};
