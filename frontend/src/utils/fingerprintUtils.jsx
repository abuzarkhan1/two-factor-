// src/utils/fingerprintUtils.js
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

// Check if fingerprint API is available in the browser
export const isFingerprintAvailable = () => {
  return window.PublicKeyCredential && 
         window.navigator.credentials && 
         window.navigator.credentials.create;
};

// Generate a challenge for WebAuthn
const generateChallenge = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Register a new fingerprint
export const registerNewFingerprint = async (userId) => {
  if (!isFingerprintAvailable()) {
    throw new Error("Fingerprint authentication is not supported on this device");
  }

  try {
    const deviceId = localStorage.getItem('deviceId') || uuidv4();
    localStorage.setItem('deviceId', deviceId);
    
    const challenge = generateChallenge();
    
    // Create new credential
    const publicKeyCredentialCreationOptions = {
      challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
      rp: {
        name: "Your App Name",
        id: window.location.hostname
      },
      user: {
        id: Uint8Array.from(userId, c => c.charCodeAt(0)),
        name: userId,
        displayName: userId
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 }, // ES256
        { type: "public-key", alg: -257 } // RS256
      ],
      timeout: 60000,
      attestation: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Use platform authenticator (like TouchID or FaceID)
        userVerification: "preferred"
      }
    };
    
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });
    
    // Convert credential to JSON
    const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(credential.response.publicKey || credential.response.getPublicKey())));
    
    // Return the data that will be sent to the server
    return {
      userId,
      deviceId,
      publicKey,
      credentialId
    };
  } catch (error) {
    console.error("Error registering fingerprint:", error);
    throw new Error("Failed to register fingerprint");
  }
};

// Verify fingerprint for authentication
export const verifyFingerprint = async (userId, challenge) => {
  if (!isFingerprintAvailable()) {
    throw new Error("Fingerprint authentication is not supported on this device");
  }

  try {
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      throw new Error("No device ID found. Please register fingerprint first");
    }
    
    // Request credential from authenticator
    const publicKeyCredentialRequestOptions = {
      challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
      rpId: window.location.hostname,
      allowCredentials: [], // In a real implementation, you'd include the user's credentials here
      timeout: 60000,
      userVerification: "preferred"
    };
    
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });
    
    // Convert assertion to JSON
    const signature = btoa(String.fromCharCode(...new Uint8Array(assertion.response.signature)));
    const authenticatorData = btoa(String.fromCharCode(...new Uint8Array(assertion.response.authenticatorData)));
    
    // Return the data that will be sent to the server
    return {
      userId,
      deviceId,
      signature,
      authenticatorData,
      challenge
    };
  } catch (error) {
    console.error("Error verifying fingerprint:", error);
    throw new Error("Fingerprint verification failed");
  }
};

// Generate a random challenge for authentication
export const generateAuthChallenge = () => {
  return generateChallenge();
};