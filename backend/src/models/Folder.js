const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Folder = sequelize.define(
  'Folder',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'folders',
    timestamps: true,
  }
);

module.exports = Folder;