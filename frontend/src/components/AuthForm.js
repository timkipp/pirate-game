import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onAuthSuccess }) {
  const [userName, setUserName] = useState(''); // Changed username to userName for consistency
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = `http://localhost:5000/api/auth/${isSignup ? 'signup' : 'login'}`;
    const body = JSON.stringify({ userName, password });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Authentication failed'); // Display backend error message
      }

      const data = await response.json();
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Username</label> {/* Changed for consistency */}
          <input
            type="text"
            id="userName"
            value={userName} // Changed for consistency
            onChange={(e) => setUserName(e.target.value)} // Changed for consistency
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isSignup ? 'Create Account' : 'Log In'}</button>
      </form>
      <div className="toggle-section">
        <span>{isSignup ? 'Already have an account?' : 'New user?'}</span>
        <button className="toggle-button" onClick={() => setIsSignup((prev) => !prev)}>
          {isSignup ? 'Log In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;