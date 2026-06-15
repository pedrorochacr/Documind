require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Group, Document, Folder } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Tabelas criadas.');

  const admin = await User.create({
    name: 'Administrador',
    email: 'admin@corporacao.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'Administrador',
    initials: 'AD',
  });

  const groups = await Group.bulkCreate([
    { name: 'Jurídico & Compliance', icon: 'scale', description: 'Contratos, regulações e conformidade legal', access: 'Restrito', color: '#7c3aed', colorBg: '#f3f0ff' },
    { name: 'Recursos Humanos', icon: 'users', description: 'Gestão de pessoas e documentos de RH', access: 'Interno', color: '#0891b2', colorBg: '#ecfeff' },
    { name: 'Conselho & Diretoria', icon: 'building', description: 'Atas, relatórios e decisões executivas', access: 'Restrito', color: '#b45309', colorBg: '#fef3c7' },
    { name: 'Marketing & Mídia', icon: 'megaphone', description: 'Materiais de marketing e comunicação', access: 'Público', color: '#be185d', colorBg: '#fdf2f8' },
    { name: 'Financeiro', icon: 'chart', description: 'Relatórios financeiros e orçamentos', access: 'Restrito', color: '#047857', colorBg: '#ecfdf5' },
    { name: 'Tecnologia', icon: 'cpu', description: 'Documentação técnica e projetos de TI', access: 'Interno', color: '#1d4ed8', colorBg: '#eff6ff' },
  ], { returning: true });

  const folder = await Folder.create({ name: 'Contratos 2023', parentId: null });

  await Document.bulkCreate([
    { name: 'Contrato_Fornecedor_2024.pdf', type: 'pdf', groupId: groups[0].id, size: '2.4 MB', sizeBytes: 2516582, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Aprovado', folderId: folder.id },
    { name: 'Política_RH_2024.docx', type: 'doc', groupId: groups[1].id, size: '890 KB', sizeBytes: 911360, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Aprovado', folderId: null },
    { name: 'Planilha_Budget_Q1.xlsx', type: 'xls', groupId: groups[4].id, size: '1.2 MB', sizeBytes: 1258291, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Em Revisão', folderId: null },
    { name: 'Logo_Corporação.png', type: 'img', groupId: groups[3].id, size: '3.8 MB', sizeBytes: 3984588, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Aprovado', folderId: null },
    { name: 'Ata_Reunião_Diretoria.pdf', type: 'pdf', groupId: groups[2].id, size: '850 KB', sizeBytes: 870400, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Aprovado', folderId: null },
    { name: 'Relatório_Financeiro_2024.pdf', type: 'pdf', groupId: groups[4].id, size: '1.8 MB', sizeBytes: 1887437, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Em Revisão', folderId: null },
    { name: 'Manual_TI_Infraestrutura.pdf', type: 'pdf', groupId: groups[5].id, size: '3.1 MB', sizeBytes: 3250586, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Aprovado', folderId: null },
    { name: 'Campanha_Marketing_Q2.doc', type: 'doc', groupId: groups[3].id, size: '560 KB', sizeBytes: 573440, modifiedBy: 'admin@corporacao.com', ownerId: admin.id, status: 'Rescindido', folderId: null },
  ]);

  console.log('Seed concluído! Usuário: admin@corporacao.com / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
