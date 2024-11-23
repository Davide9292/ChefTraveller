const crypto = require('crypto');

const jwtSecretKey = crypto.randomBytes(64).toString('hex');
const accessTokenSecret = crypto.randomBytes(64).toString('hex');
const refreshTokenSecret = crypto.randomBytes(64).toString('hex');

console.log(`JWT_SECRET_KEY=${jwtSecretKey}`);
console.log(`ACCESS_TOKEN_SECRET=${accessTokenSecret}`);
console.log(`REFRESH_TOKEN_SECRET=${refreshTokenSecret}`);