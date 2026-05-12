import { useNavigate } from 'react-router-dom'
import {
  Scale, Users, Building2, Megaphone, BarChart2, Cpu,
  FileText, FileSpreadsheet, Image, ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { GROUPS, FILES, STORAGE, formatDate } from '../data/mockData'
import StorageChart from '../components/dashboard/StorageChart'

const GROUP_ICONS = {
  scale: Scale, users: Users, building: Building2,
  megaphone: Megaphone, chart: BarChart2, cpu: Cpu,
}

const FILE_TYPE_CONFIG = {
  pdf:    { label: 'PDF', cls: 'file-badge-pdf',    icon: FileText },
  doc:    { label: 'DOC', cls: 'file-badge-doc',    icon: FileText },
  xls:    { label: 'XLS', cls: 'file-badge-xls',    icon: FileSpreadsheet },
  img:    { label: 'IMG', cls: 'file-badge-img',    icon: Image },
  folder: { label: '📁',  cls: 'file-badge-folder', icon: null },
}

const STATUS_MAP = {
  'Aprovado':    'badge-green',
  'Em Revisão':  'badge-yellow',
  'Rescindido':  'badge-red',
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const recentFiles = FILES.slice(0, 3)
  const quickGroups = GROUPS.slice(0, 4)

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Bem-vindo de volta, {user?.name || 'Usuário'}.</h1>
        <p className="page-subtitle">Visão geral do sistema de arquivos e atividades recentes.</p>
      </div>

      <div className="dashboard-top-grid">
        {/* Storage Widget */}
        <div className="widget">
          <div className="widget-title">Armazenamento</div>
          <div className="widget-subtitle">Uso do Espaço Corporativo</div>
          <div className="storage-widget-inner">
            <StorageChart used={STORAGE.used} total={STORAGE.total} />
            <div className="storage-info-col">
              <div className="storage-stat">
                <span className="storage-stat-dot" style={{ background: '#0f172a' }} />
                <span className="storage-stat-label">Usado</span>
                <span className="storage-stat-value">{STORAGE.used} {STORAGE.unit}</span>
              </div>
              <div className="storage-stat">
                <span className="storage-stat-dot" style={{ background: '#e2e8f0' }} />
                <span className="storage-stat-label">Livre</span>
                <span className="storage-stat-value">{STORAGE.total - STORAGE.used} {STORAGE.unit}</span>
              </div>
              <div className="storage-total">
                <span>{STORAGE.total} {STORAGE.unit} Total</span>
                <span>{STORAGE.used} {STORAGE.unit} Usado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="widget group-widget">
          <div className="widget-title">Grupos Frequentes</div>
          <div className="widget-subtitle">Acesso rápido aos departamentos</div>
          <div className="quick-groups-grid">
            {quickGroups.map(g => {
              const Icon = GROUP_ICONS[g.icon] || Users
              return (
                <div
                  key={g.id}
                  className="quick-group-item"
                  onClick={() => navigate('/groups')}
                >
                  <div className="quick-group-icon" style={{ background: g.colorBg }}>
                    <Icon size={20} color={g.color} />
                  </div>
                  <span className="quick-group-name">{g.name.split(' ')[0]}</span>
                  <span className="quick-group-count">{g.files.toLocaleString('pt-BR')} docs</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div className="widget">
        <div className="section-header">
          <div>
            <div className="section-title">Arquivos Recentes</div>
            <div className="section-subtitle">Últimas modificações no sistema</div>
          </div>
          <button className="btn-link" onClick={() => navigate('/explorer')}>
            Ver todos <ArrowUpRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Nome do Arquivo</th>
              <th>Grupo</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentFiles.map(file => {
              const cfg = FILE_TYPE_CONFIG[file.type] || FILE_TYPE_CONFIG.pdf
              return (
                <tr key={file.id}>
                  <td>
                    <div className="file-cell">
                      <div className={`file-cell-icon ${cfg.cls}`}>
                        {cfg.label}
                      </div>
                      <div>
                        <div className="file-cell-name">{file.name}</div>
                        <div className="file-cell-meta">Modificado por {file.modifiedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{file.group}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{formatDate(file.modified)}</td>
                  <td>
                    <span className={`badge ${STATUS_MAP[file.status] || 'badge-gray'}`}>
                      {file.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
