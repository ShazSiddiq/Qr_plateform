// import express from 'express';
// import {
//   getAllUsers,
//   getAllQRCodes,
//   getPlatformStats,
//   toggleUserStatus
// } from '../controllers/adminController.js';
// import { protect, authorize } from '../middleware/auth.js';

// const router = express.Router();

// // All admin routes require authentication and superadmin role
// router.use(protect);
// router.use(authorize('superadmin'));

// router.get('/users', getAllUsers);
// router.get('/qr-codes', getAllQRCodes);
// router.get('/stats', getPlatformStats);
// router.put('/users/:id/toggle-status', toggleUserStatus);

// export default router;



import express from 'express';
import {
  getAllUsers,
  getAllQRCodes,
  getPlatformStats,
  toggleUserStatus
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication AND superadmin role
router.get('/users', protect, authorize('superadmin'), getAllUsers);
router.get('/qr-codes', protect, authorize('superadmin'), getAllQRCodes);
router.get('/stats', protect, authorize('superadmin'), getPlatformStats);
router.put('/users/:id/toggle-status', protect, authorize('superadmin'), toggleUserStatus);

export default router;