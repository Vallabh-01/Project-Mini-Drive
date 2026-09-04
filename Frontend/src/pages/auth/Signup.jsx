import React, { useState } from 'react';
import './Signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Signup successful! Redirecting to login...');
        setTimeout(() => (window.location.href = '/login'), 1500);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Server error. Please try again.');
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>

      <div className="left-section">
        <h1 className="headline">Register Now...</h1>
        <p className="tagline">Store. Share. Organize.</p>
      </div>

      <div className="right-section">
        <div className="signup-card">
          <h2>Signup</h2>
          <p className="subtitle">Just some details to get you in!</p>

          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="text" name="emailOrPhone" placeholder="Email / Phone" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            <button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Signup'}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="footer-links">
            <p>Already Registered? <a href="/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
