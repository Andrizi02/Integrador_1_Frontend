import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'clamp(3rem, 8vw, 6rem) 1rem',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{ fontSize: 'clamp(5rem, 12vw, 10rem)', marginBottom: '1rem' }}>404</div>
      <h1 style={{ color: '#1b4332', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.5rem' }}>
        Página no encontrada
      </h1>
      <p style={{ color: '#6b7280', fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)', marginBottom: '2rem' }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">🏠 Volver al Inicio</Link>
    </div>
  )
}

export default NotFound