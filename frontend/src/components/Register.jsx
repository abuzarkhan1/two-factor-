import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../context/AuthService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await register(formData);
      if (response.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
      <div className="relative w-full max-w-md overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
        
        {/* Card with glass effect */}
        <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10"></div>
          
          {/* Card content */}
          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="mt-2 text-gray-300">
                Sign up to get started
              </p>
            </div>

            {/* Alert messages */}
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 text-red-200 px-4 py-3 rounded-lg animate-pulse">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      required
                      className="block w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg 
                              text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                              focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your username"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-violet-500/10 pointer-events-none"></div>
                  </div>
                </div>

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
                              focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-violet-500/10 pointer-events-none"></div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      required
                      className="block w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg 
                              text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                              focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/10 to-violet-500/10 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex justify-center py-3 px-4 rounded-lg text-white text-sm font-semibold
                        ${loading
                          ? 'bg-indigo-600/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200'
                        }`}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-transparent opacity-30 pointer-events-none"></div>
              </button>
            </form>

            {/* Footer */}
            <div className="text-center text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none transition-colors duration-200"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;