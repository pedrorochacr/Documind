const path = require('path');
const fs = require('fs');
const { Document, Group, User, Folder } = require('../models');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileType(filename) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'img';
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'xls';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (ext === 'pdf') return 'pdf';
  return ext || 'file';
}

exports.list = async (req, res, next) => {
  try {
    const { groupId, folderId, type, status } = req.query;
    const where = {};
    if (groupId) where.groupId = groupId;
    if (folderId !== undefined) where.folderId = folderId === 'null' ? null : folderId;
    if (type) where.type = type;
    if (status) where.status = status;

    const docs = await Document.findAll({
      where,
      include: [
        { model: Group, as: 'group', attributes: ['id', 'name', 'color', 'colorBg', 'icon'] },
        { model: User, as: 'owner', attributes: ['id', 'name'] },
      ],
    });
    res.json(docs);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id, {
      include: [
        { model: Group, as: 'group' },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Folder, as: 'folder', attributes: ['id', 'name'] },
      ],
    });
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    res.json(doc);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const file = req.file;
    const { groupId, folderId, status } = req.body;
    const name = req.body.name || (file ? file.originalname : 'Sem nome');
    const sizeBytes = file ? file.size : 0;

    const doc = await Document.create({
      name,
      type: file ? getFileType(file.originalname) : 'file',
      groupId: groupId || null,
      size: formatBytes(sizeBytes),
      sizeBytes,
      modifiedBy: req.user.email,
      ownerId: req.user.id,
      status: status || 'Em Revisão',
      filePath: file ? file.filename : null,
      folderId: folderId || null,
    });
    res.status(201).json(doc);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    const { name, groupId, folderId, status } = req.body;
    const updates = { modifiedBy: req.user.email };
    if (name !== undefined) updates.name = name;
    if (groupId !== undefined) updates.groupId = groupId;
    if (folderId !== undefined) updates.folderId = folderId;
    if (status !== undefined) updates.status = status;
    await doc.update(updates);
    res.json(doc);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Documento não encontrado' });
    if (doc.filePath) {
      const fullPath = path.join(__dirname, '../../uploads', doc.filePath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }
    await doc.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};

exports.download = async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc || !doc.filePath) return res.status(404).json({ error: 'Arquivo não encontrado' });
    const fullPath = path.join(__dirname, '../../uploads', doc.filePath);
    if (!fs.existsSync(fullPath)) return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    res.download(fullPath, doc.name);
  } catch (err) { next(err); }
};

exports.storageStats = async (req, res, next) => {
  try {
    const docs = await Document.findAll({ attributes: ['sizeBytes'] });
    const usedBytes = docs.reduce((acc, d) => acc + (Number(d.sizeBytes) || 0), 0);
    const totalBytes = 850 * 1024 * 1024 * 1024;
    res.json({
      total: 850,
      used: +(usedBytes / (1024 * 1024 * 1024)).toFixed(2),
      unit: 'GB',
    });
  } catch (err) { next(err); }
};
