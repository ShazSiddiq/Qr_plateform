// import QRCode from '../models/QRCode.js';
// import Click from '../models/Click.js';
// import { generateQRCode } from '../utils/generateQR.js';
// import { getDeviceInfo, getLocationInfo } from '../utils/validators.js';

// // @desc    Create new QR code
// // @route   POST /api/qr/create
// // @access  Private
// export const createQRCode = async (req, res, next) => {
//   try {
//     const { title, targetUrl, customization } = req.body;

//     // Generate QR code image
//     const qrImage = await generateQRCode(targetUrl, customization);

//     // Create QR code document
//     const qrCode = await QRCode.create({
//       user: req.user.id,
//       title,
//       targetUrl,
//       qrImage,
//       customization: customization || {}
//     });

//     // Populate user details
//     await qrCode.populate('user', 'name email');

//     res.status(201).json({
//       success: true,
//       message: 'QR Code created successfully',
//       qrCode
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all QR codes for logged-in user
// // @route   GET /api/qr/my-codes
// // @access  Private
// export const getMyQRCodes = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const qrCodes = await QRCode.find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .select('-qrImage'); // Exclude large image data from list

//     const total = await QRCode.countDocuments({ user: req.user.id });

//     res.json({
//       success: true,
//       count: qrCodes.length,
//       total,
//       page,
//       pages: Math.ceil(total / limit),
//       qrCodes
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get single QR code details
// // @route   GET /api/qr/:id
// // @access  Private
// export const getQRCode = async (req, res, next) => {
//   try {
//     const qrCode = await QRCode.findById(req.params.id);

//     if (!qrCode) {
//       return res.status(404).json({
//         success: false,
//         message: 'QR Code not found'
//       });
//     }

//     // Check ownership
//     if (qrCode.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to access this QR code'
//       });
//     }

//     res.json({
//       success: true,
//       qrCode
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update QR code target URL
// // @route   PUT /api/qr/:id/update-url
// // @access  Private
// export const updateTargetUrl = async (req, res, next) => {
//   try {
//     const { targetUrl } = req.body;

//     const qrCode = await QRCode.findById(req.params.id);

//     if (!qrCode) {
//       return res.status(404).json({
//         success: false,
//         message: 'QR Code not found'
//       });
//     }

//     // Check ownership
//     if (qrCode.user.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to update this QR code'
//       });
//     }

//     qrCode.targetUrl = targetUrl;
//     await qrCode.save();

//     res.json({
//       success: true,
//       message: 'Target URL updated successfully',
//       qrCode
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update QR code customization
// // @route   PUT /api/qr/:id/customize
// // @access  Private
// export const customizeQRCode = async (req, res, next) => {
//   try {
//     const { customization } = req.body;

//     const qrCode = await QRCode.findById(req.params.id);

//     if (!qrCode) {
//       return res.status(404).json({
//         success: false,
//         message: 'QR Code not found'
//       });
//     }

//     // Check ownership
//     if (qrCode.user.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to update this QR code'
//       });
//     }

//     // Regenerate QR code with new customization
//     const qrImage = await generateQRCode(qrCode.targetUrl, customization);

//     qrCode.customization = customization;
//     qrCode.qrImage = qrImage;
//     await qrCode.save();

//     res.json({
//       success: true,
//       message: 'QR Code customized successfully',
//       qrCode
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Toggle QR code active status
// // @route   PUT /api/qr/:id/toggle-status
// // @access  Private
// export const toggleStatus = async (req, res, next) => {
//   try {
//     const qrCode = await QRCode.findById(req.params.id);

//     if (!qrCode) {
//       return res.status(404).json({
//         success: false,
//         message: 'QR Code not found'
//       });
//     }

//     // Check ownership
//     if (qrCode.user.toString() !== req.user.id) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to update this QR code'
//       });
//     }

//     qrCode.isActive = !qrCode.isActive;
//     await qrCode.save();

//     res.json({
//       success: true,
//       message: `QR Code ${qrCode.isActive ? 'activated' : 'deactivated'} successfully`,
//       qrCode
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Delete QR code
// // @route   DELETE /api/qr/:id
// // @access  Private
// export const deleteQRCode = async (req, res, next) => {
//   try {
//     const qrCode = await QRCode.findById(req.params.id);

//     if (!qrCode) {
//       return res.status(404).json({
//         success: false,
//         message: 'QR Code not found'
//       });
//     }

//     // Check ownership
//     if (qrCode.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to delete this QR code'
//       });
//     }

//     await qrCode.deleteOne();

//     // Also delete associated clicks
//     await Click.deleteMany({ qrCode: req.params.id });

//     res.json({
//       success: true,
//       message: 'QR Code deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Redirect to target URL and track click
// // @route   GET /api/qr/r/:shortCode
// // @access  Public
// export const redirectAndTrack = async (req, res, next) => {
//   try {
//     const { shortCode } = req.params;

//     const qrCode = await QRCode.findOne({ shortCode, isActive: true });

//     if (!qrCode) {
//       return res.status(404).send('QR Code not found or inactive');
//     }

//     // Extract tracking information
//     const ipAddress = req.ip || req.connection.remoteAddress;
//     const userAgent = req.headers['user-agent'] || '';
//     const referrer = req.headers.referer || req.headers.referrer || '';
    
//     const deviceInfo = getDeviceInfo(userAgent);
//     const locationInfo = await getLocationInfo(ipAddress);

//     // Create click record
//     await Click.create({
//       qrCode: qrCode._id,
//       user: qrCode.user,
//       ipAddress,
//       userAgent,
//       referrer,
//       ...deviceInfo,
//       ...locationInfo
//     });

//     // Update QR code scan count
//     qrCode.totalScans += 1;
//     qrCode.lastScannedAt = new Date();
//     await qrCode.save();

//     // Redirect to target URL
//     res.redirect(qrCode.targetUrl);
//   } catch (error) {
//     next(error);
//   }
// };





// backend/src/controllers/qrController.js
import QRCode from '../models/QRCode.js';
import Click from '../models/Click.js';
import { generateQRCode } from '../utils/generateQR.js';
import { getDeviceInfo, getLocationInfo } from '../utils/validators.js';

// @desc    Create new QR code
// @route   POST /api/qr/create
// @access  Private
export const createQRCode = async (req, res, next) => {
  try {
    const { title, targetUrl, customization } = req.body;

    // Create QR code document first to get the shortCode
    const qrCode = await QRCode.create({
      user: req.user.id,
      title,
      targetUrl,
      qrImage: 'temp', // Temporary placeholder
      customization: customization || {}
    });

    // Generate the redirect URL using the shortCode
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const redirectUrl = `${baseUrl}/api/qr/r/${qrCode.shortCode}`;

    // Generate QR code image with redirect URL (not target URL)
    const qrImage = await generateQRCode(redirectUrl, customization);

    // Update the QR code with the actual image
    qrCode.qrImage = qrImage;
    await qrCode.save();

    // Populate user details
    await qrCode.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'QR Code created successfully',
      qrCode
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate unique short code
const generateUniqueShortCode = async () => {
  const crypto = await import('crypto');
  let isUnique = false;
  let shortCode;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    shortCode = crypto.randomBytes(6).toString('hex');
    const existing = await QRCode.findOne({ shortCode });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique short code');
  }

  return shortCode;
};

// @desc    Get all QR codes for logged-in user
// @route   GET /api/qr/my-codes
// @access  Private
export const getMyQRCodes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // ✅ CHANGED: Include qrImage in the response
    const qrCodes = await QRCode.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      // Removed .select('-qrImage') to include the QR image

    const total = await QRCode.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: qrCodes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      qrCodes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single QR code details
// @route   GET /api/qr/:id
// @access  Private
export const getQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Check ownership
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this QR code'
      });
    }

    res.json({
      success: true,
      qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update QR code target URL
// @route   PUT /api/qr/:id/update-url
// @access  Private
export const updateTargetUrl = async (req, res, next) => {
  try {
    const { targetUrl } = req.body;

    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Check ownership
    if (qrCode.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this QR code'
      });
    }

    // Add old URL to history
    qrCode.urlHistory.push({
      url: qrCode.targetUrl,
      changedAt: new Date()
    });

    qrCode.targetUrl = targetUrl;
    await qrCode.save();

    res.json({
      success: true,
      message: 'Target URL updated successfully',
      qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update QR code customization
// @route   PUT /api/qr/:id/customize
// @access  Private
export const customizeQRCode = async (req, res, next) => {
  try {
    const { customization } = req.body;

    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Check ownership
    if (qrCode.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this QR code'
      });
    }

    // Generate the redirect URL
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const redirectUrl = `${baseUrl}/api/qr/r/${qrCode.shortCode}`;

    // Regenerate QR code with new customization
    const qrImage = await generateQRCode(redirectUrl, customization);

    qrCode.customization = customization;
    qrCode.qrImage = qrImage;
    await qrCode.save();

    res.json({
      success: true,
      message: 'QR Code customized successfully',
      qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle QR code active status
// @route   PUT /api/qr/:id/toggle-status
// @access  Private
export const toggleStatus = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Check ownership
    if (qrCode.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this QR code'
      });
    }

    qrCode.isActive = !qrCode.isActive;
    await qrCode.save();

    res.json({
      success: true,
      message: `QR Code ${qrCode.isActive ? 'activated' : 'deactivated'} successfully`,
      qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete QR code
// @route   DELETE /api/qr/:id
// @access  Private
export const deleteQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Check ownership
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this QR code'
      });
    }

    await qrCode.deleteOne();

    // Also delete associated clicks
    await Click.deleteMany({ qrCode: req.params.id });

    res.json({
      success: true,
      message: 'QR Code deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Redirect to target URL and track click
// @route   GET /api/qr/r/:shortCode
// @access  Public
export const redirectAndTrack = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    console.log(`QR Code scan attempt for shortCode: ${shortCode}`);

    const qrCode = await QRCode.findOne({ shortCode, isActive: true });

    if (!qrCode) {
      console.log(`QR Code not found or inactive: ${shortCode}`);
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code Not Found</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            h1 { color: #667eea; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ QR Code Not Found</h1>
            <p>This QR code doesn't exist or has been deactivated.</p>
          </div>
        </body>
        </html>
      `);
    }

    console.log(`QR Code found: ${qrCode.title}, Target URL: ${qrCode.targetUrl}`);

    // Extract tracking information
    const ipAddress = req.realIP || req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || req.headers.referrer || '';
    
    console.log(`Tracking info - IP: ${ipAddress}, User Agent: ${userAgent}`);

    const deviceInfo = getDeviceInfo(userAgent);
    const locationInfo = await getLocationInfo(ipAddress);

    console.log(`Device info:`, deviceInfo);
    console.log(`Location info:`, locationInfo);

    // Create click record with explicit field mapping
    try {
      const clickData = {
        qrCode: qrCode._id,
        user: qrCode.user,
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
        referrer: referrer || '',
        device: deviceInfo.device || 'unknown',
        browser: deviceInfo.browser || 'unknown', 
        os: deviceInfo.os || 'unknown',
        country: locationInfo.country || 'Unknown',
        city: locationInfo.city || 'Unknown',
        region: locationInfo.region || 'Unknown'
      };
      
      console.log('Creating click record with data:', clickData);
      
      const clickRecord = await Click.create(clickData);
      console.log(`Click record created:`, clickRecord._id);
    } catch (clickError) {
      console.error('Error creating click record:', clickError);
    }

    // Update QR code scan count
    try {
      qrCode.totalScans += 1;
      qrCode.lastScannedAt = new Date();
      await qrCode.save();
      console.log(`QR Code scan count updated: ${qrCode.totalScans}`);
    } catch (updateError) {
      console.error('Error updating QR code:', updateError);
    }

    // Ensure target URL has protocol
    let targetUrl = qrCode.targetUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    console.log(`Redirecting to: ${targetUrl}`);

    // Redirect to target URL
    res.redirect(302, targetUrl);
  } catch (error) {
    console.error('Error in redirectAndTrack:', error);
    next(error);
  }
};

// @desc    Download QR code image
// @route   GET /api/qr/:id/download
// @access  Private
export const downloadQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: 'QR Code not found'
      });
    }

    // Check ownership
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this QR code'
      });
    }

    // Convert base64 to buffer
    const base64Data = qrCode.qrImage.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Set headers for download
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${qrCode.title.replace(/[^a-z0-9]/gi, '_')}_qr.png"`,
      'Content-Length': imageBuffer.length
    });

    res.send(imageBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc    Fix existing QR codes (regenerate with correct redirect URL)
// @route   POST /api/qr/fix-existing
// @access  Private (Admin only)
export const fixExistingQRCodes = async (req, res, next) => {
  try {
    // Only allow superadmin to run this
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action'
      });
    }

    const qrCodes = await QRCode.find({});
    let fixedCount = 0;
    const errors = [];

    for (const qrCode of qrCodes) {
      try {
        // Generate the correct redirect URL
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        const redirectUrl = `${baseUrl}/api/qr/r/${qrCode.shortCode}`;
        
        // Regenerate QR code with redirect URL
        const qrImage = await generateQRCode(redirectUrl, qrCode.customization);
        
        // Update the QR code
        qrCode.qrImage = qrImage;
        await qrCode.save();
        
        fixedCount++;
      } catch (error) {
        errors.push({ qrCodeId: qrCode._id, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Fixed ${fixedCount} QR codes`,
      fixedCount,
      totalCodes: qrCodes.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    next(error);
  }
};









