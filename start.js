
console.log('Starting UniFood Restaurant...');
console.log('Checking server configuration...');

// Simple health check
const http = require('http');

setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server is running! Status: ${res.statusCode}`);
    console.log('🍽️  Your UniFood website is ready!');
  });

  req.on('error', (err) => {
    console.error('❌ Server check failed:', err.message);
  });

  req.end();
}, 3000);

// Start the main server
require('./server.js');
