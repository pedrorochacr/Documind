import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function deriveName(email) {
  const local = email.split('@')[0]
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

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
    const name = deriveName(email)
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join('')
    const userData = {
      id: Date.now(),
      name,
      email,
      role: 'Colaborador',
      initials,
    }
    setUser(userData)
    localStorage.setItem('documind_user', JSON.stringify(userData))
    return { success: true }
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
