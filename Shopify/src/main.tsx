import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { AuthProvider } from './context/auth/authContext.tsx'
import { CartProvider } from './context/cartContext/cartProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <CartProvider>
        <App />
    </CartProvider>
    </AuthProvider>
  
  </StrictMode>,
)
