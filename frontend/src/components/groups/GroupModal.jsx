import { useState } from 'react'
import { X } from 'lucide-react'

const COLORS = [
  { color: '#f59e0b', bg: '#fffbeb' },
  { color: '#6366f1', bg: '#eef2ff' },
  { color: '#1e293b', bg: '#f1f5f9' },
  { color: '#f97316', bg: '#fff7ed' },
  { color: '#0ea5e9', bg: '#f0f9ff' },
  { color: '#10b981', bg: '#ecfdf5' },
  { color: '#ec4899', bg: '#fdf2f8' },
  { color: '#8b5cf6', bg: '#f5f3ff' },
]

const ACCESS_OPTIONS = ['Público', 'Interno', 'Restrito']

export default function GroupModal({ group, onClose, onSave }) {
  const [name, setName]       = useState(group?.name || '')
  const [desc, setDesc]       = useState(group?.description || '')
  const [access, setAccess]   = useState(group?.access || 'Interno')
  const [color, setColor]     = useState(group?.color || COLORS[0].color)
  const [errors, setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Nome é obrigatório'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const colorObj = COLORS.find(c => c.color === color) || COLORS[0]
    onSave({ name: name.trim(), description: desc.trim(), access, color: colorObj.color, colorBg: colorObj.bg })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{group ? 'Editar Grupo' : 'Novo Grupo'}</span>
          <button className="drawer-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Nome do Grupo</label>
            <input
              className={`form-input${errors.name ? ' error-input' : ''}`}
              style={{ padding: '0 12px' }}
              type="text"
              placeholder="Ex: Jurídico & Compliance"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              style={{
                width: '100%', height: 80, border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                fontSize: 13, fontFamily: 'inherit', resize: 'vertical',
                color: 'var(--text-primary)', outline: 'none',
              }}
              placeholder="Descreva o propósito deste grupo..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nível de Acesso</label>
            <select
              style={{
                width: '100%', height: 40, border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '0 12px',
                fontSize: 13, fontFamily: 'inherit', background: 'white',
                color: 'var(--text-primary)', outline: 'none',
              }}
              value={access}
              onChange={e => setAccess(e.target.value)}
            >
              {ACCESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Cor do Grupo</label>
            <div className="color-picker">
              {COLORS.map(c => (
                <div
                  key={c.color}
                  className={`color-swatch${color === c.color ? ' selected' : ''}`}
                  style={{ background: c.color }}
                  onClick={() => setColor(c.color)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {group ? 'Salvar Alterações' : 'Criar Grupo'}
          </button>
        </div>
      </div>
    </div>
  )
}
