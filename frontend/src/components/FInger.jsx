// src/components/FingerprintSetup.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerFingerprint, removeFingerprint } from '../context/AuthService';
import { isFingerprintAvailable, registerNewFingerprint } from '../utils/fingerprintUtils';

const FingerprintSetup = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    // Check if fingerprint is supported
    const supported = isFingerprintAvailable();
    setIsSupported(supported);
    
    // Check if user has fingerprint registered
    const checkRegistration = async () => {
      try {
        // In a real app, you would make an API call to check if fingerprint is registered
        // For now, we'll use localStorage as a simple indicator
        const registered = localStorage.getItem('fingerprintRegistered') === 'true';
        setIsRegistered(registered);
      } catch (error) {
        console.error("Error checking fingerprint registration:", error);
      }
    };
    
    if (supported && user) {
      checkRegistration();
    }
  }, [user]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Register fingerprint in browser
      const fingerprintData = await registerNewFingerprint(user.id);
      
      // Send data to server
      await registerFingerprint(fingerprintData);
      
      // Update state
      localStorage.setItem('fingerprintRegistered', 'true');
      setIsRegistered(true);
      setMessage({
        text: 'Fingerprint registered successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error("Error registering fingerprint:", error);
      setMessage({
        text: error.message || 'Failed to register fingerprint.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Send request to remove fingerprint from server
      await removeFingerprint(user.id);
      
      // Update state
      localStorage.removeItem('fingerprintRegistered');
      setIsRegistered(false);
      setMessage({
        text: 'Fingerprint removed successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error("Error removing fingerprint:", error);
      setMessage({
        text: error.message || 'Failed to remove fingerprint.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-gray-700 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-2">Fingerprint Authentication</h3>
        <p className="text-gray-300">
          Fingerprint authentication is not supported on this device or browser.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Fingerprint Authentication</h3>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-900/50 border border-green-500 text-green-200' 
            : 'bg-red-900/50 border border-red-500 text-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
      <p className="text-gray-300 mb-4">
        {isRegistered 
          ? 'You have registered your fingerprint for this account. You can use it to log in faster next time.'
          : 'Register your fingerprint to enable faster login next time. Your fingerprint data stays on your device.'
        }
      </p>
      
      <div className="flex justify-center mb-4">
        <div className="bg-gray-800 rounded-full p-6 border-2 border-blue-500">
          <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.831z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {isRegistered ? (
        <button
          onClick={handleRemove}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white text-sm font-semibold
            ${loading 
              ? 'bg-red-600/50 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800'
            }`}
        >
          {loading ? 'Processing...' : 'Remove Fingerprint'}
        </button>
      ) : (
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white text-sm font-semibold
            ${loading 
              ? 'bg-blue-600/50 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800'
            }`}
        >
          {loading ? 'Registering...' : 'Register Fingerprint'}
        </button>
      )}
      
      <p className="text-gray-400 text-xs mt-4">
        Note: This feature uses the WebAuthn API and requires a compatible device with biometric authentication capabilities.
      </p>
    </div>
  );
};

export default FingerprintSetup;