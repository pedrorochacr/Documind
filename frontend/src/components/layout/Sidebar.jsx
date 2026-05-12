import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Users, Settings, Plus, HardDrive, Archive } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { STORAGE } from '../../data/mockData'

export default function Sidebar() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const usedPct = Math.round((STORAGE.used / STORAGE.total) * 100)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">
            <Archive size={18} color="#0f172a" />
          </div>
          <div>
            <div className="sidebar-logo-name">Arquivo Digital</div>
            <div className="sidebar-logo-sub">Gestão Corporativa</div>
          </div>
        </div>
      </div>

      <button className="sidebar-new-btn" onClick={() => navigate('/explorer')}>
        <Plus size={15} />
        Novo Documento
      </button>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/explorer" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <FolderOpen size={16} />
          Explorador
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <Users size={16} />
          Grupos
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <Settings size={16} />
          Configurações
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-storage">
          <div className="sidebar-storage-label">
            <HardDrive size={12} />
            Armazenamento
          </div>
          <div className="sidebar-storage-bar">
            <div className="sidebar-storage-fill" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="sidebar-storage-text">{usedPct}% utilizado</div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.initials || 'U'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || 'Usuário'}</div>
            <div className="sidebar-user-email">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
