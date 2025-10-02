// import mongoose from 'mongoose';
// import crypto from 'crypto';

// const qrCodeSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//     trim: true,
//     maxlength: [100, 'Title cannot exceed 100 characters']
//   },
//   targetUrl: {
//     type: String,
//     required: [true, 'Target URL is required'],
//     trim: true,
//     match: [/^https?:\/\/.+/, 'Please provide a valid URL']
//   },
//   shortCode: {
//     type: String,
//     unique: true,
//     required: true,
//     index: true
//   },
//   qrImage: {
//     type: String, // Base64 encoded image
//     required: true
//   },
//   customization: {
//     foregroundColor: {
//       type: String,
//       default: '#000000'
//     },
//     backgroundColor: {
//       type: String,
//       default: '#FFFFFF'
//     },
//     logo: String // Base64 encoded logo
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   totalScans: {
//     type: Number,
//     default: 0
//   },
//   lastScannedAt: Date,
//   urlHistory: [{
//     url: String,
//     changedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Generate unique short code before saving
// qrCodeSchema.pre('save', async function(next) {
//   if (!this.shortCode) {
//     this.shortCode = crypto.randomBytes(6).toString('hex');
    
//     // Ensure uniqueness
//     const existing = await this.constructor.findOne({ shortCode: this.shortCode });
//     if (existing) {
//       this.shortCode = crypto.randomBytes(8).toString('hex');
//     }
//   }
//   next();
// });

// // Add URL to history when updated
// qrCodeSchema.pre('findOneAndUpdate', function(next) {
//   const update = this.getUpdate();
//   if (update.targetUrl) {
//     update.$push = update.$push || {};
//     update.$push.urlHistory = {
//       url: update.targetUrl,
//       changedAt: new Date()
//     };
//   }
//   next();
// });

// // Indexes for performance
// qrCodeSchema.index({ user: 1, createdAt: -1 });
// qrCodeSchema.index({ shortCode: 1 });

// export default mongoose.model('QRCode', qrCodeSchema);




import mongoose from 'mongoose';
import crypto from 'crypto';

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  targetUrl: {
    type: String,
    required: [true, 'Target URL is required'],
    trim: true,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL']
  },
  shortCode: {
    type: String,
    unique: true,
    required: true,
    index: true,
    default: function() {
      return crypto.randomBytes(6).toString('hex');
    }
  },
  qrImage: {
    type: String, // Base64 encoded image
    required: true
  },
  customization: {
    foregroundColor: {
      type: String,
      default: '#000000'
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    logo: String // Base64 encoded logo
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalScans: {
    type: Number,
    default: 0
  },
  lastScannedAt: Date,
  urlHistory: [{
    url: String,
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate unique short code before validation
qrCodeSchema.pre('validate', async function(next) {
  if (!this.shortCode) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      this.shortCode = crypto.randomBytes(6).toString('hex');
      
      // Check if shortCode already exists
      const existing = await this.constructor.findOne({ shortCode: this.shortCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return next(new Error('Failed to generate unique short code'));
    }
  }
  next();
});

// Add URL to history when updated
qrCodeSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.targetUrl) {
    if (!update.$push) {
      update.$push = {};
    }
    update.$push.urlHistory = {
      url: update.targetUrl,
      changedAt: new Date()
    };
  }
  next();
});

// Indexes for performance
qrCodeSchema.index({ user: 1, createdAt: -1 });
qrCodeSchema.index({ shortCode: 1 });
qrCodeSchema.index({ isActive: 1 });

// Virtual for redirect URL
qrCodeSchema.virtual('redirectUrl').get(function() {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  return `${baseUrl}/api/qr/r/${this.shortCode}`;
});

// Ensure virtuals are included in JSON
qrCodeSchema.set('toJSON', { virtuals: true });
qrCodeSchema.set('toObject', { virtuals: true });

export default mongoose.model('QRCode', qrCodeSchema);






// backend/src/models/QRCode.js
// import mongoose from 'mongoose';
// import crypto from 'crypto';

// const qrCodeSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//     trim: true,
//     maxlength: [100, 'Title cannot exceed 100 characters']
//   },
//   targetUrl: {
//     type: String,
//     required: [true, 'Target URL is required'],
//     trim: true,
//     match: [/^https?:\/\/.+/, 'Please provide a valid URL']
//   },
//   shortCode: {
//     type: String,
//     unique: true,
//     required: true,
//     index: true,
//     default: function() {
//       return crypto.randomBytes(6).toString('hex');
//     }
//   },
//   qrImage: {
//     type: String, // Base64 encoded image
//     required: true
//   },
//   customization: {
//     foregroundColor: {
//       type: String,
//       default: '#000000'
//     },
//     backgroundColor: {
//       type: String,
//       default: '#FFFFFF'
//     },
//     logo: String // Base64 encoded logo
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   totalScans: {
//     type: Number,
//     default: 0
//   },
//   lastScannedAt: Date,
//   urlHistory: [{
//     url: String,
//     changedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// }, {
//   timestamps: true
// });

// // Generate unique short code before validation
// qrCodeSchema.pre('validate', async function(next) {
//   if (!this.shortCode) {
//     let isUnique = false;
//     let attempts = 0;
//     const maxAttempts = 10;

//     while (!isUnique && attempts < maxAttempts) {
//       this.shortCode = crypto.randomBytes(6).toString('hex');
      
//       // Check if shortCode already exists
//       const existing = await this.constructor.findOne({ shortCode: this.shortCode });
//       if (!existing) {
//         isUnique = true;
//       }
//       attempts++;
//     }

//     if (!isUnique) {
//       return next(new Error('Failed to generate unique short code'));
//     }
//   }
//   next();
// });

// // Add URL to history when updated
// qrCodeSchema.pre('findOneAndUpdate', function(next) {
//   const update = this.getUpdate();
//   if (update.targetUrl) {
//     if (!update.$push) {
//       update.$push = {};
//     }
//     update.$push.urlHistory = {
//       url: update.targetUrl,
//       changedAt: new Date()
//     };
//   }
//   next();
// });

// // Indexes for performance
// qrCodeSchema.index({ user: 1, createdAt: -1 });
// qrCodeSchema.index({ shortCode: 1 });
// qrCodeSchema.index({ isActive: 1 });

// // Virtual for redirect URL
// qrCodeSchema.virtual('redirectUrl').get(function() {
//   return `${process.env.FRONTEND_URL || 'http://localhost:5000'}/api/qr/r/${this.shortCode}`;
// });

// // Ensure virtuals are included in JSON
// qrCodeSchema.set('toJSON', { virtuals: true });
// qrCodeSchema.set('toObject', { virtuals: true });

// export default mongoose.model('QRCode', qrCodeSchema);
