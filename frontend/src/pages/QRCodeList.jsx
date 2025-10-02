// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../services/api';
// import { Eye, Edit2, Trash2, Download, Power, QrCode as QrIcon } from 'lucide-react';

// const QRCodeList = () => {
//   const [qrCodes, setQrCodes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     fetchQRCodes();
//   }, [page]);

//   const fetchQRCodes = async () => {
//     try {
//       const response = await api.get(`/qr/my-codes?page=${page}&limit=12`);
//       setQrCodes(response.data.qrCodes);
//       setTotalPages(response.data.pages);
//     } catch (error) {
//       console.error('Error fetching QR codes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleStatus = async (id) => {
//     try {
//       await api.put(`/qr/${id}/toggle-status`);
//       fetchQRCodes();
//     } catch (error) {
//       console.error('Error toggling status:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    
//     try {
//       await api.delete(`/qr/${id}`);
//       fetchQRCodes();
//     } catch (error) {
//       console.error('Error deleting QR code:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//             My QR Codes
//           </h1>
//           <p className="text-gray-600 mt-2">Manage all your QR codes in one place</p>
//         </div>
//         <Link
//           to="/create-qr"
//           className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
//         >
//           + Create New
//         </Link>
//       </div>

//       {qrCodes.length === 0 ? (
//         <div className="text-center py-16">
//           <QrIcon className="mx-auto h-24 w-24 text-gray-300" />
//           <h3 className="mt-4 text-xl font-semibold text-gray-900">No QR codes yet</h3>
//           <p className="mt-2 text-gray-500">Get started by creating your first QR code</p>
//           <Link
//             to="/create-qr"
//             className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
//           >
//             Create QR Code
//           </Link>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {qrCodes.map((qr) => (
//               <div key={qr._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition">
//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-4">
//                     <h3 className="text-lg font-bold text-gray-900 truncate flex-1">{qr.title}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       qr.isActive 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'bg-red-100 text-red-700'
//                     }`}>
//                       {qr.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </div>
                  
//                   <p className="text-sm text-gray-500 truncate mb-4">{qr.targetUrl}</p>
                  
//                   <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                     <div className="grid grid-cols-2 gap-4 text-center">
//                       <div>
//                         <p className="text-2xl font-bold text-purple-600">{qr.totalScans}</p>
//                         <p className="text-xs text-gray-500">Total Scans</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-700">
//                           {qr.lastScannedAt 
//                             ? new Date(qr.lastScannedAt).toLocaleDateString()
//                             : 'Never'
//                           }
//                         </p>
//                         <p className="text-xs text-gray-500">Last Scan</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <Link
//                       to={`/analytics/${qr._id}`}
//                       className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
//                     >
//                       <Eye className="h-4 w-4" />
//                       <span className="text-sm font-medium">Analytics</span>
//                     </Link>
                    
//                     <button
//                       onClick={() => handleToggleStatus(qr._id)}
//                       className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
//                       title={qr.isActive ? 'Deactivate' : 'Activate'}
//                     >
//                       <Power className="h-4 w-4" />
//                     </button>
                    
//                     <button
//                       onClick={() => handleDelete(qr._id)}
//                       className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
//                       title="Delete"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center space-x-4 mt-8">
//               <button
//                 onClick={() => setPage(p => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//               >
//                 Previous
//               </button>
//               <span className="text-gray-600">
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default QRCodeList;





import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Eye, Edit2, Trash2, Download, Power, QrCode as QrIcon } from 'lucide-react';

const QRCodeList = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQR, setSelectedQR] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchQRCodes();
  }, [page]);

  const fetchQRCodes = async () => {
    try {
      const response = await api.get(`/qr/my-codes?page=${page}&limit=12`);
      setQrCodes(response.data.qrCodes);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/qr/${id}/toggle-status`);
      fetchQRCodes();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;
    
    try {
      await api.delete(`/qr/${id}`);
      fetchQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  const handleViewQR = (qr) => {
    setSelectedQR(qr);
    setShowModal(true);
  };

  const handleDownload = (qr) => {
    const link = document.createElement('a');
    link.href = qr.qrImage;
    link.download = `${qr.title.replace(/[^a-z0-9]/gi, '_')}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My QR Codes
          </h1>
          <p className="text-gray-600 mt-2">Manage all your QR codes in one place</p>
        </div>
        <Link
          to="/create-qr"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
        >
          + Create New
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="text-center py-16">
          <QrIcon className="mx-auto h-24 w-24 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">No QR codes yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first QR code</p>
          <Link
            to="/create-qr"
            className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
          >
            Create QR Code
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <div key={qr._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition">
                {/* QR Code Image Preview */}
                <div 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => handleViewQR(qr)}
                  style={{ minHeight: '200px' }}
                >
                  {qr.qrImage ? (
                    <img 
                      src={qr.qrImage} 
                      alt={qr.title}
                      className="w-40 h-40 object-contain"
                    />
                  ) : (
                    <QrIcon className="w-40 h-40 text-gray-300" />
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate flex-1">{qr.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      qr.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {qr.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 truncate mb-4">{qr.targetUrl}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{qr.totalScans}</p>
                        <p className="text-xs text-gray-500">Total Scans</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          {qr.lastScannedAt 
                            ? new Date(qr.lastScannedAt).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                        <p className="text-xs text-gray-500">Last Scan</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/analytics/${qr._id}`}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Analytics</span>
                    </Link>
                    
                    <Link
                      to={`/edit-qr/${qr._id}`}
                      className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                      title="Edit URL"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDownload(qr)}
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleToggleStatus(qr._id)}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                      title={qr.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(qr._id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* QR Code Modal */}
      {showModal && selectedQR && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedQR.title}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <img 
                  src={selectedQR.qrImage} 
                  alt={selectedQR.title}
                  className="w-64 h-64 object-contain"
                />
              </div>

              <p className="text-gray-600 mb-2">Target URL:</p>
              <a 
                href={selectedQR.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 underline mb-4 text-center break-all"
              >
                {selectedQR.targetUrl}
              </a>

              <p className="text-gray-600 mb-2">Redirect URL:</p>
              <p className="text-sm text-gray-500 mb-6 text-center break-all px-4">
                {selectedQR.redirectUrl || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/api/qr/r/${selectedQR.shortCode}`}
              </p>

              <button
                onClick={() => handleDownload(selectedQR)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg flex items-center justify-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download QR Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            My QR Codes
          </h1>
          <p className="text-gray-600 mt-2">Manage all your QR codes in one place</p>
        </div>
        <Link
          to="/create-qr"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
        >
          + Create New
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="text-center py-16">
          <QrIcon className="mx-auto h-24 w-24 text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">No QR codes yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first QR code</p>
          <Link
            to="/create-qr"
            className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
          >
            Create QR Code
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <div key={qr._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate flex-1">{qr.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      qr.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {qr.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 truncate mb-4">{qr.targetUrl}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{qr.totalScans}</p>
                        <p className="text-xs text-gray-500">Total Scans</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          {qr.lastScannedAt 
                            ? new Date(qr.lastScannedAt).toLocaleDateString()
                            : 'Never'
                          }
                        </p>
                        <p className="text-xs text-gray-500">Last Scan</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/analytics/${qr._id}`}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">Analytics</span>
                    </Link>
                    
                    <button
                      onClick={() => handleToggleStatus(qr._id)}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                      title={qr.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(qr._id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRCodeList;