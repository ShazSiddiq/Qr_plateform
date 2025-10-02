// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRCodeList from './pages/QRCodeList';
import CreateQR from './pages/CreateQR';
import EditQR from './pages/EditQR';
import QRAnalytics from './pages/QRAnalytics';
import {AdminDashboard} from './pages/AdminDashboard';
import AdminTools from './pages/AdminTools';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/qr-codes" element={
              <PrivateRoute>
                <QRCodeList />
              </PrivateRoute>
            } />
            
            <Route path="/create-qr" element={
              <PrivateRoute>
                <CreateQR />
              </PrivateRoute>
            } />
            
            <Route path="/edit-qr/:id" element={
              <PrivateRoute>
                <EditQR />
              </PrivateRoute>
            } />
            
            <Route path="/analytics/:qrId" element={
              <PrivateRoute>
                <QRAnalytics />
              </PrivateRoute>
            } />
            
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/admin/tools" element={
              <AdminRoute>
                <AdminTools />
              </AdminRoute>
            } />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;