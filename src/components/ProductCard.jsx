import { useCart } from '../context/CartContext'
import { useState } from 'react'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [qty, setQty] = useState(1)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    const result = addToCart(product, qty)
    if (result.success) {
      setAdded(true)
      setShowModal(false)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  const openModal = () => {
    setShowModal(true)
    setQty(1)
    setAdded(false)
  }

  return (
    <>
      {/* Card */}
      <div
        onClick={openModal}
        style={{
          background: 'white',
          borderRadius: 'clamp(16px, 2vw, 24px)',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #f3f4f6',
          cursor: 'pointer',
          transition: 'all 0.4s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)'
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.12)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
        }}
      >
        {/* Imagen */}
        <div style={{
          height: 'clamp(140px, 18vw, 200px)',
          background: 'linear-gradient(135deg, #d8f3dc, #95d5b2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(3rem, 5vw, 6rem)',
        }}>
          {product.categoria?.icono || '📦'}
        </div>

        {/* Contenido */}
        <div style={{ padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
          <span style={{
            background: '#d8f3dc', color: '#1b4332', padding: '0.25rem 0.8rem',
            borderRadius: '20px', fontSize: 'clamp(0.65rem, 1vw, 0.75rem)', fontWeight: 700,
          }}>
            {product.categoria?.nombre || 'Producto'}
          </span>
          <h3 style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', fontWeight: 700, color: '#1b4332',
            margin: '0.5rem 0',
          }}>
            {product.nombre}
          </h3>
          <p style={{ color: '#6b7280', fontSize: 'clamp(0.75rem, 1vw, 0.85rem)', marginBottom: '0.5rem' }}>
            📍 {product.ubicacion}
          </p>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <div>
              <div style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', fontWeight: 800, color: '#2d6a4f' }}>
                S/ {parseFloat(product.precioUnitario || product.price || 0).toFixed(2)}
              </div>
              <div style={{ fontSize: 'clamp(0.7rem, 1vw, 0.8rem)', color: '#9ca3af' }}>por unidad</div>
            </div>
            <div style={{
              fontWeight: 700,
              color: (product.cantidadDisponible || product.quantity) > 50 ? '#10b981' : '#f59e0b',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
            }}>
              📦 {product.cantidadDisponible || product.quantity} unid.
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart(e)
            }}
            style={{
              width: '100%', marginTop: '1rem', padding: 'clamp(0.7rem, 1.2vw, 0.9rem)',
              background: added ? '#10b981' : 'linear-gradient(135deg, #2d6a4f, #40916c)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {added ? '✅ ¡Agregado!' : '🛒 Agregar al Carrito'}
          </button>
        </div>
      </div>

      {/* Modal de detalle rápido */}
      {showModal && (
        <>
          {/* Overlay */}
          <div onClick={() => setShowModal(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)', zIndex: 2000,
            animation: 'fadeIn 0.3s ease',
          }} />

          {/* Modal */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'white', borderRadius: '28px', zIndex: 2001,
            width: 'min(95%, 500px)', maxHeight: '90vh', overflow: 'auto',
            animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          }}>
            {/* Imagen */}
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #d8f3dc, #95d5b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '7rem', borderRadius: '28px 28px 0 0', position: 'relative',
            }}>
              {product.categoria?.icono || '📦'}
              <button onClick={() => setShowModal(false)} style={{
                position: 'absolute', top: '1rem', right: '1rem',
                width: '40px', height: '40px', background: 'rgba(0,0,0,0.3)',
                border: 'none', borderRadius: '50%', color: 'white',
                fontSize: '1.2rem', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#ef4444'
                e.currentTarget.style.transform = 'rotate(90deg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.3)'
                e.currentTarget.style.transform = 'rotate(0deg)'
              }}
              >✕</button>
            </div>

            <div style={{ padding: '2rem' }}>
              <span style={{
                background: '#d8f3dc', color: '#1b4332',
                padding: '0.3rem 1rem', borderRadius: '20px',
                fontSize: '0.8rem', fontWeight: 700,
              }}>
                {product.categoria?.nombre || 'Producto'}
              </span>

              <h2 style={{
                fontSize: '1.6rem', fontWeight: 800, color: '#1b4332',
                marginTop: '0.8rem',
              }}>
                {product.nombre}
              </h2>

              <p style={{ color: '#6b7280', marginTop: '0.8rem', lineHeight: 1.7 }}>
                {product.descripcion || 'Producto fresco directamente del productor.'}
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '0.5rem', color: '#6b7280',
              }}>
                <span>📍</span> {product.ubicacion}
              </div>

              {product.productor && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginTop: '0.3rem', color: '#6b7280',
                }}>
                  <span>👨‍🌾</span> {product.productor.nombre} {product.productor.apellido}
                </div>
              )}

              {/* Precio y stock */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginTop: '1.5rem',
                padding: '1.2rem', background: '#f0fdf4', borderRadius: '16px',
                flexWrap: 'wrap', gap: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2d6a4f' }}>
                    S/ {parseFloat(product.precioUnitario || 0).toFixed(2)}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>por unidad</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Stock</div>
                  <div style={{
                    fontWeight: 700, fontSize: '1.1rem',
                    color: (product.cantidadDisponible || 0) > 50 ? '#10b981' : '#f59e0b',
                  }}>
                    {product.cantidadDisponible || 0} unid.
                  </div>
                </div>
              </div>

              {/* Cantidad */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                marginTop: '1.2rem',
              }}>
                <span style={{ fontWeight: 600 }}>Cantidad:</span>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={qtyBtnStyle}>−</button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '40px', textAlign: 'center' }}>
                  {qty}
                </span>
                <button onClick={() => setQty(Math.min(product.cantidadDisponible || 99, qty + 1))}
                  style={qtyBtnStyle}>+</button>
              </div>

              {/* Botón agregar */}
              <button onClick={handleAddToCart} style={{
                width: '100%', marginTop: '1.5rem', padding: '1.1rem',
                background: added ? '#10b981' : 'linear-gradient(135deg, #2d6a4f, #40916c)',
                color: 'white', border: 'none', borderRadius: '16px',
                fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}>
                {added ? '✅ ¡Agregado!' : `🛒 Agregar al Carrito — S/ ${(parseFloat(product.precioUnitario || 0) * qty).toFixed(2)}`}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

const qtyBtnStyle = {
  width: '36px', height: '36px', border: '2px solid #e5e7eb',
  borderRadius: '10px', background: 'white', cursor: 'pointer',
  fontWeight: 700, fontSize: '1.1rem', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: '#374151',
  transition: 'all 0.2s ease',
}

export default ProductCard