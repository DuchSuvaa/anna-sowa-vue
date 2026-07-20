const fs = require('fs');
const https = require('https');

const config = JSON.parse(fs.readFileSync('/Users/suvo/.config/configstore/firebase-tools.json', 'utf8'));
const token = config.tokens.access_token;

const options = {
  hostname: 'firestore.googleapis.com',
  path: '/v1/projects/anna-sowa/databases/(default)/documents/news?pageSize=1',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
req.end();
