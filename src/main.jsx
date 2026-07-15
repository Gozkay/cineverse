import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { initializeDatabase } from '@/data/db'
import ErrorBoundary from '@/components/ErrorBoundary'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient()

function AppInitializer({ children }) {
  useEffect(() => {
    initializeDatabase()
  }, [])
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppInitializer>
                  <App />
                </AppInitializer>
              </WishlistProvider>
            </CartProvider>
            <Toaster position="top-center" reverseOrder={false} toastOptions={{
              style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
            }} />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
