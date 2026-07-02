import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiService from '../api/api'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      const data = await apiService.getProducto(id)
      setProduct(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    const result = await addToCart(product, qty)
    if (result.success) {
      setToast({ message: '✅ Agregado al carrito', type: 'success' })
    } else {
      setToast({ message: result.message || '❌ Error', type: 'error' })
    }
  }

  if (loading) return <LoadingSpinner text="Cargando producto..." />

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '4rem' }}>🔍</div>
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Volver a Productos
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <button onClick={() => navigate('/products')} style={{
        background: 'none', border: 'none', color: '#2d6a4f', cursor: 'pointer',
        fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem',
      }}>
        ← Volver a Productos
      </button>

      <div className="card" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '2rem',
        }}>
          <div style={{
            height: 'clamp(200px, 30vw, 300px)',
            background: 'linear-gradient(135deg, #d8f3dc, #95d5b2)',
            borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(4rem, 8vw, 8rem)',
          }}>
            {product.categoria?.icono || '📦'}
          </div>
          <div>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
              {product.categoria?.nombre || 'Producto'}
            </span>
            <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', color: '#1b4332', fontWeight: 800, marginTop: '0.5rem' }}>
              {product.nombre}
            </h1>
            <p style={{ color: '#6b7280', margin: '0.8rem 0', lineHeight: 1.8 }}>
              {product.descripcion || 'Producto fresco directamente del productor.'}
            </p>
            <p style={{ color: '#6b7280' }}>📍 {product.ubicacion}</p>

            <div style={{
              background: '#f0fdf4', padding: '1.2rem', borderRadius: '16px',
              margin: '1.5rem 0',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2d6a4f' }}>
                S/ {parseFloat(product.precioUnitario).toFixed(2)}
              </div>
              <div style={{ color: '#6b7280' }}>📦 Stock: {product.cantidadDisponible} unidades</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Cantidad:</span>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn btn-secondary btn-sm">−</button>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', minWidth: '40px', textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.cantidadDisponible, qty + 1))} className="btn btn-secondary btn-sm">+</button>
            </div>

            <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              🛒 Agregar al Carrito — S/ {(parseFloat(product.precioUnitario) * qty).toFixed(2)}
            </button>

            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '1rem' }}>
              👨‍🌾 Productor: {product.productor?.nombre || 'Anónimo'} {product.productor?.apellido || ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail