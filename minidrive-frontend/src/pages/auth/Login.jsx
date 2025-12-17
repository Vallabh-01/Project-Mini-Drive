import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to dashboard ("/")
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
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

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
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

            <button type="submit">Login</button>
          </form>

          <div className="footer-links">
            <p>Don’t have an account? <Link to="/signup">Signup</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
