import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  qrCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  country: String,
  city: String,
  region: String,
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    default: 'unknown'
  },
  browser: String,
  os: String,
  referrer: String,
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound indexes for analytics queries
clickSchema.index({ qrCode: 1, timestamp: -1 });
clickSchema.index({ user: 1, timestamp: -1 });
clickSchema.index({ qrCode: 1, country: 1 });

export default mongoose.model('Click', clickSchema);