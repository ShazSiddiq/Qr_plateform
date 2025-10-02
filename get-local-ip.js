// Get local IP address for testing QR codes on mobile devices
const { networkInterfaces } = require('os');

function getLocalIP() {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  // Find the most likely local IP
  const interfaces = Object.keys(results);
  let localIP = 'localhost';

  // Look for common interface names
  for (const interfaceName of interfaces) {
    if (interfaceName.toLowerCase().includes('wi-fi') || 
        interfaceName.toLowerCase().includes('wireless') ||
        interfaceName.toLowerCase().includes('ethernet')) {
      localIP = results[interfaceName][0];
      break;
    }
  }

  // If no common interface found, use the first available
  if (localIP === 'localhost' && interfaces.length > 0) {
    localIP = results[interfaces[0]][0];
  }

  return localIP;
}

const localIP = getLocalIP();
console.log('\n🌐 Local Network Information:');
console.log('================================');
console.log(`Your local IP address: ${localIP}`);
console.log(`\n📱 To test QR codes on your phone:`);
console.log(`1. Make sure your phone is on the same WiFi network`);
console.log(`2. Update your .env file:`);
console.log(`   BACKEND_URL=http://${localIP}:5000`);
console.log(`3. Restart your backend server`);
console.log(`4. Create new QR codes or use the "Fix Existing QR Codes" tool`);
console.log(`\n🔗 Your QR codes will then contain: http://${localIP}:5000/api/qr/r/shortcode`);
console.log(`\n✅ This will work when scanned from your phone!`);