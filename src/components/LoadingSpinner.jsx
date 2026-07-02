const LoadingSpinner = ({ text = 'Cargando...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
    }}>
      <div style={{
        width: 'clamp(40px, 6vw, 60px)',
        height: 'clamp(40px, 6vw, 60px)',
        border: '4px solid #e5e7eb',
        borderTopColor: '#2d6a4f',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: '1rem',
      }} />
      <p style={{ color: '#6b7280', fontWeight: 500, fontSize: 'clamp(0.85rem, 1.2vw, 1rem)' }}>
        {text}
      </p>
    </div>
  )
}

export default LoadingSpinner