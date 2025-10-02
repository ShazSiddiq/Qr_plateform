import React, { useState } from 'react';
import api from '../services/api';
import { Settings, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const AdminTools = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFixQRCodes = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/qr/fix-existing');
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fix QR codes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Admin Tools
        </h1>
        <p className="text-gray-600 mt-2">Administrative tools and utilities</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">QR Code Management</h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 font-semibold">{result.message}</p>
            </div>
            <div className="text-sm text-green-600">
              <p>Fixed: {result.fixedCount} / {result.totalCodes} QR codes</p>
              {result.errors && result.errors.length > 0 && (
                <p className="mt-1">Errors: {result.errors.length}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Fix Existing QR Codes
            </h3>
            <p className="text-gray-600 mb-4">
              This will regenerate all existing QR codes to ensure they use the correct redirect URLs for proper tracking and analytics.
            </p>
            <button
              onClick={handleFixQRCodes}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Fixing QR Codes...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  <span>Fix All QR Codes</span>
                </>
              )}
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How QR Code Tracking Works
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <p>QR codes are generated with a redirect URL: <code className="bg-gray-100 px-2 py-1 rounded">yourserver.com/api/qr/r/shortcode</code></p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <p>When scanned, the redirect URL tracks the click (IP, device, location, etc.)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <p>After tracking, users are redirected to the actual target URL</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                <p>Analytics are updated in real-time and displayed in the dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTools;