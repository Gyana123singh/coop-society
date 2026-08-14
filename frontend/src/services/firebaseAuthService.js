import { auth } from '../firebase/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

/**
 * Initializes Firebase Recaptcha Verifier safely if element exists
 * @param {string} containerId - DOM Element ID
 */
export const initRecaptchaVerifier = (containerId = 'recaptcha-container') => {
  try {
    const el = document.getElementById(containerId);
    if (!el) {
      console.warn(`[Firebase Auth] Element with id '${containerId}' not found.`);
      return null;
    }

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.warn('[Firebase Auth] Error clearing existing recaptchaVerifier:', e);
      }
      window.recaptchaVerifier = null;
    }

    // Clean container innerHTML to ensure no leftover iframe/badge elements
    el.innerHTML = '';

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase Auth] Recaptcha verified automatically.');
      },
      'expired-callback': () => {
        console.warn('[Firebase Auth] Recaptcha expired. Resetting verifier.');
        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch (e) {}
          window.recaptchaVerifier = null;
        }
      }
    });

    return window.recaptchaVerifier;
  } catch (err) {
    console.error('[Firebase Recaptcha Error]', err?.message || err);
    return null;
  }
};

/**
 * Sends SMS OTP via Firebase Auth
 * @param {string} phoneNumber - Mobile number with country code (e.g. '+918280057771')
 */
export const sendFirebasePhoneOTP = async (phoneNumber) => {
  let appVerifier = window.recaptchaVerifier;
  if (!appVerifier) {
    appVerifier = initRecaptchaVerifier('recaptcha-container');
  }
  if (!appVerifier) {
    throw new Error('reCAPTCHA verifier container missing. Unable to send SMS.');
  }

  console.log(`[Firebase Phone Auth] Dispatching SMS OTP to ${phoneNumber}...`);
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (err) {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (e) {}
      window.recaptchaVerifier = null;
    }
    throw err;
  }
};

/**
 * Verifies 6-digit SMS OTP code entered by resident via Firebase
 * @param {object} confirmationResult - Firebase confirmation result object
 * @param {string} otpCode - 6-digit SMS OTP code
 */
export const verifyFirebasePhoneOTP = async (confirmationResult, otpCode) => {
  const targetConfirmation = confirmationResult || window.confirmationResult;
  if (!targetConfirmation) {
    throw new Error('Firebase authentication session expired or missing. Please request a new SMS OTP.');
  }

  const result = await targetConfirmation.confirm(otpCode);
  const user = result.user;
  const idToken = await user.getIdToken();

  return {
    user,
    idToken,
    phoneNumber: user.phoneNumber
  };
};

