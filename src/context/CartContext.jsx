import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('agroconnect_cart')
    return saved ? JSON.parse(saved) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('agroconnect_orders')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('agroconnect_cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('agroconnect_orders', JSON.stringify(orders))
    // Disparar evento para actualizar en tiempo real
    window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: orders }))
  }, [orders])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => (item.idProducto || item.id) === (product.idProducto || product.id))
      if (existing) {
        return prev.map(item =>
          (item.idProducto || item.id) === (product.idProducto || product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { 
        ...product, 
        quantity,
        idCart: Date.now(),
        productId: product.idProducto || product.id,
        productName: product.nombre,
        productPrice: product.precioUnitario,
        productImage: product.categoria?.icono || '📦'
      }]
    })
    setIsCartOpen(true)
    return { success: true }
  }

  const removeFromCart = (idCart) => {
    setCart(prev => prev.filter(item => item.idCart !== idCart))
  }

  const updateQuantity = (idCart, quantity) => {
    if (quantity < 1) {
      removeFromCart(idCart)
      return
    }
    setCart(prev => prev.map(item =>
      item.idCart === idCart ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setCart([])
    setIsCartOpen(false)
  }

  const createOrder = (buyerInfo) => {
    if (cart.length === 0) return null

    const newOrder = {
      idPedido: 'PED-' + Date.now(),
      id: Date.now(),
      comprador: buyerInfo,
      items: [...cart],
      estado: 'pendiente',
      total: totalPrice,
      fechaPedido: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    }

    setOrders(prev => [newOrder, ...prev])
    clearCart()
    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      (order.idPedido === orderId || order.id === orderId)
        ? { ...order, estado: newStatus, fechaActualizacion: new Date().toISOString() }
        : order
    ))
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
  const totalPrice = cart.reduce((sum, item) => sum + ((item.productPrice || item.precioUnitario || 0) * (item.quantity || 0)), 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      createOrder,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      totalPrice,
      orders,
      updateOrderStatus,
    }}>
      {children}
    </CartContext.Provider>
  )
}