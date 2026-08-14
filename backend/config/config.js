const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/coop365',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_coop365_2026',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'coop-society',
  initialSuperAdmin: {
    email: process.env.INITIAL_SUPER_ADMIN_EMAIL || 'superadmin@coop365.com',
    password: process.env.INITIAL_SUPER_ADMIN_PASSWORD || 'AdminPass123!'
  }
};
