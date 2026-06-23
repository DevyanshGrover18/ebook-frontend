import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Checkout from './pages/Checkout';
import BooksList from './pages/BooksList';
import OrderStatus from './pages/OrderStatus';
import { ToastProvider } from './context/ToastContext.jsx';

// Admin
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminBooks from './pages/admin/AdminBooks.jsx';
import AdminCategories from './pages/admin/AdminCategories.jsx';
import AdminFaqs from './pages/admin/AdminFaqs.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';

import MainLayout from './components/layout/MainLayout.jsx';
import CheckoutLayout from './components/layout/CheckoutLayout.jsx';
import AdminBookRequests from './pages/admin/AdminBookRequests.jsx';

const App = () => {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes wrapped with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BooksList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/order-status" element={<OrderStatus />} />
            </Route>
            
            {/* Checkout route wrapped with CheckoutLayout */}
            <Route element={<CheckoutLayout />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="faqs" element={<AdminFaqs />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="book-requests" element={<AdminBookRequests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AdminAuthProvider>
  );
};

export default App;



