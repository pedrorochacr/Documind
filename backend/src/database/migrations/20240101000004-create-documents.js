'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documents', {
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
      type: {
        type: Sequelize.STRING,
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Groups', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      size: {
        type: Sequelize.STRING,
      },
      sizeBytes: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      modifiedBy: {
        type: Sequelize.STRING,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Em Revisão',
      },
      filePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      folderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Folders', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('Documents');
  },
};
