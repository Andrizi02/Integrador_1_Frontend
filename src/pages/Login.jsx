import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiArrowRight, FiUser, FiShield } from 'react-icons/fi'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const emailRef = useRef(null)
  
  const [form, setForm] = useState({ email: '', password: '', role: 'comprador' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  useEffect(() => {
    let timer
    if (isLocked && lockTimer > 0) {
      timer = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            setLoginAttempts(0)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, lockTimer])

  const validateField = (field, value) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'El correo electrónico es requerido'
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = 'Ingresa un correo electrónico válido'
        } else {
          delete newErrors.email
        }
        break

      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida'
        } else if (value.length < 3) {
          newErrors.password = 'La contraseña debe tener al menos 3 caracteres'
        } else {
          delete newErrors.password
        }
        break
    }

    setErrors(newErrors)
    return !newErrors[field]
  }

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setForm({ ...form, [field]: value })
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field) => () => {
    setTouched({ ...touched, [field]: true })
    setFocusedField(null)
    validateField(field, form[field])
  }

  const handleFocus = (field) => () => {
    setFocusedField(field)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLocked) {
      setToast({ 
        message: `⏳ Demasiados intentos. Espera ${lockTimer} segundos`, 
        type: 'warning' 
      })
      return
    }

    // Marcar todos como tocados
    setTouched({ email: true, password: true })

    // Validar todos los campos
    const isEmailValid = validateField('email', form.email)
    const isPasswordValid = validateField('password', form.password)

    if (!isEmailValid || !isPasswordValid) {
      setToast({ message: 'Por favor corrige los errores antes de continuar', type: 'warning' })
      return
    }

    setLoading(true)
    
    try {
      const result = await login(form.email, form.password)

      if (result.success) {
        const { data } = result
        
        setToast({ message: `✅ ¡Bienvenido, ${data.nombre || 'Usuario'}!`, type: 'success' })
        
        setTimeout(() => {
          switch (data.rol) {
            case 'admin':
            case 'administrador':
              navigate('/admin')
              break
            case 'productor':
              navigate('/register-product')
              break
            default:
              navigate('/products')
          }
        }, 1200)
      } else {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)

        if (newAttempts >= 5) {
          setIsLocked(true)
          setLockTimer(30)
          setToast({ 
            message: '🔒 Demasiados intentos fallidos. Espera 30 segundos', 
            type: 'error' 
          })
        } else {
          const remainingAttempts = 5 - newAttempts
          setToast({ 
            message: `❌ Credenciales inválidas. Te quedan ${remainingAttempts} intento${remainingAttempts !== 1 ? 's' : ''}`, 
            type: 'error' 
          })
        }
      }
    } catch (error) {
      setToast({ message: '❌ Error de conexión con el servidor', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { 
      value: 'comprador', 
      icon: '🧑‍🍳', 
      label: 'Comprador', 
      desc: 'Compro productos',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
    },
    { 
      value: 'productor', 
      icon: '🧑‍🌾', 
      label: 'Productor', 
      desc: 'Vendo mis cosechas',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)'
    },
    { 
      value: 'admin', 
      icon: '👨‍💼', 
      label: 'Admin', 
      desc: 'Gestiono la plataforma',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)'
    },
  ]

  const isFormValid = form.email && form.password && !errors.email && !errors.password

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: 'clamp(1rem, 3vw, 2rem)',
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 'clamp(1rem, 2vw, 1.5rem)',
          right: 'clamp(1rem, 2vw, 1.5rem)',
          background: toast.type === 'success' 
            ? '#d1fae5' 
            : toast.type === 'error' 
              ? '#fee2e2' 
              : '#fef3c7',
          color: toast.type === 'success' 
            ? '#065f46' 
            : toast.type === 'error' 
              ? '#991b1b' 
              : '#92400e',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          fontWeight: 600,
          fontSize: '0.9rem',
          zIndex: 3000,
          animation: 'slideInRight 0.4s ease',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          maxWidth: 'min(450px, 90vw)',
          border: '1px solid',
          borderColor: toast.type === 'success' 
            ? '#a7f3d0' 
            : toast.type === 'error' 
              ? '#fecaca' 
              : '#fde68a',
        }}
        onClick={() => setToast(null)}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              marginLeft: 'auto',
              opacity: 0.6,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Card principal */}
      <div style={{
        background: 'white',
        borderRadius: '32px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '500px',
        overflow: 'hidden',
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255,255,255,0.5)',
      }}>
        {/* Header con gradiente */}
        <div style={{
          background: 'linear-gradient(135deg, #081c15 0%, #1b4332 30%, #2d6a4f 70%, #40916c 100%)',
          padding: 'clamp(2rem, 4vw, 3rem) 2rem',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Elementos decorativos */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -40,
            width: 180,
            height: 180,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 120,
            height: 120,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '10%',
            width: 8,
            height: 8,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
            animation: 'float 3s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '25%',
            left: '15%',
            width: 12,
            height: 12,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            animation: 'float 4s ease-in-out infinite 1s',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <div style={{
              width: 72,
              height: 72,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem',
              fontSize: '2rem',
              animation: 'float 4s ease-in-out infinite',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}>
              🌱
            </div>

            <h1 style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
              fontWeight: 800,
              marginBottom: '0.3rem',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
            }}>
              Iniciar Sesión
            </h1>
            <p style={{
              opacity: 0.75,
              fontSize: '0.9rem',
              fontWeight: 400,
              maxWidth: '280px',
              margin: '0 auto',
              lineHeight: 1.5,
            }}>
              Accede a tu cuenta para gestionar tus productos y pedidos
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}>
          {/* Email */}
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.88rem',
            }}>
              <FiMail size={14} color={focusedField === 'email' ? '#52b788' : '#9ca3af'} />
              Correo Electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <input
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                onFocus={handleFocus('email')}
                onBlur={handleBlur('email')}
                placeholder="usuario@agroconnect.pe"
                disabled={isLocked}
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '0.95rem 3rem 0.95rem 1.2rem',
                  border: errors.email && touched.email
                    ? '2px solid #ef4444'
                    : focusedField === 'email'
                      ? '2px solid #52b788'
                      : '2px solid #e5e7eb',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: isLocked ? '#f9fafb' : focusedField === 'email' ? '#fafdfb' : 'white',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Poppins", sans-serif',
                  boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(82,183,136,0.08)' : 'none',
                  opacity: isLocked ? 0.6 : 1,
                  cursor: isLocked ? 'not-allowed' : 'text',
                }}
              />
              <div style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
              }}>
                {touched.email && !errors.email && form.email && (
                  <FiCheckCircle color="#10b981" size={18} style={{ animation: 'scaleIn 0.3s ease' }} />
                )}
                {errors.email && touched.email && (
                  <FiAlertCircle color="#ef4444" size={18} style={{ animation: 'scaleIn 0.3s ease' }} />
                )}
              </div>
            </div>
            {errors.email && touched.email && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.78rem',
                marginTop: '0.4rem',
                paddingLeft: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                animation: 'fadeIn 0.3s ease',
              }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '1.3rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.5rem',
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.88rem',
            }}>
              <FiLock size={14} color={focusedField === 'password' ? '#52b788' : '#9ca3af'} />
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                onFocus={handleFocus('password')}
                onBlur={handleBlur('password')}
                placeholder="Ingresa tu contraseña"
                disabled={isLocked}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.95rem 3rem 0.95rem 1.2rem',
                  border: errors.password && touched.password
                    ? '2px solid #ef4444'
                    : focusedField === 'password'
                      ? '2px solid #52b788'
                      : '2px solid #e5e7eb',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: isLocked ? '#f9fafb' : focusedField === 'password' ? '#fafdfb' : 'white',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Poppins", sans-serif',
                  boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(82,183,136,0.08)' : 'none',
                  opacity: isLocked ? 0.6 : 1,
                  cursor: isLocked ? 'not-allowed' : 'text',
                  letterSpacing: showPassword ? '0' : '2px',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  padding: '0.5rem',
                  color: showPassword ? '#52b788' : '#9ca3af',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p style={{
                color: '#ef4444',
                fontSize: '0.78rem',
                marginTop: '0.4rem',
                paddingLeft: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                animation: 'fadeIn 0.3s ease',
              }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Roles */}
          <div style={{ marginBottom: '1.8rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.6rem',
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.88rem',
            }}>
              <FiUser size={14} color="#6b7280" />
              Tipo de Usuario
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.6rem',
            }}>
              {roles.map(role => {
                const isActive = form.role === role.value
                return (
                  <label
                    key={role.value}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.8rem 0.4rem',
                      border: isActive ? `2px solid ${role.color}` : '2px solid #e5e7eb',
                      borderRadius: '16px',
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      background: isActive ? `${role.color}08` : 'white',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                      boxShadow: isActive ? `0 6px 20px ${role.color}20` : 'none',
                      opacity: isLocked ? 0.5 : 1,
                    }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={isActive}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      disabled={isLocked}
                      style={{ display: 'none' }}
                    />
                    <span style={{
                      fontSize: '1.6rem',
                      transition: 'transform 0.3s ease',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    }}>
                      {role.icon}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isActive ? role.color : '#6b7280',
                    }}>
                      {role.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Contador de intentos */}
          {loginAttempts > 0 && !isLocked && (
            <div style={{
              padding: '0.7rem 1rem',
              background: '#fef3c7',
              borderRadius: '12px',
              marginBottom: '1.2rem',
              fontSize: '0.8rem',
              color: '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'fadeIn 0.3s ease',
            }}>
              <FiShield size={16} />
              Intento {loginAttempts} de 5
            </div>
          )}

          {/* Timer de bloqueo */}
          {isLocked && (
            <div style={{
              padding: '0.7rem 1rem',
              background: '#fee2e2',
              borderRadius: '12px',
              marginBottom: '1.2rem',
              fontSize: '0.8rem',
              color: '#991b1b',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              animation: 'pulse 1s ease infinite',
            }}>
              <FiAlertCircle size={16} />
              Cuenta bloqueada. Espera {lockTimer}s
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading || isLocked}
            style={{
              width: '100%',
              padding: '1.1rem',
              background: loading || isLocked
                ? '#d1d5db'
                : 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: loading || isLocked ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: loading || isLocked ? 'none' : '0 8px 30px rgba(45,106,79,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              letterSpacing: '0.3px',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (!loading && !isLocked) {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(45,106,79,0.45)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(45,106,79,0.3)'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 22,
                  height: 22,
                  border: '2.5px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Verificando credenciales...
              </>
            ) : isLocked ? (
              <>
                <FiShield size={18} />
                Cuenta Bloqueada ({lockTimer}s)
              </>
            ) : (
              <>
                <FiArrowRight size={18} />
                Iniciar Sesión
              </>
            )}
          </button>

          {/* Register link */}
          <p style={{
            textAlign: 'center',
            marginTop: '1.8rem',
            fontSize: '0.9rem',
            color: '#6b7280',
          }}>
            ¿No tienes una cuenta?{' '}
            <Link
              to="/register"
              style={{
                color: '#2d6a4f',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '0.3rem 0.6rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.background = '#f0fdf4'
                e.target.style.color = '#1b4332'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#2d6a4f'
              }}
            >
              Regístrate aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login