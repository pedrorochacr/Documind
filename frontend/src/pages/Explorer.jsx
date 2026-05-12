import { useState, useRef } from 'react'
import {
  CloudUpload, List, LayoutGrid, ChevronRight,
  Folder, MoreHorizontal, ArrowUpDown, Plus, X,
  FileText, FileSpreadsheet, Image as ImageIcon,
} from 'lucide-react'
import { FILES, FOLDERS, GROUPS, formatDate } from '../data/mockData'
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
  { id: 'all',    label: 'Todos',  dot: null },
  { id: 'pdf',    label: 'PDF',    dot: '#dc2626' },
  { id: 'img',    label: 'Imagem', dot: '#7c3aed' },
  { id: 'doc',    label: 'Doc',    dot: '#2563eb' },
  { id: 'folder', label: 'Pastas', dot: '#d97706' },
]

function NewDocumentModal({ onClose, onSave }) {
  const [docName, setDocName]   = useState('')
  const [docType, setDocType]   = useState('pdf')
  const [group, setGroup]       = useState(GROUPS[0].name)
  const [desc, setDesc]         = useState('')
  const [errors, setErrors]     = useState({})
  const fileRef                 = useRef()
  const [pickedFile, setPickedFile] = useState(null)

  const TypeIcon = { pdf: FileText, doc: FileText, xls: FileSpreadsheet, img: ImageIcon }[docType] || FileText

  const handleCreate = () => {
    const e = {}
    if (!docName.trim()) e.name = 'Nome é obrigatório'
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({
      id: Date.now(),
      name: `${docName.trim()}.${docType}`,
      type: docType,
      group,
      size: pickedFile ? `${(pickedFile.size / 1048576).toFixed(1)} MB` : '0 KB',
      modified: new Date().toISOString(),
      modifiedBy: 'Você',
      created: new Date().toISOString(),
      owner: 'Você',
      status: 'Em Revisão',
      path: ['Arquivo Digital'],
    })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Novo Documento</span>
          <button className="drawer-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          {/* Upload area */}
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
                  if (['pdf'].includes(ext)) setDocType('pdf')
                  else if (['doc', 'docx'].includes(ext)) setDocType('doc')
                  else if (['xls', 'xlsx'].includes(ext)) setDocType('xls')
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
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Selecionar arquivo
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  ou arraste aqui para upload
                </div>
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
                value={group}
                onChange={e => setGroup(e.target.value)}
              >
                {GROUPS.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opcional)</span></label>
            <textarea
              style={{ width: '100%', height: 70, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', color: 'var(--text-primary)', outline: 'none' }}
              placeholder="Descreva o documento..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={14} /> Criar Documento
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Explorer() {
  const [view, setView]               = useState('list')
  const [filter, setFilter]           = useState('all')
  const [dragging, setDragging]       = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [toast, setToast]             = useState(null)
  const [files, setFiles]             = useState(FILES)
  const [showNewModal, setShowNewModal] = useState(false)
  const fileInputRef                  = useRef()

  const showToast = (msg, type = '') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) showToast(`${dropped.length} arquivo(s) adicionado(s)!`, 'success')
  }

  const handleFileInput = (e) => {
    const picked = Array.from(e.target.files)
    if (picked.length) showToast(`${picked.length} arquivo(s) adicionado(s)!`, 'success')
  }

  const handleDelete = (file) => {
    if (window.confirm(`Excluir "${file.name}"?`)) {
      setFiles(prev => prev.filter(f => f.id !== file.id))
      setSelectedFile(null)
      showToast('Arquivo excluído.')
    }
  }

  const handleNewDoc = (newFile) => {
    setFiles(prev => [newFile, ...prev])
    setShowNewModal(false)
    showToast(`"${newFile.name}" criado com sucesso!`, 'success')
  }

  const folderFiles = currentFolder
    ? files.filter(f => f.path?.includes(currentFolder.name))
    : null

  const filtered = (() => {
    const list = folderFiles || files
    if (filter === 'all') return list
    if (filter === 'folder') return FOLDERS
    return list.filter(f => f.type === filter)
  })()

  const breadcrumbs = currentFolder
    ? ['Documind', currentFolder.name]
    : ['Documind']

  return (
    <>
      {/* Page header */}
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

      {/* Breadcrumbs */}
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

      {/* Drop Zone */}
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

      {/* Filters */}
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

      {/* File List */}
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
              {!currentFolder && filter === 'all' && FOLDERS.map(folder => (
                <tr key={folder.id} onClick={() => setCurrentFolder(folder)}>
                  <td>
                    <div className="file-name-cell">
                      <div className="file-type-badge file-badge-folder"><Folder size={14} /></div>
                      <div className="file-name-info">
                        <div className="file-name-main">{folder.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="col-hide-sm">{folder.modified}</td>
                  <td className="col-hide-sm">—</td>
                  <td>
                    <button className="action-btn"><MoreHorizontal size={14} /></button>
                  </td>
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
              {filtered.length === 0 && !currentFolder && (
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
          {!currentFolder && filter === 'all' && FOLDERS.map(folder => (
            <div key={folder.id} className="file-grid-card" onClick={() => setCurrentFolder(folder)}>
              <div className="file-grid-icon file-badge-folder">
                <Folder size={20} color="#d97706" />
              </div>
              <div className="file-grid-name">{folder.name}</div>
              <div className="file-grid-meta">{folder.modified}</div>
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
