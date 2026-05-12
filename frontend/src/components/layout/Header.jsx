import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Clock, LogOut, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="top-header">
      <button className="header-menu-btn" onClick={onMenuClick} aria-label="Menu">
        <Menu size={18} />
      </button>

      <div className="header-search">
        <span className="header-search-icon">
          <Search size={14} />
        </span>
        <input type="text" placeholder="Buscar documentos..." />
      </div>

      <div className="header-spacer" />

      <div className="header-actions">
        <button className="header-icon-btn header-icon-hide-sm" title="Histórico">
          <Clock size={17} />
        </button>
        <button className="header-icon-btn" title="Notificações">
          <Bell size={17} />
          <span className="header-notif-dot" />
        </button>
        <div style={{ position: 'relative' }}>
          <div
            className="header-avatar"
            onClick={() => setShowMenu(v => !v)}
            title={user?.name}
          >
            {user?.initials || 'U'}
          </div>
          {showMenu && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                onClick={() => setShowMenu(false)}
              />
              <div style={{
                position: 'absolute', top: '42px', right: 0,
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                minWidth: '180px', zIndex: 50, overflow: 'hidden',
              }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', fontSize: '13px', color: 'var(--error)', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--error-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <LogOut size={14} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
