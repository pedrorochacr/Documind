const { Group, Document } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const groups = await Group.findAll();
    const withCounts = await Promise.all(groups.map(async (g) => {
      const files = await Document.count({ where: { groupId: g.id } });
      return { ...g.toJSON(), files };
    }));
    res.json(withCounts);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
    const files = await Document.count({ where: { groupId: group.id } });
    res.json({ ...group.toJSON(), files });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, icon, description, access, color, colorBg } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome do grupo obrigatório' });
    const group = await Group.create({ name, icon, description, access, color, colorBg });
    res.status(201).json({ ...group.toJSON(), files: 0 });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
    await group.update(req.body);
    const files = await Document.count({ where: { groupId: group.id } });
    res.json({ ...group.toJSON(), files });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);
    if (!group) return res.status(404).json({ error: 'Grupo não encontrado' });
    await group.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
