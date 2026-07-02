import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    ubicacion: '',
    rol: 'comprador',
  })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [step, setStep] = useState(1)

  const validateField = (field, value) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'nombre':
        if (!value.trim()) newErrors.nombre = 'El nombre es requerido'
        else if (value.trim().length < 2) newErrors.nombre = 'Mínimo 2 caracteres'
        else delete newErrors.nombre
        break

      case 'apellido':
        if (!value.trim()) newErrors.apellido = 'El apellido es requerido'
        else if (value.trim().length < 2) newErrors.apellido = 'Mínimo 2 caracteres'
        else delete newErrors.apellido
        break

      case 'email':
        if (!value.trim()) newErrors.email = 'El email es requerido'
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
          newErrors.email = 'Ingresa un email válido'
        else delete newErrors.email
        break

      case 'password':
        if (!value) newErrors.password = 'La contraseña es requerida'
        else if (value.length < 6) newErrors.password = 'Mínimo 6 caracteres'
        else delete newErrors.password
        if (form.confirmPassword && value !== form.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden'
        } else if (form.confirmPassword) {
          delete newErrors.confirmPassword
        }
        break

      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Confirma tu contraseña'
        else if (value !== form.password) newErrors.confirmPassword = 'Las contraseñas no coinciden'
        else delete newErrors.confirmPassword
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

  const handleFocus = (field) => () => setFocusedField(field)

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      const fields = ['nombre', 'apellido', 'email', 'password', 'confirmPassword']
      setTouched({ nombre: true, apellido: true, email: true, password: true, confirmPassword: true })
      let valid = true
      fields.forEach(f => {
        if (!validateField(f, form[f])) valid = false
      })
      return valid
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(1)) setStep(2)
  }

  const prevStep = () => setStep(1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step === 1) {
      nextStep()
      return
    }

    setLoading(true)

    const userData = {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      passwordHash: form.password,
      telefono: form.telefono,
      ubicacion: form.ubicacion,
      rol: form.rol,
    }

    const result = await register(userData)
    setLoading(false)

    if (result.success) {
      setToast({ message: '✅ ¡Registro exitoso! Redirigiendo al login...', type: 'success' })
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setToast({ message: result.message || '❌ Error al registrar', type: 'error' })
      setStep(1)
    }
  }

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.9rem 1.2rem',
    paddingRight: '2.5rem',
    border: errors[field] && touched[field]
      ? '2px solid #ef4444'
      : focusedField === field
        ? '2px solid #52b788'
        : '2px solid #e5e7eb',
    borderRadius: '14px',
    fontSize: '0.95rem',
    outline: 'none',
    background: focusedField === field ? '#fafdfb' : 'white',
    transition: 'all 0.3s ease',
    fontFamily: '"Poppins", sans-serif',
    boxShadow: focusedField === field ? '0 0 0 4px rgba(82,183,136,0.08)' : 'none',
  })

  const roles = [
    { value: 'comprador', icon: '🧑‍🍳', label: 'Comprador', color: '#3b82f6' },
    { value: 'productor', icon: '🧑‍🌾', label: 'Productor', color: '#10b981' },
  ]

  const progressPercent = step === 1 ? 50 : 100

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: 'clamp(1rem, 2vw, 2rem)',
    }}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: 'clamp(1rem, 2vw, 1.5rem)',
          right: 'clamp(1rem, 2vw, 1.5rem)',
          background: toast.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: toast.type === 'success' ? '#065f46' : '#991b1b',
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
        }}
        onClick={() => setToast(null)}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '1rem', marginLeft: 'auto', opacity: 0.6,
          }}>✕</button>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '28px',
        boxShadow: '0 25px 70px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '550px',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
          padding: '2rem',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: -40, right: -30,
            width: 120, height: 120,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
          }} />
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 60, height: 60,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 0.8rem',
              fontSize: '1.8rem',
              animation: 'float 3s ease-in-out infinite',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>🚀</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.2rem' }}>
              Crear Cuenta
            </h1>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
              Paso {step} de 2
            </p>

            {/* Progress */}
            <div style={{
              width: '100%', height: 4,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 10, marginTop: '1rem',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'white',
                borderRadius: 10,
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {step === 1 && (
            <div style={{ animation: 'fadeInRight 0.4s ease' }}>
              {/* Nombre y Apellido */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1rem', marginBottom: '1rem',
              }}>
                <div>
                  <label style={labelStyle}><FiUser size={12} /> Nombre *</label>
                  <input type="text" value={form.nombre}
                    onChange={handleChange('nombre')}
                    onFocus={handleFocus('nombre')}
                    onBlur={handleBlur('nombre')}
                    placeholder="Juan" style={inputStyle('nombre')} />
                  {errors.nombre && touched.nombre && (
                    <p style={errorStyle}>{errors.nombre}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}><FiUser size={12} /> Apellido *</label>
                  <input type="text" value={form.apellido}
                    onChange={handleChange('apellido')}
                    onFocus={handleFocus('apellido')}
                    onBlur={handleBlur('apellido')}
                    placeholder="Pérez" style={inputStyle('apellido')} />
                  {errors.apellido && touched.apellido && (
                    <p style={errorStyle}>{errors.apellido}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}><FiMail size={12} /> Email *</label>
                <input type="email" value={form.email}
                  onChange={handleChange('email')}
                  onFocus={handleFocus('email')}
                  onBlur={handleBlur('email')}
                  placeholder="usuario@email.com" style={inputStyle('email')} />
                {errors.email && touched.email && (
                  <p style={errorStyle}>{errors.email}</p>
                )}
              </div>

              {/* Contraseñas */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1rem', marginBottom: '1rem',
              }}>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}><FiLock size={12} /> Contraseña *</label>
                  <input type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange('password')}
                    onFocus={handleFocus('password')}
                    onBlur={handleBlur('password')}
                    placeholder="••••••" style={inputStyle('password')} />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={eyeBtnStyle}>
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  {errors.password && touched.password && (
                    <p style={errorStyle}>{errors.password}</p>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}><FiLock size={12} /> Confirmar *</label>
                  <input type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onFocus={handleFocus('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    placeholder="••••••" style={inputStyle('confirmPassword')} />
                  <button type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={eyeBtnStyle}>
                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p style={errorStyle}>{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: 'fadeInRight 0.4s ease' }}>
              {/* Teléfono */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1rem', marginBottom: '1rem',
              }}>
                <div>
                  <label style={labelStyle}><FiPhone size={12} /> Teléfono</label>
                  <input type="tel" value={form.telefono}
                    onChange={handleChange('telefono')}
                    onFocus={handleFocus('telefono')}
                    placeholder="+51 999 999 999" style={inputStyle('telefono')} />
                </div>
                <div>
                  <label style={labelStyle}><FiMapPin size={12} /> Ubicación</label>
                  <input type="text" value={form.ubicacion}
                    onChange={handleChange('ubicacion')}
                    onFocus={handleFocus('ubicacion')}
                    placeholder="Arequipa, Perú" style={inputStyle('ubicacion')} />
                </div>
              </div>

              {/* Rol */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Tipo de Usuario</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  {roles.map(role => {
                    const isActive = form.rol === role.value
                    return (
                      <label key={role.value} style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.9rem 1rem',
                        border: isActive ? `2px solid ${role.color}` : '2px solid #e5e7eb',
                        borderRadius: '14px', cursor: 'pointer',
                        background: isActive ? `${role.color}08` : 'white',
                        transition: 'all 0.3s ease',
                        transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      }}>
                        <input type="radio" name="rol" value={role.value}
                          checked={isActive}
                          onChange={e => setForm({...form, rol: e.target.value})}
                          style={{ display: 'none' }} />
                        <span style={{ fontSize: '1.5rem' }}>{role.icon}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isActive ? role.color : '#6b7280' }}>
                          {role.label}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Resumen */}
              <div style={{
                background: '#f0fdf4', padding: '1rem',
                borderRadius: '14px', marginBottom: '1rem',
                fontSize: '0.85rem', color: '#2d6a4f',
              }}>
                <p><strong>Nombre:</strong> {form.nombre} {form.apellido}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Rol:</strong> {form.rol === 'comprador' ? '🧑‍🍳 Comprador' : '🧑‍🌾 Productor'}</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {step === 2 && (
              <button type="button" onClick={prevStep} style={{
                flex: 1, padding: '1rem',
                background: '#f3f4f6', color: '#374151',
                border: 'none', borderRadius: '14px',
                fontWeight: 600, cursor: 'pointer', fontSize: '1rem',
              }}>← Anterior</button>
            )}
            <button type="submit" disabled={loading} style={{
              flex: step === 2 ? 1 : undefined,
              width: step === 1 ? '100%' : undefined,
              padding: '1rem 2rem',
              background: loading ? '#d1d5db' : 'linear-gradient(135deg, #2d6a4f, #40916c)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem', transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(45,106,79,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              {loading ? (
                <><span style={{
                  width: 20, height: 20,
                  border: '2.5px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} /> Registrando...</>
              ) : step === 1 ? (
                <>Siguiente <FiArrowRight /></>
              ) : (
                '🚀 Crear Cuenta'
              )}
            </button>
          </div>

          <p style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontSize: '0.9rem', color: '#6b7280',
          }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{
              color: '#2d6a4f', fontWeight: 700,
              textDecoration: 'none',
            }}>Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'flex', alignItems: 'center', gap: '0.3rem',
  marginBottom: '0.4rem', fontWeight: 600,
  color: '#374151', fontSize: '0.85rem',
}

const errorStyle = {
  color: '#ef4444', fontSize: '0.78rem',
  marginTop: '0.3rem', paddingLeft: '0.3rem',
  display: 'flex', alignItems: 'center', gap: '0.3rem',
  animation: 'fadeIn 0.3s ease',
}

const eyeBtnStyle = {
  position: 'absolute', right: '0.5rem', top: '2.2rem',
  background: 'none', border: 'none', cursor: 'pointer',
  padding: '0.5rem', color: '#9ca3af',
}

export default Register