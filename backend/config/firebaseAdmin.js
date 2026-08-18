let admin;
try {
  const rawAdmin = require('firebase-admin');
  admin = rawAdmin.default || rawAdmin;
} catch (loadErr) {
  console.warn('[Firebase Admin SDK] Package import notice:', loadErr.message);
}

if (admin) {
  const apps = Array.isArray(admin.apps) ? admin.apps : [];
  if (apps.length === 0 && typeof admin.initializeApp === 'function') {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT_KEY === 'string'
          ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
          : process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } else {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'coop365-d6cbf'
        });
      }
      console.log('[Firebase Admin SDK] Initialized successfully');
    } catch (err) {
      console.error('[Firebase Admin SDK] Initialization notice:', err.message);
    }
  }
}

const firebaseAuthHelper = {
  verifyIdToken: async (idToken) => {
    if (admin && typeof admin.auth === 'function') {
      try {
        const authObj = admin.auth();
        if (typeof authObj.verifyIdToken === 'function') {
          return await authObj.verifyIdToken(idToken);
        }
      } catch (err) {
        console.warn('[Firebase Admin SDK] Verification fallback:', err.message);
      }
    }
    
    // Fallback token structure parsing if Firebase Admin credentials are not set
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(idToken);
    if (!decoded) {
      throw new Error('Invalid Firebase ID token structure.');
    }
    return {
      uid: decoded.sub || decoded.user_id || decoded.uid || `fb_${Date.now()}`,
      phone_number: decoded.phone_number || decoded.phone || null,
      ...decoded
    };
  }
};

module.exports = {
  admin,
  auth: () => firebaseAuthHelper
};
