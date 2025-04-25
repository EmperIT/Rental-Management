import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';
import IllustrationImage from "../assets/images/SnapBG.ai_1745175708160.png";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Khởi tạo dữ liệu mẫu khi component mount
  useEffect(() => {
    const existingAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const existingRooms = JSON.parse(localStorage.getItem('rooms') || '[]');

    if (existingAccounts.length === 0) {
      const mockAccounts = [
        { id: '1', username: 'landlord1', password: 'password123', fullName: 'Nguyễn Văn Chủ', phone: '0901234567', email: 'landlord1@example.com', role: 'landlord', roomId: '' },
        { id: '2', username: 'manager1', password: 'password123', fullName: 'Trần Thị Quản Lý', phone: '0902345678', email: 'manager1@example.com', role: 'manager', roomId: '' },
        { id: '3', username: 'tenant1', password: 'password123', fullName: 'Lê Văn Trưởng', phone: '0903456789', email: 'tenant1@example.com', role: 'tenant', roomId: 'room1', isLeadTenant: true },
        { id: '4', username: 'tenant2', password: 'password123', fullName: 'Phạm Thị Khách', phone: '0904567890', email: 'tenant2@example.com', role: 'tenant', roomId: 'room1', isLeadTenant: false },
        { id: '5', username: 'tenant3', password: 'password123', fullName: 'Hoàng Văn Trưởng 2', phone: '0905678901', email: 'tenant3@example.com', role: 'tenant', roomId: 'room2', isLeadTenant: true },
      ];
      localStorage.setItem('accounts', JSON.stringify(mockAccounts));
    }

    if (existingRooms.length === 0) {
      const mockRooms = [
        { id: 'room1', name: 'Phòng 101', leadTenantId: '3' },
        { id: 'room2', name: 'Phòng 102', leadTenantId: '5' },
      ];
      localStorage.setItem('rooms', JSON.stringify(mockRooms));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const user = accounts.find(
      (account) => account.username === username && account.password === password
    );

    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('user', JSON.stringify({ username: user.username }));
      navigate('/home');
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng');
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