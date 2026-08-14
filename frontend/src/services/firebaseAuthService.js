import { auth } from '../firebase/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

/**
 * Initializes Firebase Invisible Recaptcha Verifier
 * @param {string} containerId - DOM Element ID for recaptcha (default: 'recaptcha-container')
 */
export const initRecaptchaVerifier = (containerId = 'recaptcha-container') => {
  try {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.warn('[Recaptcha Reset]', e);
      }
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response) => {
        console.log('[Firebase Auth] Recaptcha verified for Phone OTP SMS.');
      },
      'expired-callback': () => {
        console.warn('[Firebase Auth] Recaptcha expired. Re-initializing...');
      }
    });

    return window.recaptchaVerifier;
  } catch (err) {
    console.warn('[Firebase Auth Recaptcha Notice]', err);
    return null;
  }
};

/**
 * Sends real-time SMS OTP to resident's mobile phone via Firebase Auth
 * @param {string} phoneNumber - Mobile number with country code (e.g. '+918280057771')
 */
export const sendFirebasePhoneOTP = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier || initRecaptchaVerifier('recaptcha-container');
    if (!appVerifier) {
      throw new Error('Could not initialize Firebase Recaptcha Verifier.');
    }

    console.log(`[Firebase Phone Auth] Sending real SMS OTP to ${phoneNumber}...`);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    console.log('[Firebase Phone Auth] SMS OTP dispatched successfully!');
    return confirmationResult;
  } catch (error) {
    console.error('[Firebase Phone Auth Error]', error);
    throw error;
  }
};

/**
 * Verifies 6-digit SMS OTP code entered by resident against Firebase Auth
 * @param {object} confirmationResult - Firebase confirmation result object from sendFirebasePhoneOTP
 * @param {string} otpCode - 6-digit SMS OTP code
 */
export const verifyFirebasePhoneOTP = async (confirmationResult, otpCode) => {
  try {
    const targetConfirmation = confirmationResult || window.confirmationResult;
    if (!targetConfirmation) {
      throw new Error('No active SMS OTP session found.');
    }

    const result = await targetConfirmation.confirm(otpCode);
    const user = result.user;
    const idToken = await user.getIdToken();

    console.log('[Firebase Auth] Real Phone OTP verified successfully for user:', user.phoneNumber);

    return {
      user,
      idToken,
      phoneNumber: user.phoneNumber
    };
  } catch (error) {
    console.error('[Firebase OTP Verification Error]', error);
    throw error;
  }
};
