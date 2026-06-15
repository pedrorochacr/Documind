import { useState, useRef, useEffect } from 'react'
import {
  CloudUpload, List, LayoutGrid, ChevronRight,
  Folder, MoreHorizontal, ArrowUpDown, Plus, X,
  FileText, FileSpreadsheet, Image as ImageIcon,
} from 'lucide-react'
import { api, normalizeDoc } from '../services/api'
import { formatDate } from '../data/mockData'
import FileDetails from '../components/explorer/FileDetails'

const TYPE_CONFIG = {
  pdf:    { label: 'PDF', cls: 'file-badge-pdf' },
  doc:    { label: 'DOC', cls: 'file-badge-doc' },
  xls:    { label: 'XLS', cls: 'file-badge-xls' },
  img:    { label: 'IMG', cls: 'file-badge-img' },
  folder: { label: '📁',  cls: 'file-badge-folder' },
}

const STATUS_MAP = {
  'Aprovado':   'badge-green',
  'Em Revisão': 'badge-yellow',
  'Rescindido': 'badge-red',
}

const FILTERS = [
  { id: 'all',      label: 'Todos',         dot: null },
  { id: 'pdf',      label: 'PDF',           dot: '#dc2626' },
  { id: 'doc',      label: 'Documentos',    dot: '#2563eb' },
  { id: 'xls',      label: 'Planilhas',     dot: '#16a34a' },
  { id: 'slide',    label: 'Apresentações', dot: '#ea580c' },
  { id: 'txt',      label: 'Texto',         dot: '#64748b' },
  { id: 'img',      label: 'Imagens',       dot: '#7c3aed' },
  { id: 'video',    label: 'Vídeos',        dot: '#db2777' },
  { id: 'audio',    label: 'Áudios',        dot: '#0891b2' },
  { id: 'code',     label: 'Código',        dot: '#0f172a' },
  { id: 'json',     label: 'JSON/XML',      dot: '#14b8a6' },
  { id: 'zip',      label: 'Compactados',   dot: '#ca8a04' },
  { id: 'folder',   label: 'Pastas',        dot: '#d97706' },
  { id: 'other',    label: 'Outros',        dot: '#6b7280' },
]

