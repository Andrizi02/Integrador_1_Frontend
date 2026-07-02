import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingCart, FiPackage, FiPlus, FiSettings } from 'react-icons/fi'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = [
    { to: '/', label: 'Inicio', icon: '🏠' },
    { to: '/products', label: 'Productos', icon: '🛒' },
  ]

  const isActive = (path) => location.pathname === path

  const navStyle = {
    background: scrolled 
      ? 'rgba(8, 28, 21, 0.97)' 
      : 'linear-gradient(135deg, #081c15 0%, #1b4332 50%, #2d6a4f 100%)',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.4s ease',
    boxShadow: scrolled 
      ? '0 10px 40px rgba(0,0,0,0.5)' 
      : '0 4px 20px rgba(0,0,0,0.25)',
  }

  const containerStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 clamp(0.8rem, 2vw, 1.5rem)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: isMobile ? '60px' : '72px',
    transition: 'height 0.3s ease',
  }

  const logoSize = isMobile ? '34px' : '44px'

  const linkStyle = (active) => ({
    color: active ? 'white' : 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '10px',
    fontWeight: 500,
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    whiteSpace: 'nowrap',
  })

  return (
    <>
      <nav style={navStyle}>
        <div style={containerStyle}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}>
            <div style={{
              width: logoSize,
              height: logoSize,
              background: 'linear-gradient(135deg, #52b788, #95d5b2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '1.1rem' : '1.4rem',
              animation: 'float 4s ease-in-out infinite',
              boxShadow: '0 4px 15px rgba(82,183,136,0.4)',
              flexShrink: 0,
            }}>🌱</div>
            <div>
              <div style={{
                color: 'white',
                fontWeight: 800,
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}>AgroConnect</div>
              {!isMobile && (
                <div style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}>Plataforma Agrícola</div>
              )}
            </div>
          </Link>

          {/* Desktop Menu */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              {/* Links principales */}
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={linkStyle(isActive(link.to))}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.12)'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.to)) {
                      e.target.style.background = 'transparent'
                      e.target.style.color = 'rgba(255,255,255,0.75)'
                    }
                  }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {/* Pedidos - visible para usuarios autenticados */}
              {isAuthenticated && (
                <Link
                  to="/orders"
                  style={linkStyle(isActive('/orders'))}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.12)'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    if (!isActive('/orders')) {
                      e.target.style.background = 'transparent'
                      e.target.style.color = 'rgba(255,255,255,0.75)'
                    }
                  }}
                >
                  <FiPackage size={14} />
                  Pedidos
                </Link>
              )}

              {/* Publicar - solo productores */}
              {user?.rol === 'productor' && (
                <Link
                  to="/register-product"
                  style={linkStyle(isActive('/register-product'))}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.12)'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    if (!isActive('/register-product')) {
                      e.target.style.background = 'transparent'
                      e.target.style.color = 'rgba(255,255,255,0.75)'
                    }
                  }}
                >
                  <FiPlus size={14} />
                  Publicar
                </Link>
              )}

              {/* Admin - solo administradores */}
              {(user?.rol === 'admin' || user?.rol === 'administrador') && (
                <Link
                  to="/admin"
                  style={linkStyle(isActive('/admin'))}
                  onMouseEnter={e => {
                    e.target.style.background = 'rgba(255,255,255,0.12)'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={e => {
                    if (!isActive('/admin')) {
                      e.target.style.background = 'transparent'
                      e.target.style.color = 'rgba(255,255,255,0.75)'
                    }
                  }}
                >
                  <FiSettings size={14} />
                  Admin
                </Link>
              )}

              {/* Separador */}
              <div style={{
                width: '1px',
                height: '24px',
                background: 'rgba(255,255,255,0.2)',
                margin: '0 0.3rem',
              }} />

              {/* Usuario autenticado */}
              {isAuthenticated ? (
                <>
                  {/* Info del usuario */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '0.85rem',
                  }}>
                    <FiUser size={14} />
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user?.nombre || user?.email?.split('@')[0]}
                    </span>
                    <span style={{
                      background: (user?.rol === 'admin' || user?.rol === 'administrador') ? '#8b5cf6' : user?.rol === 'productor' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {user?.rol}
                    </span>
                  </div>

                  {/* Botón cerrar sesión */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.7)'
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                    }}
                  >
                    <FiLogOut size={14} />
                    Salir
                  </button>
                </>
              ) : (
                /* Usuario NO autenticado */
                <>
                  <Link
                    to="/login"
                    style={{
                      ...linkStyle(isActive('/login')),
                      border: '2px solid rgba(255,255,255,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'rgba(255,255,255,0.1)'
                      e.target.style.borderColor = 'rgba(255,255,255,0.5)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'transparent'
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)'
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      ...linkStyle(isActive('/register')),
                      background: 'linear-gradient(135deg, #52b788, #95d5b2)',
                      color: '#081c15',
                      fontWeight: 700,
                      boxShadow: '0 4px 15px rgba(82,183,136,0.4)',
                    }}
                    onMouseEnter={e => {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 25px rgba(82,183,136,0.6)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 4px 15px rgba(82,183,136,0.4)'
                    }}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menú de navegación"
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                transition: 'transform 0.3s ease',
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                zIndex: 1001,
              }}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && (
          <div style={{
            maxHeight: isOpen ? '600px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
            background: 'rgba(8, 28, 21, 0.99)',
            backdropFilter: 'blur(20px)',
            borderTop: isOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            <div style={{ padding: '0.8rem 1rem' }}>
              {/* Links principales */}
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    ...linkStyle(isActive(link.to)),
                    padding: '0.75rem 1rem',
                    marginBottom: '0.2rem',
                    fontSize: '0.95rem',
                  }}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              {/* Pedidos móvil */}
              {isAuthenticated && (
                <Link
                  to="/orders"
                  style={{
                    ...linkStyle(isActive('/orders')),
                    padding: '0.75rem 1rem',
                    marginBottom: '0.2rem',
                    fontSize: '0.95rem',
                  }}
                >
                  <FiPackage size={16} />
                  Pedidos
                </Link>
              )}

              {/* Publicar móvil */}
              {user?.rol === 'productor' && (
                <Link
                  to="/register-product"
                  style={{
                    ...linkStyle(isActive('/register-product')),
                    padding: '0.75rem 1rem',
                    marginBottom: '0.2rem',
                    fontSize: '0.95rem',
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                >
                  <FiPlus size={16} />
                  Publicar Producto
                </Link>
              )}

              {/* Admin móvil */}
              {(user?.rol === 'admin' || user?.rol === 'administrador') && (
                <Link
                  to="/admin"
                  style={{
                    ...linkStyle(isActive('/admin')),
                    padding: '0.75rem 1rem',
                    marginBottom: '0.2rem',
                    fontSize: '0.95rem',
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                >
                  <FiSettings size={16} />
                  Panel Admin
                </Link>
              )}

              {/* Usuario info móvil */}
              {isAuthenticated ? (
                <div style={{ marginTop: '0.8rem', padding: '0 0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1rem',
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    color: 'white',
                    marginBottom: '0.5rem',
                  }}>
                    <FiUser size={16} />
                    <span>{user?.nombre || user?.email?.split('@')[0]}</span>
                    <span style={{
                      background: (user?.rol === 'admin' || user?.rol === 'administrador') ? '#8b5cf6' : user?.rol === 'productor' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      marginLeft: 'auto',
                    }}>
                      {user?.rol}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.7rem',
                      background: 'rgba(239,68,68,0.2)',
                      color: 'white',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    <FiLogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                  marginTop: '0.8rem',
                  padding: '0 0.5rem',
                }}>
                  <Link
                    to="/login"
                    style={{
                      textAlign: 'center',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    style={{
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #52b788, #95d5b2)',
                      color: '#081c15',
                      textDecoration: 'none',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para cerrar menú móvil al hacer clic fuera */}
      {isOpen && isMobile && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 999,
            animation: 'fadeIn 0.3s ease',
          }}
        />
      )}
    </>
  )
}

export default Navbar