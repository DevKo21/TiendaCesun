const CryptoJS = require('crypto-js');
require('dotenv').config();

const SECRET_KEY = process.env.AES_SECRET;

const encryption = {

    // Cifrar dato
    encrypt(text) {
        if (!text) return text;
        return CryptoJS.AES.encrypt(text.toString(), SECRET_KEY).toString();
    },

    // Descifrar dato
    decrypt(cipherText) {
        if (!cipherText) return cipherText;
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

};

module.exports = encryption;

