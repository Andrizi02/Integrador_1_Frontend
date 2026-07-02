import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'

const SAMPLE_PRODUCTS = [
  { idProducto: 1, nombre: 'Papas Nativas', precioUnitario: 2.50, cantidadDisponible: 100, ubicacion: 'Arequipa - Cayma', categoria: { nombre: 'Tubérculos', icono: '🥔' }, descripcion: 'Papas nativas de altura', productor: { nombre: 'Juan', apellido: 'Pérez' } },
  { idProducto: 2, nombre: 'Quinua Orgánica', precioUnitario: 8.00, cantidadDisponible: 50, ubicacion: 'Puno - Juliaca', categoria: { nombre: 'Granos', icono: '🌾' }, descripcion: 'Quinua orgánica certificada', productor: { nombre: 'María', apellido: 'Quispe' } },
  { idProducto: 3, nombre: 'Tomates Cherry', precioUnitario: 3.50, cantidadDisponible: 75, ubicacion: 'Arequipa - Characato', categoria: { nombre: 'Verduras', icono: '🍅' }, descripcion: 'Tomates cherry frescos', productor: { nombre: 'Carlos', apellido: 'Mamani' } },
  { idProducto: 4, nombre: 'Aguacates Hass', precioUnitario: 5.00, cantidadDisponible: 200, ubicacion: 'Moquegua - Omate', categoria: { nombre: 'Frutas', icono: '🥑' }, descripcion: 'Aguacates cremosos', productor: { nombre: 'Ana', apellido: 'Huamán' } },
  { idProducto: 5, nombre: 'Maíz Morado', precioUnitario: 4.00, cantidadDisponible: 60, ubicacion: 'Cusco - Urubamba', categoria: { nombre: 'Granos', icono: '🌽' }, descripcion: 'Maíz morado tradicional', productor: { nombre: 'Luis', apellido: 'Cusihuaman' } },
  { idProducto: 6, nombre: 'Fresas Orgánicas', precioUnitario: 12.00, cantidadDisponible: 30, ubicacion: 'Arequipa - Yura', categoria: { nombre: 'Frutas', icono: '🍓' }, descripcion: 'Fresas orgánicas dulces', productor: { nombre: 'Rosa', apellido: 'Medina' } },
]

const Products = () => {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar productos (locales + publicados por usuario)
    const storedProducts = JSON.parse(localStorage.getItem('agroconnect_products') || '[]')
    const allProducts = [...SAMPLE_PRODUCTS, ...storedProducts]
    setProducts(allProducts)
    setFiltered(allProducts)
    setLoading(false)
  }, [])

  useEffect(() => {
    let result = [...products]
    if (search) {
      result = result.filter(p =>
        p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        p.ubicacion?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (filterType) {
      result = result.filter(p => p.categoria?.nombre === filterType)
    }
    setFiltered(result)
  }, [search, filterType, products])

  const categories = [...new Set(products.map(p => p.categoria?.nombre).filter(Boolean))]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{
          width: '60px', height: '60px', border: '4px solid #e5e7eb',
          borderTopColor: '#2d6a4f', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
        }} />
        <p>Cargando productos...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ color: '#1b4332', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800 }}>
            🛒 Productos Frescos
          </h1>
          <p style={{ color: '#6b7280' }}>Directo del productor a tu mesa</p>
        </div>
        <div style={{
          background: 'white', padding: '0.7rem 1.5rem', borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontWeight: 600, color: '#2d6a4f',
        }}>
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text" placeholder="🔍 Buscar productos..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', padding: '0.9rem 1.2rem',
            border: '2px solid #e5e7eb', borderRadius: '14px', fontSize: '0.95rem',
          }}
        />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          style={{
            padding: '0.9rem 1.2rem', border: '2px solid #e5e7eb',
            borderRadius: '14px', fontSize: '0.95rem', background: 'white', cursor: 'pointer',
          }}>
          <option value="">📂 Todos los tipos</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No se encontraron productos</h3>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map(product => (
            <ProductCard key={product.idProducto || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products