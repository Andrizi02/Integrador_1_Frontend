const API_URL = 'http://localhost:8080/api'

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Credenciales inválidas')
    return res.json()
  },

  async register(userData) {
    const res = await fetch(`${API_URL}/usuarios/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (!res.ok) throw new Error('Error al registrar')
    return res.json()
  },

  // Productos
  async getProductos() {
    const res = await fetch(`${API_URL}/productos`)
    if (!res.ok) throw new Error('Error al cargar productos')
    return res.json()
  },

  async getProducto(id) {
    const res = await fetch(`${API_URL}/productos/${id}`)
    if (!res.ok) throw new Error('Producto no encontrado')
    return res.json()
  },

  async buscarProductos(query) {
    const res = await fetch(`${API_URL}/productos/buscar?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Error en búsqueda')
    return res.json()
  },

  async crearProducto(producto) {
    const res = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    })
    if (!res.ok) throw new Error('Error al crear producto')
    return res.json()
  },

  // Pedidos
  async getPedidos() {
    const res = await fetch(`${API_URL}/pedidos`)
    return res.json()
  },

  async getPedidosPorUsuario(idUsuario) {
    const res = await fetch(`${API_URL}/pedidos/usuario/${idUsuario}`)
    return res.json()
  },

  async crearPedido(idComprador, items) {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idComprador, items }),
    })
    if (!res.ok) throw new Error('Error al crear pedido')
    return res.json()
  },

  async actualizarEstadoPedido(id, estado) {
    const res = await fetch(`${API_URL}/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    return res.json()
  },

  // Carrito
  async getCarrito(idUsuario) {
    const res = await fetch(`${API_URL}/carrito/${idUsuario}`)
    return res.json()
  },

  async agregarAlCarrito(idUsuario, idProducto, cantidad = 1) {
    const res = await fetch(`${API_URL}/carrito`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario, idProducto, cantidad }),
    })
    if (!res.ok) throw new Error('Error al agregar al carrito')
    return res.json()
  },

  async eliminarDelCarrito(idCarrito) {
    await fetch(`${API_URL}/carrito/${idCarrito}`, { method: 'DELETE' })
  },

  async vaciarCarrito(idUsuario) {
    await fetch(`${API_URL}/carrito/usuario/${idUsuario}`, { method: 'DELETE' })
  },

  // Reseñas
  async getResenas(idProducto) {
    const res = await fetch(`${API_URL}/resenas/producto/${idProducto}`)
    return res.json()
  },

  async crearResena(resena) {
    const res = await fetch(`${API_URL}/resenas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resena),
    })
    return res.json()
  },

  // Notificaciones
  async getNotificaciones(idUsuario) {
    const res = await fetch(`${API_URL}/notificaciones/${idUsuario}`)
    return res.json()
  },

  async contarNoLeidas(idUsuario) {
    const res = await fetch(`${API_URL}/notificaciones/${idUsuario}/no-leidas`)
    return res.json()
  },
}