
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

import UserProfile from './components/UserProfile'

import ProductPage from './pages/ProductPage'
import ProductDetails from './pages/ProductDetailsPage'

import MainLayout from './layouts/MainLayout'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './routers/ProtectedRoutes'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterPage from './pages/RegisterPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistory from './pages/OrderPage'
import ChatPage from './pages/ChatPage'
import AdminAddProductPage from './pages/AdminAddProductPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { useAuth } from './context/auth/authContext';

function App() {
  const { state } = useAuth();
  const isAdmin = state.isAuthenticated && state.user?.role === "admin";

  return (
    <>
    
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout/>}>
      
     
      <Route path="/" element={isAdmin ? <Navigate to="/user" replace /> : <ProductPage/>}></Route>
      <Route path='/product/:slug' element={isAdmin ? <Navigate to="/user" replace /> : <ProductDetails/>}></Route>
       <Route path="/user" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
       <Route path="/chat/:targetId" element={<ProtectedRoute><ChatPage/></ProtectedRoute>} />
       <Route path="/admin/products/new" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAddProductPage/></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute allowedRoles={["user"]}><OrderHistory/></ProtectedRoute>} />
       <Route path="/cart" element={<ProtectedRoute allowedRoles={["user"]}><CartPage /></ProtectedRoute>} ></Route>
       <Route path="/checkout" element={<ProtectedRoute allowedRoles={["user"]}><CheckoutPage /></ProtectedRoute>} ></Route>
       <Route path="/register" element={state.isAuthenticated ? <Navigate to={isAdmin ? "/user" : "/"} replace /> : <RegisterPage/>}></Route>
        <Route path="/login" element={state.isAuthenticated ? <Navigate to={isAdmin ? "/user" : "/"} replace /> : <LoginPage />} ></Route>
       <Route path="/forgot-password" element={<ForgotPasswordPage />} />
       <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} ></Route>
      </Route>

    </Routes>
    
    </BrowserRouter>
     <ToastContainer
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    
     
    </>
  )
}

export default App
