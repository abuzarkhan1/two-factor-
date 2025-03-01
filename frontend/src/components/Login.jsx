import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initiateLogin, verifyOTP } from '../context/AuthService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState('credentials');
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpStatus, setOtpStatus] = useState('neutral'); // 'neutral', 'success', 'error'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const otpRefs = useRef([]);

  // Set up refs for OTP inputs
  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await initiateLogin(credentials);
      setUserId(response.userId);
      setStep('otp');
      setSuccessMessage('OTP sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Reset status when user is typing
    setOtpStatus('neutral');
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input if current input is filled
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Navigate between inputs with arrow keys
    if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1].focus();
    } else if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Filter only digits and limit to 6 characters
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits) {
      // Fill the OTP fields
      const newOtp = [...otp];
      for (let i = 0; i < digits.length; i++) {
        if (i < 6) newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex(val => !val);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        otpRefs.current[nextEmptyIndex].focus();
      } else if (newOtp[5]) {
        otpRefs.current[5].focus();
      }
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      setOtpStatus('error');
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP({ userId, otp: otpString });
      if (response.success) {
        setOtpStatus('success');
        setTimeout(() => {
          login(response.userData, response.accessToken);
          navigate('/home');
        }, 500); // Small delay to show success state
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      setOtpStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setOtpStatus('neutral');
    setOtp(['', '', '', '', '', '']);

    try {
      await initiateLogin(credentials);
      setSuccessMessage('New OTP sent to your email!');
      // Focus on the first input after resending
      otpRefs.current[0].focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Get input box color based on status
  const getInputColor = () => {
    switch (otpStatus) {
      case 'success':
        return 'border-green-500 bg-green-900/30';
      case 'error':
        return 'border-red-500 bg-red-900/30';
      default:
        return 'border-gray-600 bg-gray-700/60';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
      <div className="relative w-full max-w-md overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        
        {/* Card with glass effect */}
        <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10"></div>
          
          {/* Card content */}
          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="mt-2 text-gray-300">
                {step === 'credentials' 
                  ? 'Sign in to your account' 
                  : 'Enter the OTP sent to your email'
                }
              </p>
            </div>

            {/* Alert messages */}
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-200 px-4 py-3 rounded-lg animate-pulse">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-900/20 backdrop-blur-sm border border-green-500/50 text-green-200 px-4 py-3 rounded-lg animate-pulse">
                {successMessage}
              </div>
            )}

            {/* Forms */}
            {step === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        required
                        className="block w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg 
                                text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                                focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`relative w-full flex justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold
                          ${loading
                            ? 'bg-blue-600/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200'
                          }`}
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-transparent opacity-30 pointer-events-none"></div>
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-6">
                <div>
                  <label htmlFor="otp-inputs" className="block text-sm font-medium text-gray-300 mb-3">
                    One-Time Password
                  </label>
                  <div 
                    id="otp-inputs" 
                    className="flex justify-between gap-2" 
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <div key={index} className="relative">
                        <input
                          ref={el => otpRefs.current[index] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-lg border 
                                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    transition-colors duration-200 ${getInputColor()}`}
                          autoFocus={index === 0 && step === 'otp'}
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`relative w-full flex justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold 
                          ${loading
                            ? 'bg-blue-600/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200'
                          }`}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-transparent opacity-30 pointer-events-none"></div>
                </button>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep('credentials')}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                  >
                    Back to login
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="text-center text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;