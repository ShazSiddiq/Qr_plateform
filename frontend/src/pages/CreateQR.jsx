// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import { QrCode, Link as LinkIcon, Palette } from 'lucide-react';

// const CreateQR = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     targetUrl: '',
//     foregroundColor: '#000000',
//     backgroundColor: '#FFFFFF'
//   });
//   const [qrPreview, setQrPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await api.post('/qr/create', {
//         title: formData.title,
//         targetUrl: formData.targetUrl,
//         customization: {
//           foregroundColor: formData.foregroundColor,
//           backgroundColor: formData.backgroundColor
//         }
//       });
      
//       navigate('/qr-codes');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create QR code');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//           Create QR Code
//         </h1>
//         <p className="text-gray-600 mt-2">Generate a dynamic QR code with custom styling</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Form Section */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
//           {error && (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 QR Code Title *
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 placeholder="My Website QR Code"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Target URL *
//               </label>
//               <div className="relative">
//                 <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="url"
//                   name="targetUrl"
//                   value={formData.targetUrl}
//                   onChange={handleChange}
//                   required
//                   className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="https://example.com"
//                 />
//               </div>
//               <p className="mt-2 text-sm text-gray-500">
//                 You can change this URL later without regenerating the QR code
//               </p>
//             </div>

//             <div className="pt-6 border-t border-gray-200">
//               <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
//                 <Palette className="h-5 w-5 mr-2 text-purple-600" />
//                 Customization
//               </h3>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Foreground Color
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="color"
//                       name="foregroundColor"
//                       value={formData.foregroundColor}
//                       onChange={handleChange}
//                       className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
//                     />
//                     <input
//                       type="text"
//                       value={formData.foregroundColor}
//                       onChange={(e) => setFormData({ ...formData, foregroundColor: e.target.value })}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Background Color
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <input
//                       type="color"
//                       name="backgroundColor"
//                       value={formData.backgroundColor}
//                       onChange={handleChange}
//                       className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
//                     />
//                     <input
//                       type="text"
//                       value={formData.backgroundColor}
//                       onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
//             >
//               {loading ? 'Creating QR Code...' : 'Create QR Code'}
//             </button>
//           </form>
//         </div>

//         {/* Preview Section */}
//         <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-gray-100 p-8">
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Preview</h3>
          
//           <div className="bg-white rounded-xl p-8 shadow-inner flex items-center justify-center" style={{ minHeight: '400px' }}>
//             {formData.targetUrl ? (
//               <div className="text-center">
//                 <div 
//                   className="inline-block p-6 rounded-xl shadow-lg"
//                   style={{ backgroundColor: formData.backgroundColor }}
//                 >
//                   <QrCode 
//                     className="h-64 w-64" 
//                     style={{ color: formData.foregroundColor }}
//                   />
//                 </div>
//                 <p className="mt-6 text-sm text-gray-600 font-medium">{formData.title || 'Untitled QR Code'}</p>
//                 <p className="text-xs text-gray-500 mt-1 break-all px-4">{formData.targetUrl}</p>
//               </div>
//             ) : (
//               <div className="text-center text-gray-400">
//                 <QrCode className="h-32 w-32 mx-auto mb-4" />
//                 <p className="text-sm">Enter a URL to see preview</p>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
//             <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
//             <ul className="space-y-2 text-sm text-gray-600">
//               <li className="flex items-center">
//                 <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
//                 Dynamic URL - Change anytime
//               </li>
//               <li className="flex items-center">
//                 <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
//                 Unlimited scans
//               </li>
//               <li className="flex items-center">
//                 <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
//                 Detailed analytics
//               </li>
//               <li className="flex items-center">
//                 <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
//                 Custom branding
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateQR;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { QrCode, Link as LinkIcon, Palette } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CreateQR = () => {
  const [formData, setFormData] = useState({
    title: '',
    targetUrl: '',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF'
  });
  const [qrPreview, setQrPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/qr/create', {
        title: formData.title,
        targetUrl: formData.targetUrl,
        customization: {
          foregroundColor: formData.foregroundColor,
          backgroundColor: formData.backgroundColor
        }
      });
      
      toast.success('QR Code created successfully!');
      navigate('/qr-codes');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create QR code';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Create QR Code
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Generate a dynamic QR code with custom styling</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="My Website QR Code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL *
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  name="targetUrl"
                  value={formData.targetUrl}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                You can change this URL later without regenerating the QR code
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <Palette className="h-5 w-5 mr-2 text-purple-600" />
                Customization
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foreground Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="foregroundColor"
                      value={formData.foregroundColor}
                      onChange={handleChange}
                      className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.foregroundColor}
                      onChange={(e) => setFormData({ ...formData, foregroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? 'Creating QR Code...' : 'Create QR Code'}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Preview</h3>
          
          <div className="bg-white rounded-xl p-8 shadow-inner flex items-center justify-center" style={{ minHeight: '400px' }}>
            {formData.targetUrl ? (
              <div className="text-center">
                <div 
                  className="inline-block p-6 rounded-xl shadow-lg"
                  style={{ backgroundColor: formData.backgroundColor }}
                >
                  <QrCode 
                    className="h-64 w-64" 
                    style={{ color: formData.foregroundColor }}
                  />
                </div>
                <p className="mt-6 text-sm text-gray-600 font-medium">{formData.title || 'Untitled QR Code'}</p>
                <p className="text-xs text-gray-500 mt-1 break-all px-4">{formData.targetUrl}</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <QrCode className="h-32 w-32 mx-auto mb-4" />
                <p className="text-sm">Enter a URL to see preview</p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Dynamic URL - Change anytime
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Unlimited scans
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Detailed analytics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Custom branding
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </div>
  );
};

export default CreateQR;