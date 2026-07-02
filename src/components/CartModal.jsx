import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Toast from './Toast'

const CartModal = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, createOrder, totalPrice, totalItems } = useCart()
  const { user } = useAuth()
  const [toast, setToast] = useState(null)
  const [showBoleta, setShowBoleta] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePedirClick = () => {
    if (!user) {
      setToast({ message: '⚠️ Debes iniciar sesión para comprar', type: 'warning' })
      return
    }
    if (cart.length === 0) {
      setToast({ message: '⚠️ El carrito está vacío', type: 'warning' })
      return
    }
    // Mostrar confirmación rápida
    setShowConfirm(true)
  }

  const handleConfirmarPedido = () => {
    const order = createOrder({
      id: user.id,
      nombre: user.nombre || user.email?.split('@')[0],
      email: user.email,
    })

    if (order) {
      setShowConfirm(false)
      setShowBoleta(order)
      setToast({ message: '✅ ¡Pedido realizado con éxito!', type: 'success' })
    }
  }

  const handleCancelarPedido = () => {
    setShowConfirm(false)
  }

  const closeBoleta = () => {
    setShowBoleta(null)
    setIsCartOpen(false)
  }

  if (!isCartOpen) return null

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Overlay */}
      <div onClick={() => { setIsCartOpen(false); setShowBoleta(null); setShowConfirm(false) }} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(5px)', zIndex: 2000, animation: 'fadeIn 0.3s ease',
      }} />

      {/* Boleta de compra */}
      {showBoleta ? (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'white', borderRadius: '24px', zIndex: 2002,
          width: 'min(95%, 500px)', maxHeight: '90vh', overflow: 'auto',
          animation: 'scaleIn 0.4s ease', boxShadow: '0 30px 70px rgba(0,0,0,0.3)',
        }}>
          {/* Header boleta */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            padding: '1.5rem', color: 'white', textAlign: 'center',
            borderRadius: '24px 24px 0 0',
          }}>
            <div style={{
              width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 0.8rem', fontSize: '2rem',
            }}>✅</div>
            <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>🧾 ¡Pedido Confirmado!</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>AgroConnect - Boleta de Compra</p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Datos de la boleta */}
            <div style={{
              background: '#f9fafb', borderRadius: '14px', padding: '1.2rem',
              marginBottom: '1rem', fontSize: '0.9rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>Pedido:</span>
                <strong>{showBoleta.idPedido}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>Fecha:</span>
                <span>{new Date(showBoleta.fechaPedido).toLocaleString('es-PE')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#6b7280' }}>Comprador:</span>
                <strong>{showBoleta.comprador?.nombre}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Email:</span>
                <span>{showBoleta.comprador?.email}</span>
              </div>
            </div>

            {/* Items */}
            <div style={{
              background: '#f9fafb', borderRadius: '14px', padding: '1rem',
              marginBottom: '1rem',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>Cant</th>
                    <th style={{ textAlign: 'center', padding: '0.5rem' }}>P.U.</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {showBoleta.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.5rem' }}>
                        <strong>{item.productName || item.nombre}</strong>
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem' }}>x{item.quantity}</td>
                      <td style={{ textAlign: 'center', padding: '0.5rem', color: '#6b7280' }}>
                        S/ {(item.productPrice || item.precioUnitario).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.5rem', fontWeight: 700, color: '#2d6a4f' }}>
                        S/ {((item.productPrice || item.precioUnitario) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '1rem 1.5rem', background: '#d1fae5', borderRadius: '14px',
              marginBottom: '1rem', fontSize: '1.3rem', fontWeight: 800,
            }}>
              <span>TOTAL:</span>
              <span style={{ color: '#065f46' }}>S/ {showBoleta.total.toFixed(2)}</span>
            </div>

            {/* Estado */}
            <div style={{
              textAlign: 'center', padding: '0.8rem',
              background: '#fef3c7', borderRadius: '14px', marginBottom: '1.5rem',
            }}>
              <span style={{ fontWeight: 600, color: '#92400e', fontSize: '0.9rem' }}>
                ⏳ Estado: {showBoleta.estado.toUpperCase()}
              </span>
              <p style={{ fontSize: '0.8rem', color: '#92400e', marginTop: '0.3rem' }}>
                Puedes ver el estado de tu pedido en la sección "Pedidos"
              </p>
            </div>

            <button onClick={closeBoleta} style={{
              width: '100%', padding: '1rem',
              background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ✅ Entendido
            </button>
          </div>
        </div>
      ) : showConfirm ? (
        /* Confirmación rápida */
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'white', borderRadius: '24px', zIndex: 2002,
          width: 'min(90%, 400px)', padding: '2rem', textAlign: 'center',
          animation: 'scaleIn 0.3s ease', boxShadow: '0 30px 70px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤔</div>
          <h3 style={{ color: '#1b4332', marginBottom: '0.5rem' }}>¿Confirmar pedido?</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Se generará una boleta con {totalItems} producto{totalItems !== 1 ? 's' : ''} por{' '}
            <strong style={{ color: '#2d6a4f' }}>S/ {totalPrice.toFixed(2)}</strong>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleCancelarPedido} style={{
              flex: 1, padding: '0.9rem', background: '#f3f4f6', color: '#6b7280',
              border: 'none', borderRadius: '14px', fontWeight: 600, cursor: 'pointer',
            }}>
              Cancelar
            </button>
            <button onClick={handleConfirmarPedido} style={{
              flex: 1, padding: '0.9rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', border: 'none', borderRadius: '14px',
              fontWeight: 700, cursor: 'pointer',
            }}>
              ✅ Sí, pedir
            </button>
          </div>
        </div>
      ) : (
        /* Carrito normal */
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(100%, 450px)', background: 'white', zIndex: 2001,
          display: 'flex', flexDirection: 'column',
          animation: 'slideInRight 0.4s ease',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.2)',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.5rem', borderBottom: '1px solid #f3f4f6',
            background: 'linear-gradient(135deg, #2d6a4f, #40916c)', color: 'white',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <h2 style={{ fontWeight: 700 }}>🛒 Tu Carrito</h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
              </p>
            </div>
            <button onClick={() => setIsCartOpen(false)} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem',
            }}>✕</button>
          </div>

          {/* Items */}
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                <h3 style={{ color: '#1b4332' }}>Carrito vacío</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Agrega productos haciendo clic en "Agregar al Carrito"
                </p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.idCart} style={{
                  display: 'flex', gap: '1rem', padding: '1rem',
                  background: '#f9fafb', borderRadius: '16px',
                  marginBottom: '0.8rem', border: '1px solid #f3f4f6',
                  animation: 'fadeInUp 0.3s ease',
                }}>
                  {/* Icono */}
                  <div style={{
                    width: '60px', height: '60px',
                    background: 'linear-gradient(135deg, #d8f3dc, #95d5b2)',
                    borderRadius: '14px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '2rem', flexShrink: 0,
                  }}>
                    {item.productImage || '📦'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1b4332' }}>
                      {item.productName || item.nombre}
                    </h4>
                    <div style={{ color: '#2d6a4f', fontWeight: 700, fontSize: '0.95rem' }}>
                      S/ {(item.productPrice || item.precioUnitario).toFixed(2)} c/u
                    </div>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', 
                      marginTop: '0.3rem' 
                    }}>
                      <button onClick={() => updateQuantity(item.idCart, item.quantity - 1)}
                        style={{
                          width: '28px', height: '28px', border: '2px solid #e5e7eb',
                          borderRadius: '8px', background: 'white', cursor: 'pointer',
                          fontWeight: 700, display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                        }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: '25px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.idCart, item.quantity + 1)}
                        style={{
                          width: '28px', height: '28px', border: '2px solid #e5e7eb',
                          borderRadius: '8px', background: 'white', cursor: 'pointer',
                          fontWeight: 700, display: 'flex', alignItems: 'center',
                          justifyContent: 'center',
                        }}>+</button>
                    </div>
                    <div style={{ 
                      textAlign: 'right', fontWeight: 700, color: '#2d6a4f',
                      marginTop: '0.3rem', fontSize: '0.9rem',
                    }}>
                      S/ {((item.productPrice || item.precioUnitario) * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Eliminar */}
                  <button onClick={() => removeFromCart(item.idCart)} style={{
                    background: 'none', border: 'none', color: '#ef4444',
                    cursor: 'pointer', fontSize: '1.2rem', alignSelf: 'flex-start',
                    padding: '0.2rem',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.3)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >🗑️</button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div style={{
              padding: '1.5rem', borderTop: '1px solid #f3f4f6',
              boxShadow: '0 -5px 20px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1rem',
              }}>
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>Total:</span>
                <span style={{
                  fontWeight: 800, color: '#2d6a4f', fontSize: '1.5rem',
                }}>
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                <button onClick={clearCart} style={{
                  padding: '0.9rem', background: '#f3f4f6', color: '#6b7280',
                  border: 'none', borderRadius: '14px', fontWeight: 600,
                  cursor: 'pointer', fontSize: '0.9rem',
                }}>
                  🗑️ Vaciar
                </button>
                <button onClick={handlePedirClick} style={{
                  padding: '0.9rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', border: 'none', borderRadius: '14px',
                  fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 3s ease infinite',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  🧾 Pedir ({totalItems})
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default CartModal