import QRCode from '../models/QRCode.js';
import { generateQRCode } from './generateQR.js';

/**
 * Fix existing QR codes that were generated with target URL instead of redirect URL
 */
export const fixExistingQRCodes = async () => {
  try {
    console.log('Starting to fix existing QR codes...');
    
    const qrCodes = await QRCode.find({});
    console.log(`Found ${qrCodes.length} QR codes to check`);
    
    let fixedCount = 0;
    
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
        console.log(`Fixed QR code: ${qrCode.title} (${qrCode.shortCode})`);
      } catch (error) {
        console.error(`Error fixing QR code ${qrCode._id}:`, error);
      }
    }
    
    console.log(`Successfully fixed ${fixedCount} QR codes`);
    return { success: true, fixedCount };
  } catch (error) {
    console.error('Error fixing existing QR codes:', error);
    return { success: false, error: error.message };
  }
};

// Run this function if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixExistingQRCodes().then(() => {
    process.exit(0);
  });
}