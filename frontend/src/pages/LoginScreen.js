// frontend/src/pages/LoginScreen.js
//import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import './LoginScreen.css';

function LoginScreen({ onAuthSuccess }) {
  const navigate = useNavigate();

  const handleAuthSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    onAuthSuccess(userData); // <-- notify App.js
    navigate('/menu'); // <-- match App.js route
  };

  return (
    <div className="login-screen">
      <h1 className="login-title">Welcome to Pirate Adventure</h1>
      <AuthForm onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default LoginScreen;