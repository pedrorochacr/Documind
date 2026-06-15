const bcrypt = require('bcryptjs');
const { User } = require('../models');

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

exports.list = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Nome, email e senha obrigatórios' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, initials: getInitials(name) });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, initials: user.initials });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const { name, email, password, role } = req.body;
    const updates = {};
    if (name) { updates.name = name; updates.initials = getInitials(name); }
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (password) updates.password = await bcrypt.hash(password, 10);
    await user.update(updates);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, initials: user.initials });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    await user.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
