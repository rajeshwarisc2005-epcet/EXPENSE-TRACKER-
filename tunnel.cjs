const localtunnel = require('localtunnel');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8080, subdomain: 'spendpulse-app-v2' });
    console.log('==================================================');
    console.log('LIVE_URL: ' + tunnel.url);
    console.log('==================================================');

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Tunnel error:', err);
  }
})();
