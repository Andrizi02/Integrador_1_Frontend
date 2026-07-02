import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../api/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = apiService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const result = await apiService.login(email, password)
    
    if (result.success) {
      setUser({
        id: result.data.id,
        nombre: result.data.nombre,
        email: result.data.email,
        rol: result.data.rol,
        token: result.data.token,
      })
    }
    
    return result
  }

  const register = async (userData) => {
    const result = await apiService.register(userData)
    return result
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated: !!user,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}