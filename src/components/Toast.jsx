import { useState, useEffect } from 'react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    success: { bg: '#d1fae5', color: '#065f46', icon: '✅' },
    error: { bg: '#fee2e2', color: '#991b1b', icon: '❌' },
    warning: { bg: '#fef3c7', color: '#92400e', icon: '⚠️' },
    info: { bg: '#dbeafe', color: '#1e40af', icon: 'ℹ️' },
  }

  const style = colors[type] || colors.info

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: style.bg,
      color: style.color,
      padding: '1rem 1.5rem',
      borderRadius: '14px',
      fontWeight: 600,
      fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
      zIndex: 3000,
      animation: `${isVisible ? 'slideInRight' : 'fadeIn'} 0.3s ease`,
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.3s ease',
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: 'min(400px, 90vw)',
    }}>
      <span>{style.icon}</span>
      <span>{message}</span>
      <button
        onClick={() => { setIsVisible(false); setTimeout(() => onClose?.(), 300) }}
        style={{
          background: 'none', border: 'none', color: style.color,
          cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, marginLeft: '0.5rem',
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default Toast