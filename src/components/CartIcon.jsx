import { useCart } from '../context/CartContext'

const CartIcon = () => {
  const { totalItems, setIsCartOpen } = useCart()

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      style={{
        position: 'fixed',
        bottom: 'clamp(1rem, 3vw, 2rem)',
        right: 'clamp(1rem, 3vw, 2rem)',
        width: 'clamp(50px, 8vw, 65px)',
        height: 'clamp(50px, 8vw, 65px)',
        background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 8px 30px rgba(45,106,79,0.4)',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
        transition: 'all 0.3s ease',
        animation: 'scaleIn 0.5s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      🛒
      {totalItems > 0 && (
        <span style={{
          position: 'absolute', top: '-5px', right: '-5px',
          background: '#ef4444', color: 'white',
          width: 'clamp(20px, 3vw, 26px)', height: 'clamp(20px, 3vw, 26px)',
          borderRadius: '50%', fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
          fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 2s ease infinite', border: '2px solid white',
        }}>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}

export default CartIcon