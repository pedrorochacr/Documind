'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
        defaultValue: 'folder',
      },
      description: {
        type: Sequelize.TEXT,
      },
      access: {
        type: Sequelize.STRING,
        defaultValue: 'Interno',
      },
      color: {
        type: Sequelize.STRING,
        defaultValue: '#6366f1',
      },
      colorBg: {
        type: Sequelize.STRING,
        defaultValue: '#eef2ff',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Groups');
  },
};
