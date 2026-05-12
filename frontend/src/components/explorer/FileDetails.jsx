import { X, Download, Trash2, FileText, Image, FileSpreadsheet, File } from 'lucide-react'
import { formatDate } from '../../data/mockData'

const TYPE_CONFIG = {
  pdf:    { label: 'DOCUMENTO PDF',  cls: 'file-badge-pdf',    Icon: FileText },
  doc:    { label: 'DOCUMENTO WORD', cls: 'file-badge-doc',    Icon: FileText },
  xls:    { label: 'PLANILHA',       cls: 'file-badge-xls',    Icon: FileSpreadsheet },
  img:    { label: 'IMAGEM',         cls: 'file-badge-img',    Icon: Image },
  folder: { label: 'PASTA',          cls: 'file-badge-folder', Icon: File },
}

export default function FileDetails({ file, onClose, onDelete }) {
  if (!file) return null
  const cfg = TYPE_CONFIG[file.type] || { label: 'ARQUIVO', cls: 'file-badge-other', Icon: File }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">Detalhes do Arquivo</span>
          <button className="drawer-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="drawer-body">
          <div className="drawer-preview">
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className={`file-type-badge ${cfg.cls}`} style={{ width: 52, height: 52, margin: '0 auto 8px', fontSize: 12, borderRadius: 10 }}>
                {file.type.toUpperCase()}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pré-visualização não disponível</div>
            </div>
          </div>

          <div className="drawer-file-type">
            <div className={`file-type-badge ${cfg.cls}`} style={{ width: 20, height: 20, fontSize: 8, borderRadius: 4 }}>
              {file.type.toUpperCase()}
            </div>
            {cfg.label}
          </div>

          <div className="drawer-file-name">{file.name}</div>

          <div className="drawer-meta">
            <div className="meta-row">
              <span className="meta-label">Tamanho</span>
              <span className="meta-value">{file.size}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Criado em</span>
              <span className="meta-value" style={{ lineHeight: 1.4 }}>
                {new Date(file.created).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                <br />
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                  {new Date(file.created).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Modificado em</span>
              <span className="meta-value" style={{ lineHeight: 1.4 }}>
                {formatDate(file.modified)}
              </span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Proprietário</span>
              <span className="meta-value">
                <span className="meta-value-owner">
                  <span className="meta-avatar">{file.owner?.charAt(0)}</span>
                  {file.owner}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn-download">
            <Download size={15} />
            Download
          </button>
          <button className="btn-delete" onClick={() => onDelete && onDelete(file)}>
            <Trash2 size={15} />
            Excluir
          </button>
        </div>
      </div>
    </>
  )
}
