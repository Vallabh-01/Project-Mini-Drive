import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save JWT token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);

        setMessage('✅ Login successful!');
        setTimeout(() => navigate('/upload'), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Server error. Please try again.');
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>

      <div className="left-section">
        <h1 className="headline">Welcome Back .!</h1>
        <p className="tagline">Continue Your Work.</p>
      </div>

      <div className="right-section">
        <div className="login-card">
          <h2>Login</h2>
          <p className="subtitle">Glad you're back.!</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="remember-section">
              <label>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="footer-links">
            <p>Don’t have an account? <Link to="/signup">Signup</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
