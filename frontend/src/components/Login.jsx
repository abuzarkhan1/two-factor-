// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initiateLogin, verifyOTP } from '../context/AuthService';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState('credentials');
  const [credentials, setCredentials] = useState({
    name: '',
    password: ''
  });
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await initiateLogin(credentials);
      setUserId(response.userId);
      setStep('otp');
      setError('OTP sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await verifyOTP({ userId, otp });
      if (response.success) {
        login({ id: userId, name: credentials.name }, response.accessToken);
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">
            {step === 'credentials' 
              ? 'Sign in to your account' 
              : 'Enter the OTP sent to your email'
            }
          </p>
        </div>

        {error && (
          <div className={`${
            error.includes('OTP sent') 
              ? 'bg-green-900/50 border-green-500 text-green-200' 
              : 'bg-red-900/50 border-red-500 text-red-200'
            } px-4 py-3 rounded-lg border`}>
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  value={credentials.name}
                  onChange={(e) => setCredentials({ ...credentials, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold
                       ${loading 
                         ? 'bg-blue-600/50 cursor-not-allowed' 
                         : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                       }`}
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                One-Time Password
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold
                       ${loading 
                         ? 'bg-blue-600/50 cursor-not-allowed' 
                         : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                       }`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep('credentials')}
              className="w-full text-center text-blue-500 hover:text-blue-400"
            >
              Back to login
            </button>
          </form>
        )}

        <div className="text-center text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-500 hover:text-blue-400 font-medium focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;