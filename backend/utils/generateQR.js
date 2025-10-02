import QRCode from 'qrcode';

/**
 * Generate QR code image with customization
 * @param {string} data - Data to encode in QR
 * @param {object} customization - QR customization options
 * @returns {Promise<string>} Base64 encoded QR image
 */
export const generateQRCode = async (data, customization = {}) => {
  try {
    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1,
      width: 512,
      color: {
        dark: customization.foregroundColor || '#000000',
        light: customization.backgroundColor || '#FFFFFF'
      }
    };

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(data, options);

    // If logo is provided, we would overlay it here
    // For simplicity, returning the base QR code
    // In production, you'd use canvas to overlay the logo

    return qrDataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code: ' + error.message);
  }
};

/**
 * Generate QR code as SVG
 * @param {string} data - Data to encode in QR
 * @param {object} customization - QR customization options
 * @returns {Promise<string>} SVG string
 */
export const generateQRCodeSVG = async (data, customization = {}) => {
  try {
    const options = {
      errorCorrectionLevel: 'H',
      type: 'svg',
      color: {
        dark: customization.foregroundColor || '#000000',
        light: customization.backgroundColor || '#FFFFFF'
      }
    };

    const svgString = await QRCode.toString(data, options);
    return svgString;
  } catch (error) {
    throw new Error('Failed to generate QR code SVG: ' + error.message);
  }
};