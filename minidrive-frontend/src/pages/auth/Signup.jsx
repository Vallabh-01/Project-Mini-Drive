import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Router imports
import axios from "../../api/axios";
import "./Signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const navigate = useNavigate(); // ✅ Router navigation

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true); // ✅ Show loading
      const res = await axios.post("/auth/register", {
  name: formData.username,  // must match backend
  email: formData.email,
  password: formData.password,
});


      setSuccess(res.data?.msg || "Signup successful!");
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // ✅ Delay a bit for user to see success message
      setTimeout(() => {
        navigate("/login", { state: { msg: "Signup successful! Please log in." } });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="signup-container">
      {/* Background Circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>

      {/* Left Section */}
      <div className="left-section">
        <h1 className="headline">Register Now...</h1>
        <p className="tagline">Store. Share. Organize.</p>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="signup-card">
          <h2>Signup</h2>
          <p className="subtitle">Just some details to get you in!</p>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <div className="footer-links">
            <p>
              Already Registered?{" "}
              <Link to="/login" className="login-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
