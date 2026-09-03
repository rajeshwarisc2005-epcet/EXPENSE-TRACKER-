import localtunnel from 'localtunnel';

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8080, subdomain: 'spendpulse-dash' });
    console.log('==================================================');
    console.log('GLOBAL URL FOR SPENDPULSE DASHBOARD:');
    console.log(tunnel.url);
    console.log('==================================================');

    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Tunnel error:', err);
  }
})();
