import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { QrCode, TrendingUp, Eye, Plus, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/analytics/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your QR code overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total QR Codes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalQRCodes || 0}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <QrCode className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active QR Codes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.activeQRCodes || 0}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Scans</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalScans || 0}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Scans This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.scansThisMonth || 0}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-2">Create Your First QR Code</h2>
            <p className="text-purple-100">Generate dynamic QR codes in seconds</p>
          </div>
          <Link
            to="/create-qr"
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create QR Code</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing QR Codes */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performing QR Codes</h3>
          <div className="space-y-4">
            {stats?.topQRCodes && stats.topQRCodes.length > 0 ? (
              stats.topQRCodes.map((qr, index) => (
                <Link
                  key={qr._id}
                  to={`/analytics/${qr._id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-purple-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{qr.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{qr.targetUrl}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{qr.totalScans}</p>
                    <p className="text-xs text-gray-500">scans</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No QR codes yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.qrCode?.title}</p>
                    <p className="text-sm text-gray-500">
                      {activity.country} • {activity.device}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No activity yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;