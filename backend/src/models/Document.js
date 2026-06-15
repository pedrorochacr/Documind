const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define(
  'Document',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
    },
    sizeBytes: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    modifiedBy: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Em Revisão',
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    folderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'documents',
    timestamps: true,
  }
);

module.exports = Document;