function NewDocumentModal({ groups, onClose, onSave }) {
  const [docName, setDocName]       = useState('')
  const [docType, setDocType]       = useState('pdf')
  const [groupId, setGroupId]       = useState(groups[0]?.id || '')
  const [errors, setErrors]         = useState({})
  const [uploading, setUploading]   = useState(false)
  const fileRef                     = useRef()
  const [pickedFile, setPickedFile] = useState(null)

  const TypeIcon = { pdf: FileText, doc: FileText, xls: FileSpreadsheet, img: ImageIcon }[docType] || FileText

  const handleCreate = async () => {
    const e = {}
    if (!docName.trim()) e.name = 'Nome é obrigatório'
    if (Object.keys(e).length) { setErrors(e); return }

    const formData = new FormData()
    if (pickedFile) formData.append('file', pickedFile)
    formData.append('name', `${docName.trim()}.${docType}`)
    if (groupId) formData.append('groupId', groupId)
    formData.append('status', 'Em Revisão')

    setUploading(true)
    try {
      await onSave(formData)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Novo Documento</span>
          <button className="drawer-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <div
            style={{
              border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
              padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
              background: '#fafbfc', marginBottom: 16, transition: 'border-color 0.15s',
            }}
            onClick={() => fileRef.current?.click()}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <input
              ref={fileRef} type="file" hidden
              onChange={e => {
                const f = e.target.files[0]
                if (f) {
                  setPickedFile(f)
                  if (!docName) setDocName(f.name.replace(/\.[^.]+$/, ''))
                  const ext = f.name.split('.').pop().toLowerCase()
                  if (ext === 'pdf') setDocType('pdf')
                  else if (['doc', 'docx'].includes(ext)) setDocType('doc')
                  else if (['xls', 'xlsx', 'csv'].includes(ext)) setDocType('xls')
                  else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) setDocType('img')
                }
              }}
            />
            <CloudUpload size={24} color="var(--text-muted)" style={{ margin: '0 auto 6px' }} />
            {pickedFile ? (
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {pickedFile.name}
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  {(pickedFile.size / 1048576).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Selecionar arquivo</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ou arraste aqui para upload</div>
              </>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Nome do Documento</label>
            <input
              className={`form-input${errors.name ? ' error-input' : ''}`}
              style={{ padding: '0 12px' }}
              type="text"
              placeholder="Ex: Contrato_Prestacao_Servicos"
              value={docName}
              onChange={e => { setDocName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select
                style={{ width: '100%', height: 40, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', fontSize: 13, fontFamily: 'inherit', background: 'white', color: 'var(--text-primary)', outline: 'none' }}
                value={docType}
                onChange={e => setDocType(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="doc">Word (DOC)</option>
                <option value="xls">Excel (XLS)</option>
                <option value="img">Imagem</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Grupo</label>
              <select
                style={{ width: '100%', height: 40, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0 12px', fontSize: 13, fontFamily: 'inherit', background: 'white', color: 'var(--text-primary)', outline: 'none' }}
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
              >
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={uploading}>
            <Plus size={14} /> {uploading ? 'Enviando...' : 'Criar Documento'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Explorer() {
  const [view, setView]                   = useState('list')
  const [filter, setFilter]               = useState('all')
  const [dragging, setDragging]           = useState(false)
  const [selectedFile, setSelectedFile]   = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [toast, setToast]                 = useState(null)
  const [files, setFiles]                 = useState([])
  const [folders, setFolders]             = useState([])
  const [groups, setGroups]               = useState([])
  const [showNewModal, setShowNewModal]   = useState(false)
  const fileInputRef                      = useRef()

  useEffect(() => {
    api.get('/api/documents').then(docs => setFiles(docs.map(normalizeDoc))).catch(() => {})
    api.get('/api/folders').then(setFolders).catch(() => {})
    api.get('/api/groups').then(setGroups).catch(() => {})
  }, [])

  const showToast = (msg, type = '') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (!dropped.length) return
    let count = 0
    for (const f of dropped) {
      try {
        const formData = new FormData()
        formData.append('file', f)
        formData.append('name', f.name)
        formData.append('status', 'Em Revisão')
        const doc = await api.upload('/api/documents', formData)
        setFiles(prev => [normalizeDoc(doc), ...prev])
        count++
      } catch {}
    }
    if (count) showToast(`${count} arquivo(s) enviado(s)!`, 'success')
  }

  const handleFileInput = async (e) => {
    const picked = Array.from(e.target.files)
    if (!picked.length) return
    let count = 0
    for (const f of picked) {
      try {
        const formData = new FormData()
        formData.append('file', f)
        formData.append('name', f.name)
        formData.append('status', 'Em Revisão')
        const doc = await api.upload('/api/documents', formData)
        setFiles(prev => [normalizeDoc(doc), ...prev])
        count++
      } catch {}
    }
    if (count) showToast(`${count} arquivo(s) enviado(s)!`, 'success')
  }

  const handleDelete = async (file) => {
    if (!window.confirm(`Excluir "${file.name}"?`)) return
    await api.delete(`/api/documents/${file.id}`)
    setFiles(prev => prev.filter(f => f.id !== file.id))
    setSelectedFile(null)
    showToast('Arquivo excluído.')
  }

  const handleNewDoc = async (formData) => {
    const doc = await api.upload('/api/documents', formData)
    const normalized = normalizeDoc(doc)
    setFiles(prev => [normalized, ...prev])
    setShowNewModal(false)
    showToast(`"${normalized.name}" criado com sucesso!`, 'success')
  }

  const filtered = (() => {
    const list = currentFolder
      ? files.filter(f => f.folderId === currentFolder.id)
      : files
    if (filter === 'all') return list
    if (filter === 'folder') return []
    return list.filter(f => f.type === filter)
  })()

  const breadcrumbs = currentFolder ? ['Documind', currentFolder.name] : ['Documind']
  const showFolders = !currentFolder && filter === 'all'

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Explorador</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="view-toggle">
              <button className={`view-toggle-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
                <List size={14} />
              </button>
              <button className={`view-toggle-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')}>
                <LayoutGrid size={14} />
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowNewModal(true)}>
              <Plus size={14} />
              <span className="hide-xs">Novo Documento</span>
            </button>
          </div>
        </div>
      </div>

      {breadcrumbs.length > 1 && (
        <div className="breadcrumb">
          {breadcrumbs.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <span className="breadcrumb-sep"><ChevronRight size={12} /></span>}
              <span
                className={`breadcrumb-item${i === breadcrumbs.length - 1 ? ' active' : ''}`}
                onClick={() => i < breadcrumbs.length - 1 && setCurrentFolder(null)}
              >
                {b}
              </span>
            </span>
          ))}
        </div>
      )}

      {!currentFolder && (
        <div
          className={`dropzone${dragging ? ' dragging' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileInput} />
          <div className="dropzone-icon"><CloudUpload size={22} /></div>
          <div className="dropzone-text">Arraste arquivos aqui para upload</div>
          <div className="dropzone-subtext">ou clique para selecionar do seu computador</div>
        </div>
      )}

      <div className="file-filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-tab${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.dot && (
              <span className="filter-tab-dot" style={{ background: filter === f.id ? 'rgba(255,255,255,0.7)' : f.dot }} />
            )}
            {f.label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="files-table-wrap">
          <table className="files-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Nome <ArrowUpDown size={11} style={{ opacity: 0.5 }} />
                  </span>
                </th>
                <th className="col-hide-sm">Data de modificação</th>
                <th className="col-hide-sm">Tamanho</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {showFolders && folders.map(folder => (
                <tr key={folder.id} onClick={() => setCurrentFolder(folder)}>
                  <td>
                    <div className="file-name-cell">
                      <div className="file-type-badge file-badge-folder"><Folder size={14} /></div>
                      <div className="file-name-info">
                        <div className="file-name-main">{folder.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="col-hide-sm">{formatDate(folder.updatedAt)}</td>
                  <td className="col-hide-sm">—</td>
                  <td><button className="action-btn"><MoreHorizontal size={14} /></button></td>
                </tr>
              ))}
              {filtered.map(file => (
                <tr key={file.id} onClick={() => setSelectedFile(file)}>
                  <td>
                    <div className="file-name-cell">
                      <div className={`file-type-badge ${TYPE_CONFIG[file.type]?.cls || 'file-badge-other'}`}>
                        {TYPE_CONFIG[file.type]?.label || 'ARQ'}
                      </div>
                      <div className="file-name-info">
                        <div className="file-name-main">{file.name}</div>
                        <div className="file-name-sub">Editado por {file.modifiedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="col-hide-sm">{formatDate(file.modified)}</td>
                  <td className="col-hide-sm">{file.size || '—'}</td>
                  <td>
                    <button className="action-btn" onClick={e => { e.stopPropagation(); setSelectedFile(file) }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !showFolders && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-text">Nenhum arquivo encontrado</div>
                      <div className="empty-state-sub">Tente outro filtro ou clique em "Novo Documento".</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="files-grid">
          {showFolders && folders.map(folder => (
            <div key={folder.id} className="file-grid-card" onClick={() => setCurrentFolder(folder)}>
              <div className="file-grid-icon file-badge-folder">
                <Folder size={20} color="#d97706" />
              </div>
              <div className="file-grid-name">{folder.name}</div>
              <div className="file-grid-meta">{formatDate(folder.updatedAt)}</div>
            </div>
          ))}
          {filtered.map(file => {
            const cfg = TYPE_CONFIG[file.type] || {}
            return (
              <div
                key={file.id}
                className={`file-grid-card${selectedFile?.id === file.id ? ' selected' : ''}`}
                onClick={() => setSelectedFile(file)}
              >
                <div className={`file-grid-icon ${cfg.cls || 'file-badge-other'}`}>
                  <span style={{ fontWeight: 800, fontSize: 11 }}>{cfg.label || 'ARQ'}</span>
                </div>
                <div className="file-grid-name">{file.name}</div>
                <div className="file-grid-meta">{file.size} · {formatDate(file.modified)}</div>
                {file.status && (
                  <span className={`badge ${STATUS_MAP[file.status] || 'badge-gray'}`}>
                    {file.status}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {selectedFile && (
        <FileDetails
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDelete={handleDelete}
        />
      )}

      {showNewModal && (
        <NewDocumentModal
          groups={groups}
          onClose={() => setShowNewModal(false)}
          onSave={handleNewDoc}
        />
      )}

      {toast && (
        <div className={`upload-toast${toast.type === 'success' ? ' toast-success' : ''}`}>
          {toast.msg}
        </div>
      )}
    </>
  )
}
