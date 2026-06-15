const { Folder, Document } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const { parentId } = req.query;
    const where = {};
    if (parentId !== undefined) where.parentId = parentId === 'null' ? null : parentId;
    const folders = await Folder.findAll({ where });
    res.json(folders);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const folder = await Folder.findByPk(req.params.id, {
      include: [{ model: Folder, as: 'children' }],
    });
    if (!folder) return res.status(404).json({ error: 'Pasta não encontrada' });
    res.json(folder);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, parentId } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome da pasta obrigatório' });
    const folder = await Folder.create({ name, parentId: parentId || null });
    res.status(201).json(folder);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const folder = await Folder.findByPk(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Pasta não encontrada' });
    await folder.update(req.body);
    res.json(folder);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const folder = await Folder.findByPk(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Pasta não encontrada' });
    await folder.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
