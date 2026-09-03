const localtunnel = require('localtunnel');
const fs = require('fs');

async function start() {
  console.log('Connecting to tunnel server...');
  try {
    const tunnel = await localtunnel({ port: 8080, host: 'https://localtunnel.me' });
    console.log('--------------------------------------------------');
    console.log('YOUR PUBLIC GLOBAL URL:');
    console.log(tunnel.url);
    console.log('--------------------------------------------------');
    fs.writeFileSync('public_url.txt', tunnel.url);
    
    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
    });
  } catch (e) {
    console.error('Failed to create tunnel:', e);
    // Retry with different host if needed
  }
}

start();
