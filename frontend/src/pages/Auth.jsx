import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Archive } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Formato de e-mail inválido'
    if (!password) errs.password = 'Senha é obrigatória'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)
    await login(email, password)
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          {/* Logo */}
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Archive size={20} color="#0f172a" />
            </div>
            <span className="auth-brand-name">Documind</span>
          </div>

          {/* Monitor illustration */}
          <div className="auth-illustration">
            <div className="auth-monitor-wrap">
              <div className="auth-monitor">
                <div className="auth-monitor-screen">
                  <div className="auth-monitor-bar" style={{ width: '60%' }} />
                  <div className="auth-monitor-row">
                    <div className="auth-monitor-block" style={{ width: '100%', height: 52, background: 'rgba(255,255,255,0.18)' }} />
                  </div>
                  <div className="auth-monitor-row">
                    <div className="auth-monitor-block" style={{ flex: 1, height: 30 }} />
                    <div className="auth-monitor-block" style={{ flex: 1, height: 30 }} />
                    <div className="auth-monitor-block" style={{ flex: 1, height: 30 }} />
                  </div>
                  <div className="auth-monitor-row">
                    <div className="auth-monitor-block" style={{ width: '80%', height: 10 }} />
                  </div>
                  <div className="auth-monitor-row">
                    <div className="auth-monitor-block" style={{ width: '60%', height: 10 }} />
                  </div>
                </div>
              </div>
              <div className="auth-monitor-stand" />
              <div className="auth-monitor-base" />
            </div>
          </div>

          {/* Tagline */}
          <div className="auth-tagline-block">
            <p className="auth-tagline">O cofre digital para os ativos corporativos.</p>
            <p className="auth-desc">Acesse, gerencie e audite documentos com segurança institucional e absoluta clareza operacional.</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        {/* Mobile logo (only visible on small screens) */}
        <div className="auth-mobile-brand">
          <div className="auth-brand-icon" style={{ background: '#0f172a' }}>
            <Archive size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Documind</span>
        </div>

        <div className="auth-form-container">
          <h1 className="auth-title">Autenticação</h1>
          <p className="auth-subtitle">Insira suas credenciais corporativas.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">E-mail de Acesso</label>
              <div className="input-wrapper">
                <span className="input-icon"><Mail size={15} /></span>
                <input
                  className={`form-input${fieldErrors.email ? ' error-input' : ''}`}
                  type="email"
                  placeholder="executivo@corporacao.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: undefined })) }}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Senha
                <a href="#" className="form-label-link" onClick={e => e.preventDefault()}>
                  Esqueci minha senha
                </a>
              </label>
              <div className="input-wrapper">
                <span className="input-icon"><Lock size={15} /></span>
                <input
                  className={`form-input has-right-icon${fieldErrors.password ? ' error-input' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: undefined })) }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Verificando...' : 'Entrar no Sistema'}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>

          <div className="auth-footer">
            Novo no sistema corporativo?{' '}
            <a href="#" onClick={e => e.preventDefault()}>Solicitar criação de conta</a>
          </div>
        </div>
      </div>
    </div>
  )
}
