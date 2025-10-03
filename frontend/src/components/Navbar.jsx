import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, LayoutDashboard, List, Plus, Shield, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                QR System
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-24 sm:max-w-none">{user.name}</p>
              <p className="text-xs text-gray-500 truncate max-w-24 sm:max-w-none">{user.email || user.phone}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition shadow-md"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/qr-codes"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition text-sm"
            >
              <List className="h-4 w-4" />
              <span>QR Codes</span>
            </Link>
            
            <Link
              to="/create-qr"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Link>
            
            {isSuperAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition text-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <Link
                  to="/admin/tools"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition text-sm"
                >
                  <Shield className="h-4 w-4" />
                  <span>Tools</span>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:absolute md:top-4 md:left-1/2 md:transform md:-translate-x-1/2">
          <div className="flex space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/qr-codes"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              <List className="h-4 w-4" />
              <span>My QR Codes</span>
            </Link>
            
            <Link
              to="/create-qr"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Create QR</span>
            </Link>
            
            {isSuperAdmin && (
              <>
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
                <Link
                  to="/admin/tools"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
                >
                  <Shield className="h-4 w-4" />
                  <span>Tools</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;