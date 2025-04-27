import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import IllustrationImage from "../assets/images/SnapBG.ai_1745175708160.png";
import { login } from '../services/authService';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi trước khi gọi API

    try {
      // Gọi API đăng nhập với username và password
      const response = await login(username, password);
      
      const { accessToken, refreshToken } = response;
      console.log(response);

      // Lưu token và thông tin user vào localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);


      // Chuyển hướng đến trang chủ
      navigate('/home');
    } catch (error) {
      // Xử lý lỗi từ API
      setError(error.response?.data?.message || 'Tài khoản hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-illustration">
          <img
            src={IllustrationImage}
            alt="RentHub Illustration"
            className="byeimage"
          />
        </div>
        <div className="auth-form">
          <h2 className="auth-title">Welcome to RentHub</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Enter Username</label>
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
            {error && <p className="error">{error}</p>}
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