import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

const AdminPanel = () => {
  const { orders, updateOrderStatus } = useCart()
  const [tab, setTab] = useState('dashboard')
  const [localOrders, setLocalOrders] = useState([])
  const [counters, setCounters] = useState({ products: 0, orders: 0, pending: 0, completed: 0, revenue: 0 })

  useEffect(() => {
    const handleOrdersUpdate = (e) => {
      const updatedOrders = e.detail || []
      setLocalOrders(updatedOrders)
      updateCounters(updatedOrders)
    }

    setLocalOrders(orders)
    updateCounters(orders)

    window.addEventListener('ordersUpdated', handleOrdersUpdate)
    return () => window.removeEventListener('ordersUpdated', handleOrdersUpdate)
  }, [orders])

  const updateCounters = (ordersList) => {
    const products = JSON.parse(localStorage.getItem('agroconnect_products') || '[]')
    const sampleProducts = 6 // productos de muestra
    
    setCounters({
      products: sampleProducts + products.length,
      orders: ordersList.length,
      pending: ordersList.filter(o => o.estado === 'pendiente').length,
      completed: ordersList.filter(o => o.estado === 'completado').length,
      revenue: ordersList
        .filter(o => o.estado === 'completado')
        .reduce((sum, o) => sum + o.total, 0),
    })
  }

  const statusConfig = {
    pendiente: { icon: '⏳', color: '#f59e0b', bg: '#fef3c7' },
    confirmado: { icon: '✅', color: '#3b82f6', bg: '#dbeafe' },
    en_camino: { icon: '🚚', color: '#8b5cf6', bg: '#ede9fe' },
    completado: { icon: '🏁', color: '#10b981', bg: '#d1fae5' },
  }

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
  }

  const stats = [
    { icon: '📦', value: counters.products, label: 'Productos', color: '#10b981', bg: '#d1fae5' },
    { icon: '🛒', value: counters.orders, label: 'Pedidos', color: '#3b82f6', bg: '#dbeafe' },
    { icon: '⏳', value: counters.pending, label: 'Pendientes', color: '#f59e0b', bg: '#fef3c7' },
    { icon: '💰', value: `S/ ${counters.revenue}`, label: 'Ingresos', color: '#8b5cf6', bg: '#ede9fe' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#1b4332', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800 }}>
          ⚙️ Panel de Administración
        </h1>
        <p style={{ color: '#6b7280' }}>Gestiona productos, pedidos y usuarios</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap',
        background: 'white', padding: '0.4rem', borderRadius: '14px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      }}>
        {[
          { key: 'dashboard', icon: '📊', label: 'Dashboard' },
          { key: 'orders', icon: '🛒', label: 'Pedidos' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.7rem 1.5rem', border: 'none',
            background: tab === t.key ? 'linear-gradient(135deg, #2d6a4f, #40916c)' : 'transparent',
            color: tab === t.key ? 'white' : '#6b7280',
            borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1.5rem', marginBottom: '2.5rem',
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: 'white', padding: '2rem', borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: `1px solid ${s.bg}`, animation: `fadeInUp 0.5s ease ${i * 0.1}s both`,
              }}>
                <div style={{
                  width: '50px', height: '50px', background: s.bg,
                  borderRadius: '14px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem',
                }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tabla de pedidos */}
      <div style={{
        background: 'white', borderRadius: '20px', padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}>
        <h3 style={{ color: '#1b4332', marginBottom: '1.5rem' }}>
          🛒 {tab === 'dashboard' ? 'Pedidos Recientes' : 'Todos los Pedidos'}
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                <th style={thStyle}>Pedido</th>
                <th style={thStyle}>Comprador</th>
                <th style={thStyle}>Productos</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {localOrders.slice(0, tab === 'dashboard' ? 5 : 100).map(order => {
                const status = statusConfig[order.estado] || statusConfig.pendiente
                return (
                  <tr key={order.idPedido || order.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={tdStyle}>
                      <strong style={{ color: '#2d6a4f' }}>{order.idPedido || `#${order.id}`}</strong>
                      <br />
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        {new Date(order.fechaPedido).toLocaleDateString('es-PE')}
                      </span>
                    </td>
                    <td style={tdStyle}>{order.comprador?.nombre || 'N/A'}</td>
                    <td style={tdStyle}>
                      {order.items?.map((item, j) => (
                        <div key={j} style={{ fontSize: '0.85rem' }}>
                          {item.productName || item.nombre} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#2d6a4f' }}>
                      S/ {order.total.toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '0.3rem 0.8rem', borderRadius: '20px',
                        fontSize: '0.8rem', fontWeight: 600,
                        background: status.bg, color: status.color,
                      }}>
                        {status.icon} {order.estado}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {order.estado !== 'completado' && order.estado !== 'cancelado' && (
                        <select
                          value={order.estado}
                          onChange={e => handleStatusChange(order.idPedido || order.id, e.target.value)}
                          style={{
                            padding: '0.4rem', borderRadius: '8px',
                            border: '1px solid #e5e7eb', fontSize: '0.8rem', cursor: 'pointer',
                          }}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="en_camino">En Camino</option>
                          <option value="completado">Completado</option>
                        </select>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {localOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
              No hay pedidos registrados
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const thStyle = {
  textAlign: 'left', padding: '0.8rem',
  color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '1px',
}

const tdStyle = {
  padding: '0.8rem', verticalAlign: 'top',
}

export default AdminPanel