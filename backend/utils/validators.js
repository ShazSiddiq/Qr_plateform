import crypto from 'crypto';

/**
 * Generate 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Extract device information from user agent
 * @param {string} userAgent - User agent string
 * @returns {object} Device information
 */
export const getDeviceInfo = (userAgent) => {
  if (!userAgent) {
    return { device: 'unknown', browser: 'unknown', os: 'unknown' };
  }

  const ua = userAgent.toLowerCase();
  
  let device = 'unknown';
  if (ua.includes('mobile') && !ua.includes('tablet')) device = 'mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'tablet';
  else if (ua.includes('desktop') || ua.includes('windows') || ua.includes('mac') || ua.includes('linux')) device = 'desktop';
  else if (!ua.includes('mobile') && !ua.includes('tablet')) device = 'desktop'; // Default for non-mobile

  let browser = 'unknown';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari';
  else if (ua.includes('firefox/')) browser = 'Firefox';
  else if (ua.includes('opera/') || ua.includes('opr/')) browser = 'Opera';

  let os = 'unknown';
  if (ua.includes('windows nt')) os = 'Windows';
  else if (ua.includes('mac os x') || ua.includes('macos')) os = 'MacOS';
  else if (ua.includes('linux') && !ua.includes('android')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone')) os = 'iOS';
  else if (ua.includes('ipad')) os = 'iPadOS';
  else if (ua.includes('ipod')) os = 'iOS';

  return { device, browser, os };
};

/**
 * Get location information from IP address
 * @param {string} ipAddress - IP address
 * @returns {Promise<object>} Location information
 */
export const getLocationInfo = async (ipAddress) => {
  try {
    // Remove IPv6 prefix if present
    const cleanIp = ipAddress.replace('::ffff:', '');

    // Check for local/private IPs
    const isLocalIP = cleanIp === '127.0.0.1' || 
                     cleanIp === 'localhost' || 
                     cleanIp.startsWith('192.168.') || 
                     cleanIp.startsWith('10.') || 
                     cleanIp.startsWith('172.') || 
                     cleanIp === 'unknown';

    if (isLocalIP) {
      // For local IPs, try to get location from external IP or use default
      try {
        // Try to get public IP and location
        const publicIPResponse = await fetch('https://api.ipify.org?format=json', { timeout: 3000 });
        const publicIPData = await publicIPResponse.json();
        
        if (publicIPData.ip) {
          const locationResponse = await fetch(`http://ip-api.com/json/${publicIPData.ip}?fields=status,country,regionName,city`, { timeout: 3000 });
          const locationData = await locationResponse.json();
          
          if (locationData.status === 'success') {
            return {
              country: locationData.country || 'India',
              city: locationData.city || 'Mumbai', 
              region: locationData.regionName || 'Maharashtra'
            };
          }
        }
      } catch (error) {
        console.log('Could not get public IP location, using default');
      }
      
      // Default location for local IPs (you can customize this)
      return {
        country: 'India',
        city: 'Mumbai',
        region: 'Maharashtra'
      };
    }

    // Use ip-api.com for geolocation (free service)
    try {
      const response = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,regionName,city`, {
        timeout: 5000
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          country: data.country || 'Unknown',
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown'
        };
      }
    } catch (fetchError) {
      console.log('IP geolocation service unavailable, using fallback');
    }

    // Fallback for when geolocation service is unavailable
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  } catch (error) {
    console.error('Error getting location info:', error);
    return {
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown'
    };
  }
};

/**
 * Sanitize and validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch (error) {
    return false;
  }
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};