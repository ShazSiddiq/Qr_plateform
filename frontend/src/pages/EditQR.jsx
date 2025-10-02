import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Link as LinkIcon, Save, ArrowLeft, History } from 'lucide-react';

const EditQR = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQRCode();
  }, [id]);

  const fetchQRCode = async () => {
    try {
      const response = await api.get(`/qr/${id}`);
      setQrCode(response.data.qrCode);
      setTargetUrl(response.data.qrCode.targetUrl);
    } catch (err) {
      setError('Failed to fetch QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUrl = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/qr/${id}/update-url`, { targetUrl });
      setQrCode(response.data.qrCode);
      setSuccess('Target URL updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update URL');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">QR Code Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/qr-codes')}
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to QR Codes</span>
        </button>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Edit QR Code: {qrCode.title}
        </h1>
        <p className="text-gray-600 mt-2">Update the target URL without changing the QR code</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dynamic URL Update</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleUpdateUrl} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Target URL
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The QR code image stays the same, but scans will redirect to this new URL
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || targetUrl === qrCode.targetUrl}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? 'Updating...' : 'Update Target URL'}</span>
            </button>
          </form>
        </div>

        {/* QR Code Info */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">QR Code Information</h3>
          
          <div className="bg-white rounded-xl p-6 shadow-inner mb-6">
            <div className="text-center">
              <img 
                src={qrCode.qrImage} 
                alt={qrCode.title}
                className="w-48 h-48 mx-auto object-contain"
              />
              <p className="mt-4 text-sm text-gray-600 font-medium">{qrCode.title}</p>
              <p className="text-xs text-gray-500 mt-1">Scans: {qrCode.totalScans}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Redirect URL</label>
              <p className="text-sm text-gray-500 break-all">{qrCode.redirectUrl}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                qrCode.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {qrCode.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="text-sm text-gray-500">
                {new Date(qrCode.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {qrCode.urlHistory && qrCode.urlHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <History className="h-4 w-4 mr-2" />
                URL History
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {qrCode.urlHistory.slice(-5).reverse().map((history, index) => (
                  <div key={index} className="text-xs">
                    <p className="text-gray-600 truncate">{history.url}</p>
                    <p className="text-gray-400">
                      {new Date(history.changedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditQR;