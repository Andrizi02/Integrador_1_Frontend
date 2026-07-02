import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import apiService from '../api/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Home = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiService.getProductos()
        setProductos(data.slice(0, 4))
      } catch (error) {
        console.error('Error cargando productos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const features = [
    { icon: '📱', title: 'Registro Simple', desc: 'Crea tu cuenta en minutos sin complicaciones.', color: '#10b981' },
    { icon: '🚜', title: 'Publica Productos', desc: 'Lista tus excedentes con precio y ubicación.', color: '#3b82f6' },
    { icon: '🔍', title: 'Búsqueda Inteligente', desc: 'Encuentra productos locales rápidamente.', color: '#f59e0b' },
    { icon: '🚚', title: 'Logística Compartida', desc: 'Optimizamos entregas reduciendo costos.', color: '#8b5cf6' },
  ]

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #081c15, #1b4332, #2d6a4f, #40916c)',
        backgroundSize: '400% 400%', animation: 'gradientShift 15s ease infinite',
        borderRadius: 'clamp(20px, 4vw, 40px)',
        padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'center', color: 'white', marginBottom: 'clamp(2rem, 4vw, 4rem)',
        boxShadow: '0 30px 80px rgba(27,67,50,0.4)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
          padding: 'clamp(0.4rem, 1vw, 0.6rem) clamp(1rem, 2vw, 1.8rem)',
          borderRadius: '50px', fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          fontWeight: 600, marginBottom: 'clamp(1rem, 2vw, 2rem)',
        }}>
          <span style={{ width: '8px', height: '8px', background: '#52b788', borderRadius: '50%', animation: 'pulse 2s ease infinite' }} />
          🌱 Fase Piloto 2026
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
          Reduce el{' '}
          <span style={{ background: 'linear-gradient(135deg, #95d5b2, #d8f3dc, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Desperdicio Agrícola
          </span>
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', opacity: 0.85, maxWidth: '650px', margin: '0 auto clamp(1.5rem, 3vw, 2.5rem)' }}>
          Conectamos productores locales con compradores inteligentes para reducir pérdidas y crear un mercado sostenible.
        </p>

        <div style={{ display: 'flex', gap: 'clamp(0.5rem, 1.5vw, 1rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary btn-lg">🛒 Ver Productos →</Link>
          <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', border: '2px solid white' }}>
            🧑‍🌾 Ser Productor
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginBottom: 'clamp(2rem, 4vw, 4rem)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 3vw, 3rem)' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, color: '#1b4332' }}>
            ¿Cómo funciona AgroConnect?
          </h2>
          <p style={{ color: '#6b7280', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)' }}>
            Una plataforma diseñada para facilitar la comercialización agrícola
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: 'clamp(1rem, 2vw, 2rem)',
        }}>
          {features.map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vw, 2rem)' }}>
              <div style={{
                width: 'clamp(60px, 10vw, 80px)', height: 'clamp(60px, 10vw, 80px)',
                background: `${f.color}20`, borderRadius: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto clamp(1rem, 2vw, 1.5rem)', fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              }}>{f.icon}</div>
              <h3 style={{ color: '#1b4332', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#6b7280', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332, #2d6a4f, #40916c)',
        borderRadius: 'clamp(20px, 4vw, 40px)', padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'center', color: 'white',
      }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
          ¿Listo para empezar?
        </h2>
        <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', opacity: 0.85, marginBottom: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
          Únete a nuestra comunidad y transforma la agricultura local
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">🚀 Crear Cuenta Gratis</Link>
      </div>
    </div>
  )
}

export default Home