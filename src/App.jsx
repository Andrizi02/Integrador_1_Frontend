import { Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartIcon from './components/CartIcon'
import CartModal from './components/CartModal'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import ProductRegistration from './pages/ProductRegistration'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main style={{
          flex: 1,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(1rem, 3vw, 2rem) clamp(0.8rem, 2vw, 1.5rem)',
          width: '100%',
        }}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas - requieren iniciar sesión */}
            <Route path="/orders" element={
              <ProtectedRoute allowedRoles={['comprador', 'productor', 'admin', 'administrador']}>
                <Orders />
              </ProtectedRoute>
            } />
            
            {/* Solo productores */}
            <Route path="/register-product" element={
              <ProtectedRoute allowedRoles={['productor']}>
                <ProductRegistration />
              </ProtectedRoute>
            } />

            {/* Solo administradores */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'administrador']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <CartIcon />
        <CartModal />
        <SpeedInsights />
      </CartProvider>
    </AuthProvider>
  )
}

export default App