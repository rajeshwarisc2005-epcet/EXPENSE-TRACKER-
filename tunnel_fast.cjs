const localtunnel = require('localtunnel');
const fs = require('fs');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 8080 });
    fs.writeFileSync('public_url_live.txt', tunnel.url + '\n');
    console.log('PUBLIC_URL:' + tunnel.url);
  } catch (err) {
    fs.writeFileSync('public_url_live.txt', 'ERR:' + err.message + '\n');
  }
})();
