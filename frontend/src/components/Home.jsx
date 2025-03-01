import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Add animation class after component mounts
    setAnimationClass('animate-pulse');
    
    // Set up animation loop
    const interval = setInterval(() => {
      setAnimationClass('');
      setTimeout(() => {
        setAnimationClass('animate-pulse');
      }, 100);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
      <div className="relative w-full max-w-4xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
        
        {/* Card with glass effect */}
        <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10"></div>
          
          {/* Logout button */}
          <div className="relative z-20 flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/60 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span>Logout</span>
            </button>
          </div>
          
          {/* Big animated copyright */}
          <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
            <div className={`text-center  transition-all duration-500`}>
              <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-transparent mb-2">
                © Abuzar Khan
              </p>
              <div className="w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;