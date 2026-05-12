import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight, Archive } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email) errs.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'E-mail inválido'
    if (!password) errs.password = 'Senha é obrigatória'
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const errs = validate()
    if (Object.keys(errs).length > 0) { setFieldErrors(errs); return }
    setFieldErrors({})
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <Archive size={20} color="#0f172a" />
            </div>
            <span className="auth-brand-name">Arquivo Digital</span>
          </div>

          <div className="auth-illustration">
            <div className="auth-illus-box">
              <div className="auth-illus-screen">
                <div className="auth-illus-line" style={{ gridColumn: '1 / -1', height: 8 }} />
                <div className="auth-illus-line" style={{ height: 40 }} />
                <div className="auth-illus-line" style={{ height: 40 }} />
                <div className="auth-illus-line" style={{ height: 20 }} />
                <div className="auth-illus-line" style={{ height: 20 }} />
              </div>
              <div style={{ width: 80, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }} />
            </div>
          </div>

          <div>
            <p className="auth-tagline">O cofre digital para os ativos corporativos.</p>
            <p className="auth-desc">Acesse, gerencie e audite documentos com segurança institucional e absoluta clareza operacional.</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Autenticação</h1>
          <p className="auth-subtitle">Insira suas credenciais corporativas.</p>

          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              <div>
                <div className="auth-error-title">Acesso Negado</div>
                <div className="auth-error-text">{error}</div>
              </div>
            </div>
          )}

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
                <a href="#" className="form-label-link" onClick={e => e.preventDefault()}>Esqueci minha senha</a>
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

          <div style={{ marginTop: 24, padding: '10px 14px', background: '#f8fafc', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo:</strong> admin@corporacao.com / admin123
          </div>
        </div>
      </div>
    </div>
  )
}
