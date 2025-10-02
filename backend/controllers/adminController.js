import User from '../models/User.js';
import QRCode from '../models/QRCode.js';
import Click from '../models/Click.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Super Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments();

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all QR codes
// @route   GET /api/admin/qr-codes
// @access  Private (Super Admin)
export const getAllQRCodes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const qrCodes = await QRCode.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-qrImage');

    const total = await QRCode.countDocuments();

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

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Super Admin)
export const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQRCodes = await QRCode.countDocuments();
    const totalClicks = await Click.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Users registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // QR codes created this month
    const newQRCodesThisMonth = await QRCode.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Clicks this month
    const clicksThisMonth = await Click.countDocuments({
      timestamp: { $gte: startOfMonth }
    });

    // Top users by QR code count
    const topUsers = await QRCode.aggregate([
      { $group: { _id: '$user', qrCount: { $sum: 1 }, totalScans: { $sum: '$totalScans' } } },
      { $sort: { qrCount: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $project: { name: '$userInfo.name', email: '$userInfo.email', qrCount: 1, totalScans: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalQRCodes,
        totalClicks,
        activeUsers,
        newUsersThisMonth,
        newQRCodesThisMonth,
        clicksThisMonth,
        topUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Super Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
};