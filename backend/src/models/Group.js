const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING, defaultValue: 'folder' },
  description: { type: DataTypes.TEXT },
  access: { type: DataTypes.STRING, defaultValue: 'Interno' },
  color: { type: DataTypes.STRING, defaultValue: '#6366f1' },
  colorBg: { type: DataTypes.STRING, defaultValue: '#eef2ff' },
});

module.exports = Group;
