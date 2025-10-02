// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, QrCode, Eye, TrendingUp, Shield, Activity, Search, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data.stats);

      if (activeTab === 'users') {
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data.users);
      } else if (activeTab === 'qrcodes') {
        const qrResponse = await api.get('/admin/qr-codes');
        setQrCodes(qrResponse.data.qrCodes);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      fetchAdminData();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.phone && user.phone.includes(searchTerm));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesStatus;
  });

  // Filter QR codes based on search
  const filteredQRCodes = qrCodes.filter(qr => {
    return qr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           qr.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (qr.user?.name && qr.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-10 w-10 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-gray-600">Platform-wide statistics and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalUsers || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                <span className="font-semibold">+{stats?.newUsersThisMonth || 0}</span> this month
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total QR Codes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalQRCodes || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                <span className="font-semibold">+{stats?.newQRCodesThisMonth || 0}</span> this month
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <QrCode className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalClicks || 0}</p>
              <p className="text-sm text-green-600 mt-1">
                <span className="font-semibold">+{stats?.clicksThisMonth || 0}</span> this month
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeUsers || 0}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats?.totalUsers > 0 
                  ? Math.round((stats?.activeUsers / stats?.totalUsers) * 100)
                  : 0}% active rate
              </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl">
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="inline h-4 w-4 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="inline h-4 w-4 mr-2" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('qrcodes')}
              className={`py-4 px-3 border-b-2 font-medium text-sm transition ${
                activeTab === 'qrcodes'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <QrCode className="inline h-4 w-4 mr-2" />
              QR Codes ({qrCodes.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top Users */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top Users by QR Codes</h3>
                <div className="space-y-3">
                  {stats?.topUsers && stats.topUsers.length > 0 ? (
                    stats.topUsers.map((user, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex items-center space-x-4">
                          <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center font-bold text-purple-600">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-purple-600">{user.qrCount} QR Codes</p>
                          <p className="text-sm text-gray-500">{user.totalScans} total scans</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No users yet</p>
                  )}
                </div>
              </div>

              {/* Platform Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <p className="text-purple-700 font-semibold mb-2">Platform Growth</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {stats?.totalUsers > 0 && stats?.newUsersThisMonth > 0
                      ? `+${Math.round((stats.newUsersThisMonth / stats.totalUsers) * 100)}%`
                      : '0%'
                    }
                  </p>
                  <p className="text-sm text-purple-600 mt-1">User growth this month</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <p className="text-blue-700 font-semibold mb-2">Engagement Rate</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats?.totalQRCodes > 0
                      ? Math.round((stats.totalClicks / stats.totalQRCodes) * 10) / 10
                      : 0
                    }
                  </p>
                  <p className="text-sm text-blue-600 mt-1">Avg scans per QR code</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <p className="text-green-700 font-semibold mb-2">Activity This Month</p>
                  <p className="text-3xl font-bold text-green-900">{stats?.clicksThisMonth || 0}</p>
                  <p className="text-sm text-green-600 mt-1">Total clicks</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                {/* User Distribution */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">User Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Active', value: stats?.activeUsers || 0 },
                          { name: 'Inactive', value: (stats?.totalUsers || 0) - (stats?.activeUsers || 0) }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Growth Chart */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Monthly Growth</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[
                      { name: 'Users', current: stats?.totalUsers || 0, new: stats?.newUsersThisMonth || 0 },
                      { name: 'QR Codes', current: stats?.totalQRCodes || 0, new: stats?.newQRCodesThisMonth || 0 },
                      { name: 'Clicks', current: stats?.totalClicks || 0, new: stats?.clicksThisMonth || 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" fill="#8b5cf6" name="Total" />
                      <Bar dataKey="new" fill="#3b82f6" name="This Month" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">All Users</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredUsers.length} of {users.length} users
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Verified</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.email || user.phone}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'superadmin' 
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.isVerified
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            {user.role !== 'superadmin' && (
                              <button
                                onClick={() => handleToggleUserStatus(user._id)}
                                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition text-sm font-medium"
                              >
                                {user.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-gray-500">
                          No users found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* QR Codes Tab */}
          {activeTab === 'qrcodes' && (
            <div>
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search QR codes by title, URL, or owner..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">All QR Codes</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredQRCodes.length} of {qrCodes.length} QR codes
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Owner</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Target URL</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Scans</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQRCodes.length > 0 ? (
                      filteredQRCodes.map((qr) => (
                        <tr key={qr._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">{qr.title}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{qr.user?.name || 'Unknown'}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            <a 
                              href={qr.targetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 truncate block max-w-xs hover:underline"
                            >
                              {qr.targetUrl}
                            </a>
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-purple-600">{qr.totalScans}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              qr.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {qr.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(qr.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-gray-500">
                          No QR codes found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};