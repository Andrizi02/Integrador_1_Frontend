import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #081c15, #0d2818)', color: 'white', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) clamp(1rem, 2vw, 1.5rem) 1.5rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '2rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🌱</span>
              <h3 style={{ background: 'linear-gradient(to right, #95d5b2, #52b788)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 'clamp(1rem, 2vw, 1.3rem)', fontWeight: 800 }}>
                AgroConnect
              </h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', lineHeight: 1.7 }}>
              Conectando productores locales con compradores inteligentes.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#95d5b2', marginBottom: '1rem', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', fontWeight: 600 }}>ENLACES</h4>
            {[{ to: '/products', label: '🛒 Productos' }, { to: '/orders', label: '📦 Pedidos' }, { to: '/register-product', label: '➕ Publicar' }, { to: '/admin', label: '⚙️ Admin' }].map(link => (
              <Link key={link.to} to={link.to} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', marginBottom: '0.6rem', padding: '0.2rem 0', transition: 'all 0.2s ease' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <h4 style={{ color: '#95d5b2', marginBottom: '1rem', fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)', fontWeight: 600 }}>CONTACTO</h4>
            {[{ icon: '📧', text: 'info@agroconnect.pe' }, { icon: '📱', text: '+51 1 234 5678' }, { icon: '📍', text: 'Arequipa, Perú' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)', marginBottom: '0.6rem' }}>
                <span style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)' }}>&copy; 2026 AgroConnect. Todos los derechos reservados.</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 'clamp(0.65rem, 1vw, 0.75rem)', marginTop: '0.3rem' }}>Hecho con 💚 para el campo peruano</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer