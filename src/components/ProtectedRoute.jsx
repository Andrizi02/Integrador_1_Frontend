import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 'clamp(3rem, 8vw, 6rem) 1rem',
        animation: 'fadeIn 0.5s ease',
      }}>
        <div style={{ fontSize: 'clamp(4rem, 8vw, 6rem)', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ color: '#1b4332', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', marginBottom: '0.5rem' }}>
          Acceso Restringido
        </h1>
        <p style={{ color: '#6b7280', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', marginBottom: '2rem' }}>
          No tienes permisos para acceder a esta sección.
          {user?.rol === 'comprador' && ' Esta área es solo para productores o administradores.'}
          {(user?.rol === 'productor') && ' Esta área es solo para administradores.'}
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.9rem 2rem',
            background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
            color: 'white', border: 'none', borderRadius: '14px',
            fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
          }}
        >
          ← Volver
        </button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute