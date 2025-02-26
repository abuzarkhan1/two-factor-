import {  Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './components/register';
import Login from './components/login';
import Home from './components/Home';

const App = () => {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    </AuthProvider>
  );
};

export default App;