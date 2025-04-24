import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/SignUpPage.css';
import IllustrationImage from "../assets/images/SnapBG.ai_1745175708160.png";
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ username }));
      navigate('/home');
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-illustration">
          {/* Placeholder for the illustration */}
            <img
              src={IllustrationImage}
              alt="RentHub Illustration"
              className="byeimage"
              // style={{
              //   width: '2000px',
              //   height: '2000px',
              //   objectFit: 'contain',
              // }}
            />
        </div>
        <div className="auth-form">
          <h2 className="auth-title">Welcome to RentHub</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Enter Username or Email Address</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">Log In</button>
          </form>
          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/signup">Create my RentHub account!</Link>
          </div>
          <div className="auth-social-login">
            <p>Or log in with</p>
            <div className="social-buttons">
              <button className="social-btn google">G</button>
              <button className="social-btn facebook">f</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;