// import express from 'express';
// import {
//   createQRCode,
//   getMyQRCodes,
//   getQRCode,
//   updateTargetUrl,
//   customizeQRCode,
//   toggleStatus,
//   deleteQRCode,
//   redirectAndTrack
// } from '../controllers/qrController.js';
// import { protect } from '../middleware/auth.js';
// import {
//   createQRValidation,
//   updateUrlValidation
// } from '../middleware/validation.js';
// import { qrCreationLimiter } from '../middleware/rateLimiter.js';

// const router = express.Router();

// // Public route - must be before protect middleware
// router.get('/r/:shortCode', redirectAndTrack);

// // Protected routes
// router.use(protect);

// router.post('/create', qrCreationLimiter, createQRValidation, createQRCode);
// router.get('/my-codes', getMyQRCodes);
// router.get('/:id', getQRCode);
// router.put('/:id/update-url', updateUrlValidation, updateTargetUrl);
// router.put('/:id/customize', customizeQRCode);
// router.put('/:id/toggle-status', toggleStatus);
// router.delete('/:id', deleteQRCode);

// export default router;



import express from 'express';
import {
  createQRCode,
  getMyQRCodes,
  getQRCode,
  updateTargetUrl,
  customizeQRCode,
  toggleStatus,
  deleteQRCode,
  redirectAndTrack,
  downloadQRCode,
  fixExistingQRCodes
} from '../controllers/qrController.js';
import { protect } from '../middleware/auth.js';
import {
  createQRValidation,
  updateUrlValidation
} from '../middleware/validation.js';
import { qrCreationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public route - must be before protect middleware
router.get('/r/:shortCode', redirectAndTrack);

// Protected routes - accessible by ALL logged-in users (both 'user' and 'superadmin')
router.post('/create', protect, qrCreationLimiter, createQRValidation, createQRCode);
router.get('/my-codes', protect, getMyQRCodes);
router.get('/:id', protect, getQRCode);
router.get('/:id/download', protect, downloadQRCode);
router.put('/:id/update-url', protect, updateUrlValidation, updateTargetUrl);
router.put('/:id/customize', protect, customizeQRCode);
router.put('/:id/toggle-status', protect, toggleStatus);
router.delete('/:id', protect, deleteQRCode);

// Admin only routes
router.post('/fix-existing', protect, fixExistingQRCodes);

export default router;

