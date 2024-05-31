/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'finalRatings', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: true,
    });

    await queryInterface.addColumn('products', 'reviewsCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'finalRatings');
    await queryInterface.removeColumn('products', 'reviewsCount');
  },
};
