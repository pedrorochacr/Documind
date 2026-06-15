const sequelize = require('../config/database');
const User = require('./User');
const Group = require('./Group');
const Document = require('./Document');
const Folder = require('./Folder');

Group.hasMany(Document, { foreignKey: 'groupId', as: 'documents' });
Document.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

User.hasMany(Document, { foreignKey: 'ownerId', as: 'documents' });
Document.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Folder.hasMany(Document, { foreignKey: 'folderId', as: 'documents' });
Document.belongsTo(Folder, { foreignKey: 'folderId', as: 'folder' });

Folder.hasMany(Folder, { foreignKey: 'parentId', as: 'children' });
Folder.belongsTo(Folder, { foreignKey: 'parentId', as: 'parent' });

module.exports = { sequelize, User, Group, Document, Folder };
