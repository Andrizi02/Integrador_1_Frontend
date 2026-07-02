import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

const ProductRegistration = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precioUnitario: '',
    cantidadDisponible: '',
    ubicacion: '',
    idCategoria: '1',
    imagenUrl: '',
  })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const categorias = [
    { id: '1', nombre: 'Verduras', icono: '🥬' },
    { id: '2', nombre: 'Frutas', icono: '🍎' },
    { id: '3', nombre: 'Tubérculos', icono: '🥔' },
    { id: '4', nombre: 'Granos', icono: '🌾' },
    { id: '5', nombre: 'Lácteos', icono: '🥛' },
    { id: '6', nombre: 'Otros', icono: '📦' },
  ]

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!form.idCategoria) newErrors.idCategoria = 'Selecciona una categoría'
    if (!form.descripcion.trim()) newErrors.descripcion = 'La descripción es requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!form.cantidadDisponible || parseInt(form.cantidadDisponible) < 1) 
      newErrors.cantidadDisponible = 'Cantidad inválida'
    if (!form.precioUnitario || parseFloat(form.precioUnitario) < 0.01) 
      newErrors.precioUnitario = 'Precio inválido'
    if (!form.ubicacion.trim()) 
      newErrors.ubicacion = 'La ubicación es requerida'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const prevStep = () => {
    setStep(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateStep2()) return

    setLoading(true)

    // Simulamos guardar en localStorage como si fuera backend
    setTimeout(() => {
      const storedProducts = JSON.parse(localStorage.getItem('agroconnect_products') || '[]')
      
      const newProduct = {
        idProducto: Date.now(),
        nombre: form.nombre,
        descripcion: form.descripcion,
        precioUnitario: parseFloat(form.precioUnitario),
        cantidadDisponible: parseInt(form.cantidadDisponible),
        ubicacion: form.ubicacion,
        idCategoria: parseInt(form.idCategoria),
        imagenUrl: form.imagenUrl || '',
        categoria: categorias.find(c => c.id === form.idCategoria),
        productor: {
          idUsuario: user?.id || 2,
          nombre: user?.nombre || 'Productor',
          apellido: user?.apellido || '',
        },
        activo: true,
        fechaPublicacion: new Date().toISOString(),
      }

      storedProducts.push(newProduct)
      localStorage.setItem('agroconnect_products', JSON.stringify(storedProducts))
      
      // También guardamos en la lista de productos del sistema
      const systemProducts = JSON.parse(localStorage.getItem('agroconnect_system_products') || '[]')
      systemProducts.push(newProduct)
      localStorage.setItem('agroconnect_system_products', JSON.stringify(systemProducts))

      setLoading(false)
      setToast({ message: '✅ Producto publicado exitosamente', type: 'success' })
      
      setTimeout(() => {
        navigate('/products')
      }, 1500)
    }, 1000)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.9rem 1.2rem',
    border: '2px solid #e5e7eb',
    borderRadius: '14px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    background: 'white',
    fontFamily: 'Poppins, sans-serif',
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    color: '#374151',
    fontSize: '0.9rem',
  }

  const progressPercent = step === 1 ? 50 : 100

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{
        background: 'white',
        borderRadius: '28px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '600px',
        overflow: 'hidden',
        animation: 'fadeInUp 0.5s ease',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
          padding: '2rem',
          textAlign: 'center',
          color: 'white',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '1.8rem',
          }}>➕</div>
          <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.3rem' }}>
            Publicar Producto
          </h2>
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
            Paso {step} de 2
          </p>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            marginTop: '1.2rem',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#52b788',
              borderRadius: '10px',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', animation: 'scaleIn 0.4s ease' }}>
              <div style={{
                width: '70px',
                height: '70px',
                border: '4px solid #d1fae5',
                borderTopColor: '#10b981',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1.5rem',
              }} />
              <h3 style={{ color: '#1b4332', marginBottom: '0.5rem' }}>Publicando producto...</h3>
              <p style={{ color: '#6b7280' }}>Esto tomará solo un momento</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div style={{ animation: 'fadeInRight 0.4s ease' }}>
                  {/* Nombre */}
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={labelStyle}>Nombre del producto *</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={handleChange('nombre')}
                      placeholder="Ej: Papas Nativas"
                      style={{
                        ...inputStyle,
                        borderColor: errors.nombre ? '#ef4444' : '#e5e7eb',
                      }}
                      onFocus={e => e.target.style.borderColor = '#52b788'}
                      onBlur={e => e.target.style.borderColor = errors.nombre ? '#ef4444' : '#e5e7eb'}
                    />
                    {errors.nombre && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                        {errors.nombre}
                      </span>
                    )}
                  </div>

                  {/* Categoría */}
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={labelStyle}>Categoría *</label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.7rem',
                    }}>
                      {categorias.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setForm({ ...form, idCategoria: cat.id })}
                          style={{
                            padding: '0.9rem',
                            border: form.idCategoria === cat.id ? '2px solid #52b788' : '2px solid #e5e7eb',
                            borderRadius: '14px',
                            background: form.idCategoria === cat.id ? '#f0fdf4' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: form.idCategoria === cat.id ? '#1b4332' : '#6b7280',
                          }}
                        >
                          <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{cat.icono}</div>
                          {cat.nombre}
                        </button>
                      ))}
                    </div>
                    {errors.idCategoria && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                        {errors.idCategoria}
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={labelStyle}>Descripción *</label>
                    <textarea
                      value={form.descripcion}
                      onChange={handleChange('descripcion')}
                      placeholder="Describe tu producto, calidad, métodos de cultivo..."
                      rows={3}
                      style={{
                        ...inputStyle,
                        resize: 'vertical',
                        borderColor: errors.descripcion ? '#ef4444' : '#e5e7eb',
                      }}
                      onFocus={e => e.target.style.borderColor = '#52b788'}
                      onBlur={e => e.target.style.borderColor = errors.descripcion ? '#ef4444' : '#e5e7eb'}
                    />
                    {errors.descripcion && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>
                        {errors.descripcion}
                      </span>
                    )}
                  </div>

                  {/* Imagen URL */}
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={labelStyle}>URL de imagen (opcional)</label>
                    <input
                      type="text"
                      value={form.imagenUrl}
                      onChange={handleChange('imagenUrl')}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ animation: 'fadeInRight 0.4s ease' }}>
                  {/* Cantidad y Precio */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1.2rem',
                  }}>
                    <div>
                      <label style={labelStyle}>Cantidad disponible *</label>
                      <input
                        type="number"
                        value={form.cantidadDisponible}
                        onChange={handleChange('cantidadDisponible')}
                        placeholder="100"
                        min="1"
                        style={{
                          ...inputStyle,
                          borderColor: errors.cantidadDisponible ? '#ef4444' : '#e5e7eb',
                        }}
                        onFocus={e => e.target.style.borderColor = '#52b788'}
                        onBlur={e => e.target.style.borderColor = errors.cantidadDisponible ? '#ef4444' : '#e5e7eb'}
                      />
                      {errors.cantidadDisponible && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.cantidadDisponible}</span>
                      )}
                    </div>
                    <div>
                      <label style={labelStyle}>Precio (S/) *</label>
                      <input
                        type="number"
                        value={form.precioUnitario}
                        onChange={handleChange('precioUnitario')}
                        placeholder="2.50"
                        min="0.01"
                        step="0.01"
                        style={{
                          ...inputStyle,
                          borderColor: errors.precioUnitario ? '#ef4444' : '#e5e7eb',
                        }}
                        onFocus={e => e.target.style.borderColor = '#52b788'}
                        onBlur={e => e.target.style.borderColor = errors.precioUnitario ? '#ef4444' : '#e5e7eb'}
                      />
                      {errors.precioUnitario && (
                        <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.precioUnitario}</span>
                      )}
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Ubicación *</label>
                    <input
                      type="text"
                      value={form.ubicacion}
                      onChange={handleChange('ubicacion')}
                      placeholder="Ej: Arequipa - Cayma"
                      style={{
                        ...inputStyle,
                        borderColor: errors.ubicacion ? '#ef4444' : '#e5e7eb',
                      }}
                      onFocus={e => e.target.style.borderColor = '#52b788'}
                      onBlur={e => e.target.style.borderColor = errors.ubicacion ? '#ef4444' : '#e5e7eb'}
                    />
                    {errors.ubicacion && (
                      <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.ubicacion}</span>
                    )}
                  </div>

                  {/* Resumen */}
                  <div style={{
                    background: '#f0fdf4',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                  }}>
                    <h4 style={{ color: '#1b4332', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                      📋 Resumen del producto
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#374151' }}>
                      <p><strong>Nombre:</strong> {form.nombre || '-'}</p>
                      <p><strong>Categoría:</strong> {categorias.find(c => c.id === form.idCategoria)?.icono} {categorias.find(c => c.id === form.idCategoria)?.nombre || '-'}</p>
                      <p><strong>Precio:</strong> S/ {form.precioUnitario || '0.00'}</p>
                      <p><strong>Stock:</strong> {form.cantidadDisponible || '0'} unidades</p>
                      <p><strong>Ubicación:</strong> {form.ubicacion || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                  >
                    ← Anterior
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(45,106,79,0.3)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(45,106,79,0.4)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(45,106,79,0.3)'
                    }}
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #52b788, #40916c)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(82,183,136,0.4)',
                      animation: 'pulse 3s ease infinite',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 10px 35px rgba(82,183,136,0.6)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)'
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(82,183,136,0.4)'
                    }}
                  >
                    🚀 Publicar Producto
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductRegistration