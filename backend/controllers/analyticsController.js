
import Click from '../models/Click.js';
import QRCode from '../models/QRCode.js';
import mongoose from 'mongoose';

// @desc    Get analytics for specific QR code
// @route   GET /api/analytics/:qrId
// @access  Private
export const getQRAnalytics = async (req, res, next) => {
  try {
    const { qrId } = req.params;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const qrCode = await QRCode.findById(qrId);

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
        message: 'Not authorized to view analytics'
      });
    }

    // Build date filter - convert qrId to ObjectId
    const dateFilter = { qrCode: new mongoose.Types.ObjectId(qrId) };
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate);
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate);
    }
    
    console.log('Analytics dateFilter:', dateFilter);

    // Total clicks
    const totalClicks = await Click.countDocuments(dateFilter);

    // Clicks by country
    const clicksByCountry = await Click.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $ifNull: ['$country', 'Unknown'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Clicks by device (unique devices by IP)
    const clicksByDevice = await Click.aggregate([
      { $match: dateFilter },
      { 
        $group: { 
          _id: {
            device: { $ifNull: ['$device', 'unknown'] },
            os: { $ifNull: ['$os', 'unknown'] },
            ip: '$ipAddress'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: { 
            device: '$_id.device',
            os: '$_id.os'
          },
          uniqueDevices: { $sum: 1 },
          totalClicks: { $sum: '$count' }
        }
      },
      {
        $project: {
          _id: { $concat: ['$_id.device', ' (', '$_id.os', ')'] },
          count: '$uniqueDevices',
          totalClicks: '$totalClicks'
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Clicks by browser
    const clicksByBrowser = await Click.aggregate([
      { $match: dateFilter },
      { $group: { _id: { $ifNull: ['$browser', 'unknown'] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Clicks over time
    let groupByFormat;
    switch (groupBy) {
      case 'hour':
        groupByFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' } };
        break;
      case 'day':
        groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
        break;
      case 'month':
        groupByFormat = { $dateToString: { format: '%Y-%m', date: '$timestamp' } };
        break;
      default:
        groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } };
    }

    const clicksOverTime = await Click.aggregate([
      { $match: dateFilter },
      { 
        $group: { 
          _id: groupByFormat, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } },
      { $limit: 30 } // Limit to last 30 periods
    ]);

    // Recent clicks
    const recentClicks = await Click.find(dateFilter)
      .sort({ timestamp: -1 })
      .limit(20)
      .select('country city device browser os ipAddress timestamp');

    // Unique devices count
    const uniqueDevices = await Click.aggregate([
      { $match: dateFilter },
      { 
        $group: { 
          _id: '$ipAddress',
          device: { $first: '$device' },
          os: { $first: '$os' },
          browser: { $first: '$browser' },
          firstScan: { $min: '$timestamp' },
          totalScans: { $sum: 1 }
        }
      },
      { $sort: { firstScan: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      analytics: {
        totalClicks,
        qrCode: {
          title: qrCode.title,
          targetUrl: qrCode.targetUrl,
          createdAt: qrCode.createdAt
        },
        clicksByCountry,
        clicksByDevice,
        clicksByBrowser,
        clicksOverTime,
        recentClicks,
        uniqueDevices
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total QR codes
    const totalQRCodes = await QRCode.countDocuments({ user: userId });

    // Active QR codes
    const activeQRCodes = await QRCode.countDocuments({ user: userId, isActive: true });

    // Total scans
    const totalScans = await Click.countDocuments({ user: userId });

    // Scans this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const scansThisMonth = await Click.countDocuments({
      user: userId,
      timestamp: { $gte: startOfMonth }
    });

    // Top performing QR codes
    const topQRCodes = await QRCode.find({ user: userId })
      .sort({ totalScans: -1 })
      .limit(5)
      .select('title targetUrl totalScans lastScannedAt');

    // Recent activity
    const recentActivity = await Click.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('qrCode', 'title')
      .select('qrCode country device timestamp');

    res.json({
      success: true,
      stats: {
        totalQRCodes,
        activeQRCodes,
        totalScans,
        scansThisMonth,
        topQRCodes,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};