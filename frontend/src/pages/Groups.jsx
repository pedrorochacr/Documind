import { useState, useEffect } from 'react'
import {
  Scale, Users, Building2, Megaphone, BarChart2, Cpu,
  Plus, SlidersHorizontal, FileText, Edit3, Trash2, MoreHorizontal,
} from 'lucide-react'
import { api } from '../services/api'
import GroupModal from '../components/groups/GroupModal'

const GROUP_ICONS = {
  scale: Scale, users: Users, building: Building2,
  megaphone: Megaphone, chart: BarChart2, cpu: Cpu,
}

const ACCESS_CLS = {
  Restrito: 'access-restrito',
  Interno:  'access-interno',
  Público:  'access-publico',
}

export default function Groups() {
  const [groups, setGroups]       = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editGroup, setEditGroup] = useState(null)
  const [menuId, setMenuId]       = useState(null)

  useEffect(() => {
    api.get('/api/groups').then(setGroups).catch(() => {})
  }, [])

  const openCreate = () => { setEditGroup(null); setShowModal(true) }
  const openEdit   = (g) => { setEditGroup(g); setShowModal(true); setMenuId(null) }

  const handleSave = async (data) => {
    if (editGroup) {
      const updated = await api.put(`/api/groups/${editGroup.id}`, data)
      setGroups(prev => prev.map(g => g.id === editGroup.id ? updated : g))
    } else {
      const created = await api.post('/api/groups', data)
      setGroups(prev => [...prev, created])
    }
    setShowModal(false)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este grupo?')) {
      await api.delete(`/api/groups/${id}`)
      setGroups(prev => prev.filter(g => g.id !== id))
      setMenuId(null)
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Gerenciador de Grupos</h1>
            <p className="page-subtitle">
              Administre as categorias estruturais, defina permissões de acesso e organize a hierarquia de pastas da organização.
            </p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary">
              <SlidersHorizontal size={14} />
              Filtros
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={14} />
              Novo Grupo
            </button>
          </div>
        </div>
      </div>

      <div className="groups-grid">
        {groups.map(group => {
          const Icon = GROUP_ICONS[group.icon] || Users
          return (
            <div key={group.id} className="group-card" style={{ position: 'relative' }}>
              <div className="group-card-icon" style={{ background: group.colorBg || '#f1f5f9' }}>
                <Icon size={22} color={group.color || '#64748b'} />
              </div>
              <div className="group-card-name">{group.name}</div>
              <div className="group-card-desc">{group.description}</div>

              <div className="group-card-footer">
                <span className="group-card-stat">
                  <FileText size={12} />
                  {group.files ?? 0}
                </span>
                <span className="group-card-stat">
                  <Users size={12} />
                  {group.members ?? 0}
                </span>
                <div className="group-card-footer-right" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={`access-badge ${ACCESS_CLS[group.access] || 'access-interno'}`}>
                    {group.access}
                  </span>
                  <div style={{ position: 'relative' }}>
                    <button
                      className="action-btn"
                      onClick={e => { e.stopPropagation(); setMenuId(menuId === group.id ? null : group.id) }}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                    {menuId === group.id && (
                      <div style={{
                        position: 'absolute', bottom: '100%', right: 0, marginBottom: 4,
                        background: 'white', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                        minWidth: 140, zIndex: 50, overflow: 'hidden',
                      }}>
                        <button
                          style={{ width: '100%', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text-primary)' }}
                          onClick={() => openEdit(group)}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-page)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Edit3 size={13} /> Editar
                        </button>
                        <button
                          style={{ width: '100%', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', color: 'var(--error)' }}
                          onClick={() => handleDelete(group.id)}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--error-bg)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <Trash2 size={13} /> Excluir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <GroupModal
          group={editGroup}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {menuId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          onClick={() => setMenuId(null)}
        />
      )}
    </>
  )
}
