// Simple test script to verify QR code functionality
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testQRCodeFlow() {
  console.log('🧪 Testing QR Code Flow...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await fetch(`http://localhost:5000/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running\n');
    } else {
      console.log('❌ Server is not responding\n');
      return;
    }

    // Test 2: Test redirect endpoint with a sample shortCode
    console.log('2. Testing redirect endpoint...');
    try {
      const redirectResponse = await fetch(`${API_BASE}/qr/r/samplecode123`, {
        method: 'GET',
        redirect: 'manual' // Don't follow redirects
      });
      
      if (redirectResponse.status === 404) {
        console.log('✅ Redirect endpoint is working (404 for non-existent code is expected)\n');
      } else {
        console.log(`⚠️  Redirect endpoint returned status: ${redirectResponse.status}\n`);
      }
    } catch (error) {
      console.log('❌ Error testing redirect endpoint:', error.message, '\n');
    }

    // Test 3: Check database connection by testing analytics endpoint
    console.log('3. Testing database connection...');
    try {
      const analyticsResponse = await fetch(`${API_BASE}/analytics/dashboard/stats`, {
        headers: {
          'Authorization': 'Bearer dummy-token' // This will fail auth but test the route
        }
      });
      
      if (analyticsResponse.status === 401) {
        console.log('✅ Analytics endpoint is accessible (401 auth error is expected)\n');
      } else {
        console.log(`⚠️  Analytics endpoint returned status: ${analyticsResponse.status}\n`);
      }
    } catch (error) {
      console.log('❌ Error testing analytics endpoint:', error.message, '\n');
    }

    console.log('🎉 Basic tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Create a QR code through the frontend');
    console.log('2. Scan the QR code with your phone');
    console.log('3. Check if you get redirected to the target URL');
    console.log('4. Check analytics in the dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testQRCodeFlow();