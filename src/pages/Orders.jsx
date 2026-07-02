import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Orders = () => {
  const { orders, updateOrderStatus } = useCart()
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [localOrders, setLocalOrders] = useState([])

  // Escuchar cambios en tiempo real
  useEffect(() => {
    const handleOrdersUpdate = (e) => {
      setLocalOrders(e.detail || [])
    }

    // Cargar inicial
    setLocalOrders(orders)

    // Escuchar evento personalizado
    window.addEventListener('ordersUpdated', handleOrdersUpdate)

    return () => window.removeEventListener('ordersUpdated', handleOrdersUpdate)
  }, [orders])

  // Filtrar pedidos del usuario actual (si no es admin)
  const filteredOrders = localOrders.filter(order => {
    if (user?.rol === 'admin') return true
    return order.comprador?.id === user?.id || order.comprador?.email === user?.email
  })

  const displayOrders = filter === 'all'
    ? filteredOrders
    : filteredOrders.filter(o => o.estado === filter)

  const statusConfig = {
    pendiente: { icon: '⏳', color: '#f59e0b', bg: '#fef3c7', progress: 25 },
    confirmado: { icon: '✅', color: '#3b82f6', bg: '#dbeafe', progress: 50 },
    en_camino: { icon: '🚚', color: '#8b5cf6', bg: '#ede9fe', progress: 75 },
    completado: { icon: '🏁', color: '#10b981', bg: '#d1fae5', progress: 100 },
    cancelado: { icon: '❌', color: '#ef4444', bg: '#fee2e2', progress: 0 },
  }

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <h1 style={{ color: '#1b4332', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800 }}>
            📦 Mis Pedidos
          </h1>
          <p style={{ color: '#6b7280' }}>
            {user?.rol === 'admin' ? 'Todos los pedidos del sistema' : 'Gestiona y rastrea tus órdenes'}
          </p>
        </div>
        <div style={{
          background: 'white', padding: '0.7rem 1.5rem', borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)', fontWeight: 700, color: '#2d6a4f',
        }}>
          {filteredOrders.length} pedidos
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: '📋 Todos' },
          { key: 'pendiente', label: '⏳ Pendientes' },
          { key: 'confirmado', label: '✅ Confirmados' },
          { key: 'en_camino', label: '🚚 En Camino' },
          { key: 'completado', label: '🏁 Completados' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '0.7rem 1.4rem', borderRadius: '14px',
            border: filter === f.key ? '2px solid #2d6a4f' : '2px solid #e5e7eb',
            background: filter === f.key ? '#f0fdf4' : 'white',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
            color: filter === f.key ? '#1b4332' : '#6b7280',
            transition: 'all 0.3s ease',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {displayOrders.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'white', borderRadius: '24px', animation: 'scaleIn 0.5s ease',
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📭</div>
          <h3>No hay pedidos</h3>
          <p style={{ color: '#6b7280' }}>Los pedidos que realices aparecerán aquí</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {displayOrders.map((order, i) => {
            const status = statusConfig[order.estado] || statusConfig.pendiente
            return (
              <div key={order.idPedido || order.id} style={{
                background: 'white', borderRadius: '20px', padding: '1.8rem',
                boxShadow: '0 5px 25px rgba(0,0,0,0.05)',
                border: '1px solid #f3f4f6',
                borderLeft: `5px solid ${status.color}`,
                animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem',
                }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#2d6a4f', fontSize: '1.1rem' }}>
                      {order.idPedido || `#${order.id}`}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                      📅 {new Date(order.fechaPedido).toLocaleString('es-PE')}
                    </div>
                    {order.comprador && (
                      <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                        🧑‍🍳 {order.comprador.nombre} ({order.comprador.email})
                      </div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: status.bg, color: status.color,
                    padding: '0.5rem 1.2rem', borderRadius: '20px',
                    fontWeight: 700, fontSize: '0.85rem',
                  }}>
                    {status.icon} {order.estado.replace('_', ' ')}
                  </div>
                </div>

                {/* Barra de progreso */}
                <div style={{
                  width: '100%', height: '6px', background: '#f3f4f6',
                  borderRadius: '10px', marginBottom: '1.5rem', overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${status.progress}%`, height: '100%',
                    background: `linear-gradient(90deg, ${status.color}, ${status.color}80)`,
                    borderRadius: '10px', transition: 'width 1s ease',
                  }} />
                </div>

                {/* Items */}
                <div style={{ marginBottom: '1rem' }}>
                  {order.items?.map((item, j) => (
                    <div key={j} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.5rem 0', borderBottom: '1px solid #f9fafb',
                      fontSize: '0.9rem',
                    }}>
                      <span>
                        {item.productImage || '📦'} {item.productName || item.nombre} 
                        <span style={{ color: '#9ca3af' }}> x{item.quantity}</span>
                      </span>
                      <span style={{ fontWeight: 600, color: '#2d6a4f' }}>
                        S/ {((item.productPrice || item.precioUnitario) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                }}>
                  <div style={{ fontWeight: 800, color: '#2d6a4f', fontSize: '1.3rem' }}>
                    Total: S/ {order.total.toFixed(2)}
                  </div>

                  {/* Admin: cambiar estado */}
                  {user?.rol === 'admin' && order.estado !== 'completado' && order.estado !== 'cancelado' && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {['pendiente', 'confirmado', 'en_camino', 'completado']
                        .filter(s => s !== order.estado)
                        .map(s => (
                          <button key={s} onClick={() => handleStatusChange(order.idPedido || order.id, s)}
                            style={{
                              padding: '0.4rem 0.9rem', borderRadius: '20px',
                              border: 'none', cursor: 'pointer', fontWeight: 600,
                              fontSize: '0.75rem', background: statusConfig[s]?.bg,
                              color: statusConfig[s]?.color,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {statusConfig[s]?.icon} {s.replace('_', ' ')}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders