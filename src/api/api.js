import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agroconnect_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agroconnect_token')
      localStorage.removeItem('agroconnect_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  // ============ AUTENTICACIÓN ============
  async login(email, password) {
    try {
      const { data } = await api.post('/usuarios/login', { email, password })
      if (data.token) {
        localStorage.setItem('agroconnect_token', data.token)
        localStorage.setItem('agroconnect_user', JSON.stringify(data))
      }
      return { success: true, data }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión'
      return { success: false, message }
    }
  },

  async register(userData) {
    try {
      const { data } = await api.post('/usuarios/registro', userData)
      return { success: true, data }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar'
      return { success: false, message }
    }
  },

  logout() {
    localStorage.removeItem('agroconnect_token')
    localStorage.removeItem('agroconnect_user')
  },

  getCurrentUser() {
    const user = localStorage.getItem('agroconnect_user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('agroconnect_token')
  },

  async getUserProfile(id) {
    const { data } = await api.get(`/usuarios/${id}`)
    return data
  },

  // ============ PRODUCTOS ============
  async getProductos() {
    const { data } = await api.get('/productos')
    return data
  },

  async getProducto(id) {
    const { data } = await api.get(`/productos/${id}`)
    return data
  },

  async buscarProductos(query) {
    const { data } = await api.get(`/productos/buscar?q=${query}`)
    return data
  },

  async crearProducto(producto) {
    const { data } = await api.post('/productos', producto)
    return data
  },

  async actualizarProducto(id, producto) {
    const { data } = await api.put(`/productos/${id}`, producto)
    return data
  },

  async eliminarProducto(id) {
    await api.delete(`/productos/${id}`)
  },

  // ============ PEDIDOS ============
  async getPedidos() {
    const { data } = await api.get('/pedidos')
    return data
  },

  async getPedidosUsuario(idUsuario) {
    const { data } = await api.get(`/pedidos/usuario/${idUsuario}`)
    return data
  },

  async crearPedido(idComprador, items) {
    const { data } = await api.post('/pedidos', { idComprador, items })
    return data
  },

  async actualizarEstadoPedido(id, estado) {
    const { data } = await api.put(`/pedidos/${id}/estado`, { estado })
    return data
  },

  // ============ CARRITO ============
  async getCarrito(idUsuario) {
    const { data } = await api.get(`/carrito/${idUsuario}`)
    return data
  },

  async agregarAlCarrito(idUsuario, idProducto, cantidad = 1) {
    const { data } = await api.post('/carrito', { idUsuario, idProducto, cantidad })
    return data
  },

  async eliminarDelCarrito(idCarrito) {
    await api.delete(`/carrito/${idCarrito}`)
  },

  async vaciarCarrito(idUsuario) {
    await api.delete(`/carrito/usuario/${idUsuario}`)
  },

  // ============ RESEÑAS ============
  async getResenasProducto(idProducto) {
    const { data } = await api.get(`/resenas/producto/${idProducto}`)
    return data
  },

  async crearResena(resena) {
    const { data } = await api.post('/resenas', resena)
    return data
  },

  // ============ NOTIFICACIONES ============
  async getNotificaciones(idUsuario) {
    const { data } = await api.get(`/notificaciones/${idUsuario}`)
    return data
  },

  async getNoLeidas(idUsuario) {
    const { data } = await api.get(`/notificaciones/${idUsuario}/no-leidas`)
    return data
  },

  async marcarLeida(id) {
    await api.put(`/notificaciones/${id}/leer`)
  },
}

export default apiService