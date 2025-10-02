import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Eye, Globe, Smartphone, Calendar, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QRAnalytics = () => {
  const { qrId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('day');

  useEffect(() => {
    fetchAnalytics();
  }, [qrId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get(`/analytics/${qrId}?groupBy=${timeRange}`);
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/qr-codes"
        className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to QR Codes
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{analytics.qrCode.title}</h1>
        <p className="text-gray-600 mt-2">{analytics.qrCode.targetUrl}</p>
        <p className="text-sm text-gray-500 mt-1">
          Created on {new Date(analytics.qrCode.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalClicks}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Countries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.clicksByCountry.length}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-xl">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Devices</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.clicksByDevice.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg. Daily</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Math.round(analytics.totalClicks / Math.max(analytics.clicksOverTime.length, 1))}
              </p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Clicks Over Time</h3>
          <div className="flex space-x-2">
            {['hour', 'day', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.clicksOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Clicks by Country */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Clicks by Country</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.clicksByCountry}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks by Device */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Clicks by Device</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.clicksByDevice}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, percent }) => `${_id}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="_id"
              >
                {analytics.clicksByDevice.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clicks by Browser */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Clicks by Browser</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {analytics.clicksByBrowser.map((browser, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">{browser.count}</p>
              <p className="text-sm text-gray-600 mt-1">{browser._id || 'Unknown'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Clicks */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Clicks</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">City</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Device</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Browser</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentClicks.map((click, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(click.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{click.country || 'Unknown'}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{click.city || 'Unknown'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {click.device}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{click.browser || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QRAnalytics;