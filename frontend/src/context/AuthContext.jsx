import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
  { id: 1, name: 'Admin', email: 'admin@corporacao.com', password: 'admin123', role: 'Administrador', initials: 'A' },
  { id: 2, name: 'João Silva', email: 'joao@corporacao.com', password: '123456', role: 'Gerente', initials: 'JS' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('documind_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = async (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      const { password: _, ...userData } = found
      setUser(userData)
      localStorage.setItem('documind_user', JSON.stringify(userData))
      return { success: true }
    }
    return {
      success: false,
      error: 'A senha fornecida está incorreta para este usuário. Verifique e tente novamente.',
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('documind_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
