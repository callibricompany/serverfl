require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

async function newToken() {
  try {
    const accessTokenObj = await axios.post(
    'https://accounts.zoho.com/oauth/v2/token',
      querystring.stringify({
        refresh_token: process.env.REFRESH_TOKEN,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        scope: process.env.SCOPE,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'refresh_token'
      })
    );

    return accessTokenObj.data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = newToken;

