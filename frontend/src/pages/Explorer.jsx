import { useState, useRef } from 'react'
import {
  CloudUpload, List, LayoutGrid, ChevronRight,
  FileText, FileSpreadsheet, Image, Folder, File,
  MoreHorizontal, ArrowUpDown,
} from 'lucide-react'
import { FILES, FOLDERS, formatDate } from '../data/mockData'
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

export default function Explorer() {
  const [view, setView]           = useState('list')
  const [filter, setFilter]       = useState('all')
  const [dragging, setDragging]   = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [toast, setToast]         = useState(null)
  const [files, setFiles]         = useState(FILES)
  const fileInputRef              = useRef()

  const showToast = (msg, type = '') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    if (dropped.length) showToast(`${dropped.length} arquivo(s) adicionado(s) com sucesso!`, 'success')
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
    ? ['Arquivo Digital', currentFolder.name]
    : ['Arquivo Digital']

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Explorador</h1>
          </div>
          <div className="view-toggle">
            <button className={`view-toggle-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
              <List size={14} />
            </button>
            <button className={`view-toggle-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')}>
              <LayoutGrid size={14} />
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
                <th style={{ width: '40%' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Nome <ArrowUpDown size={11} style={{ opacity: 0.5 }} />
                  </span>
                </th>
                <th>Data de modificação</th>
                <th>Tamanho</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!currentFolder && filter !== 'folder' && FOLDERS.filter(() => filter === 'all').map(folder => (
                <tr key={folder.id} onClick={() => setCurrentFolder(folder)}>
                  <td>
                    <div className="file-name-cell">
                      <div className="file-type-badge file-badge-folder"><Folder size={14} /></div>
                      <div className="file-name-info">
                        <div className="file-name-main">{folder.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{folder.modified}</td>
                  <td>—</td>
                  <td>
                    <button className="action-btn"><MoreHorizontal size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.filter(f => !f.parent).map(file => (
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
                  <td>{formatDate(file.modified)}</td>
                  <td>{file.size || '—'}</td>
                  <td>
                    <button className="action-btn" onClick={e => { e.stopPropagation(); setSelectedFile(file) }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="empty-state-text">Nenhum arquivo encontrado</div>
                      <div className="empty-state-sub">Tente outro filtro ou faça upload de um arquivo.</div>
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
            <div
              key={folder.id}
              className="file-grid-card"
              onClick={() => setCurrentFolder(folder)}
            >
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

      {toast && (
        <div className={`upload-toast${toast.type === 'success' ? ' toast-success' : ''}`}>
          {toast.msg}
        </div>
      )}
    </>
  )
}
