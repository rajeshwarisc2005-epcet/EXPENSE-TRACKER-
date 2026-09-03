const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8080 });
    console.log('URL:', tunnel.url);
    fs.writeFileSync('tunnel_url.txt', tunnel.url);
    console.log('Saved to tunnel_url.txt');
  } catch (err) {
    console.error(err);
    fs.writeFileSync('tunnel_url.txt', 'ERROR: ' + err.message);
  }
})();
