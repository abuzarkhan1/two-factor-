import { useState } from "react";
import {
  Shield,
  Fingerprint,
  Key,
  LogOut,
  Bell,
  CheckCircle,
  Activity,
  AlertTriangle,
  Smartphone,
  Globe,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    navigate("/");
  };

  const securityScore = 100;

  const notifications = [
    {
      type: "success",
      message: "Successful 2FA verification",
      time: "2 minutes ago",
    },
    { type: "warning", message: "New device detected", time: "1 hour ago" },
    { type: "info", message: "Security scan completed", time: "3 hours ago" },
  ];

  const recentActivities = [
    {
      icon: Key,
      text: "2FA Authentication",
      status: "success",
      location: "Mardan, Pakistan",
      device: "Chrome / Windows",
    },
    {
      icon: Fingerprint,
      text: "Biometric Verification",
      status: "success",
      location: "Mardan, Pakistan",
      device: "Mobile / iOS",
    },
    {
      icon: Globe,
      text: "New Location Access",
      status: "warning",
      location: "Mardan, Pakistan",
      device: "Firefox / MacOS",
    },
  ];

  const securityTips = [
    "Enable biometric authentication for enhanced security",
    "Regularly update your security preferences",
    "Monitor your active sessions",
    "Review your recent login history",
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">
                  SecureAuth
                </span>
              </div>

              <div className="hidden md:flex space-x-4">
                {["overview", "activity", "settings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 rounded-md text-sm font-medium capitalize
                      ${
                        activeTab === tab
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative text-gray-400 hover:text-white"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center text-white">
                    3
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    {notifications.map((notification, index) => (
                      <div key={index} className="px-4 py-2 hover:bg-gray-700">
                        <div className="flex items-center">
                          {notification.type === "success" && (
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          )}
                          {notification.type === "warning" && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                          )}
                          {notification.type === "info" && (
                            <Activity className="w-4 h-4 text-blue-500 mr-2" />
                          )}
                          <div>
                            <p className="text-sm text-white">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Security Score Card */}
        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, Abuzar!
              </h1>
              <p className="text-gray-400">
                Your account security is looking great today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Security Score</p>
                <p className="text-2xl font-bold text-green-500">
                  {securityScore}%
                </p>
              </div>
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${securityScore}, 100`}
                  />
                </svg>
                <CheckCircle className="w-6 h-6 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: Key,
              title: "Multi-Factor Authentication",
              status: "Active",
              color: "green",
              description: "Your account is protected with 2FA",
            },
            {
              icon: Fingerprint,
              title: "Biometric Security",
              status: "Enabled",
              color: "blue",
              description: "Fingerprint authentication ready",
            },
            {
              icon: Smartphone,
              title: "Device Management",
              status: "3 Devices",
              color: "purple",
              description: "All connected devices are secure",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <feature.icon
                    className={`w-8 h-8 text-${feature.color}-500`}
                  />
                  <h2 className="text-xl font-semibold text-white ml-3">
                    {feature.title}
                  </h2>
                </div>
                <span
                  className={`text-${feature.color}-500 text-sm font-medium`}
                >
                  {feature.status}
                </span>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Activity Feed and Security Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Activity
              </h2>
              <button className="text-blue-500 hover:text-blue-400 flex items-center">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <activity.icon
                        className={`w-6 h-6 ${
                          activity.status === "success"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      />
                      <div className="ml-3">
                        <p className="text-white font-medium">
                          {activity.text}
                        </p>
                        <div className="flex items-center text-sm text-gray-400">
                          <Globe className="w-4 h-4 mr-1" />
                          {activity.location}
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          {activity.device}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === "success"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Security Tips
            </h2>
            <div className="space-y-4">
              {securityTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-400">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
