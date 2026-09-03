const localtunnel = require('localtunnel');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8080 });
    console.log('==================================================');
    console.log('GLOBAL PUBLIC LINK: ' + tunnel.url);
    console.log('==================================================');

    tunnel.on('close', () => {
      console.log('Tunnel closed, restarting...');
    });
  } catch (err) {
    console.error('Tunnel error:', err);
  }
})();
