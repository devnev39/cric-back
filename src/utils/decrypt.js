require('dotenv').config();
const CryptoJS = require('crypto-js');

module.exports = {
  decrypt: (key) => {
    return CryptoJS.AES.decrypt(key, process.env.CRYPTO_SECRET).toString(
        CryptoJS.enc.Utf8,
    );
  },
};
