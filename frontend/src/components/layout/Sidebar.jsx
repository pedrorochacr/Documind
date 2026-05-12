import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Users, Settings, HardDrive, Archive } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { STORAGE } from '../../data/mockData'

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const usedPct = Math.round((STORAGE.used / STORAGE.total) * 100)

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-inner">
          <div className="sidebar-logo-icon">
            <Archive size={18} color="#0f172a" />
          </div>
          <div>
            <div className="sidebar-logo-name">Documind</div>
            <div className="sidebar-logo-sub">Arquivo Digital</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ paddingTop: 16 }}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          onClick={onClose}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink
          to="/explorer"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          onClick={onClose}
        >
          <FolderOpen size={16} />
          Explorador
        </NavLink>
        <NavLink
          to="/groups"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          onClick={onClose}
        >
          <Users size={16} />
          Grupos
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          onClick={onClose}
        >
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
