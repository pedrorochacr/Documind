import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Scale, Users, Building2, Megaphone, BarChart2, Cpu,
  FileText, FileSpreadsheet, Image, ArrowUpRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api, normalizeDoc } from '../services/api'
import { formatDate } from '../data/mockData'
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
  const [recentFiles, setRecentFiles] = useState([])
  const [quickGroups, setQuickGroups] = useState([])
  const [storage, setStorage] = useState({ used: 0, total: 850, unit: 'GB' })

  useEffect(() => {
    api.get('/api/documents').then(docs => {
      setRecentFiles(docs.slice(0, 3).map(normalizeDoc))
    }).catch(() => {})

    api.get('/api/groups').then(groups => {
      setQuickGroups(groups.slice(0, 4))
    }).catch(() => {})

    api.get('/api/documents/storage').then(setStorage).catch(() => {})
  }, [])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Bem-vindo de volta, {user?.name || 'Usuário'}.</h1>
        <p className="page-subtitle">Visão geral do sistema de arquivos e atividades recentes.</p>
      </div>

      <div className="dashboard-top-grid">
        <div className="widget">
          <div className="widget-title">Armazenamento</div>
          <div className="widget-subtitle">Uso do Espaço Corporativo</div>
          <div className="storage-widget-inner">
            <StorageChart used={storage.used} total={storage.total} />
            <div className="storage-info-col">
              <div className="storage-stat">
                <span className="storage-stat-dot" style={{ background: '#0f172a' }} />
                <span className="storage-stat-label">Usado</span>
                <span className="storage-stat-value">{storage.used} {storage.unit}</span>
              </div>
              <div className="storage-stat">
                <span className="storage-stat-dot" style={{ background: '#e2e8f0' }} />
                <span className="storage-stat-label">Livre</span>
                <span className="storage-stat-value">{storage.total - storage.used} {storage.unit}</span>
              </div>
              <div className="storage-total">
                <span>{storage.total} {storage.unit} Total</span>
                <span>{storage.used} {storage.unit} Usado</span>
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
                  <span className="quick-group-count">{(g.files || 0).toLocaleString('pt-BR')} docs</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

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
            {recentFiles.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>
                  Nenhum arquivo ainda
                </td>
              </tr>
            )}
            {recentFiles.map(file => {
              const cfg = FILE_TYPE_CONFIG[file.type] || FILE_TYPE_CONFIG.pdf
              return (
                <tr key={file.id}>
                  <td>
                    <div className="file-cell">
                      <div className={`file-cell-icon ${cfg.cls}`}>{cfg.label}</div>
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
