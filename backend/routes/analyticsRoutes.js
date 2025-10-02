// import express from 'express';
// import {
//   getQRAnalytics,
//   getDashboardStats
// } from '../controllers/analyticsController.js';
// import { protect } from '../middleware/auth.js';

// const router = express.Router();

// router.use(protect);

// router.get('/dashboard/stats', getDashboardStats);
// router.get('/:qrId', getQRAnalytics);

// export default router;





// ================================================================
// backend/src/routes/analyticsRoutes.js
import express from 'express';
import {
  getQRAnalytics,
  getDashboardStats
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes accessible by logged-in users (both 'user' and 'superadmin')
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/:qrId', protect, getQRAnalytics);

export default router;