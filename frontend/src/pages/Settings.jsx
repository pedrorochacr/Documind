import { useState } from 'react'
import { User, Lock, Bell, Shield, Database, Palette } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { id: 'profile',        label: 'Perfil',        Icon: User },
  { id: 'security',       label: 'Segurança',      Icon: Lock },
  { id: 'notifications',  label: 'Notificações',   Icon: Bell },
  { id: 'permissions',    label: 'Permissões',     Icon: Shield },
  { id: 'storage',        label: 'Armazenamento',  Icon: Database },
  { id: 'appearance',     label: 'Aparência',      Icon: Palette },
]

function Toggle({ on, onChange }) {
  return (
    <button
      className={`toggle${on ? ' on' : ''}`}
      onClick={() => onChange(!on)}
      aria-checked={on}
      role="switch"
    />
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [section, setSection] = useState('profile')
  const [notifs, setNotifs] = useState({ email: true, upload: true, comments: false, security: true })
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p className="page-subtitle">Gerencie suas preferências e configurações da conta.</p>
      </div>

      <div className="settings-grid">
        <div className="settings-nav">
          {NAV.map(({ id, label, Icon }) => (
            <div
              key={id}
              className={`settings-nav-item${section === id ? ' active' : ''}`}
              onClick={() => setSection(id)}
            >
              <Icon size={15} />
              {label}
            </div>
          ))}
        </div>

        <div className="settings-content">
          {section === 'profile' && (
            <>
              <div className="settings-section-title">Informações do Perfil</div>
              <div className="settings-section-desc">Atualize seus dados pessoais e informações de contato.</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, fontWeight: 700 }}>
                  {user?.initials || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.role}</div>
                  <button className="btn-link" style={{ fontSize: 12, marginTop: 4 }}>Alterar foto</button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome Completo</label>
                <input className="form-input" style={{ padding: '0 12px' }} type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">E-mail Corporativo</label>
                <input className="form-input" style={{ padding: '0 12px' }} type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Cargo / Função</label>
                <input className="form-input" style={{ padding: '0 12px' }} type="text" defaultValue={user?.role} />
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={handleSave}>
                  {saved ? 'Salvo!' : 'Salvar Alterações'}
                </button>
                <button className="btn btn-secondary">Cancelar</button>
              </div>
            </>
          )}

          {section === 'notifications' && (
            <>
              <div className="settings-section-title">Notificações</div>
              <div className="settings-section-desc">Escolha como e quando deseja receber alertas do sistema.</div>

              {[
                { key: 'email',    label: 'Notificações por E-mail',    desc: 'Receba resumos de atividades no seu e-mail corporativo.' },
                { key: 'upload',   label: 'Novos Uploads',              desc: 'Seja notificado quando novos documentos forem adicionados.' },
                { key: 'comments', label: 'Comentários e Revisões',     desc: 'Alertas sobre comentários em documentos que você gerencia.' },
                { key: 'security', label: 'Alertas de Segurança',       desc: 'Notificações sobre acessos e atividades suspeitas.' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="settings-row">
                  <div className="settings-row-info">
                    <div className="settings-row-label">{label}</div>
                    <div className="settings-row-desc">{desc}</div>
                  </div>
                  <Toggle on={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} />
                </div>
              ))}
            </>
          )}

          {section === 'security' && (
            <>
              <div className="settings-section-title">Segurança da Conta</div>
              <div className="settings-section-desc">Gerencie sua senha e configurações de autenticação.</div>

              <div className="settings-row">
                <div className="settings-row-info">
                  <div className="settings-row-label">Alterar Senha</div>
                  <div className="settings-row-desc">Recomendamos senhas com no mínimo 12 caracteres.</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}>Alterar</button>
              </div>
              <div className="settings-row">
                <div className="settings-row-info">
                  <div className="settings-row-label">Autenticação em Dois Fatores</div>
                  <div className="settings-row-desc">Adicione uma camada extra de segurança à sua conta.</div>
                </div>
                <Toggle on={false} onChange={() => {}} />
              </div>
              <div className="settings-row">
                <div className="settings-row-info">
                  <div className="settings-row-label">Sessões Ativas</div>
                  <div className="settings-row-desc">Gerencie os dispositivos com acesso à sua conta.</div>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}>Ver sessões</button>
              </div>
            </>
          )}

          {(section === 'permissions' || section === 'storage' || section === 'appearance') && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>Em desenvolvimento</div>
              <div style={{ fontSize: 13 }}>Esta seção estará disponível em breve.</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
