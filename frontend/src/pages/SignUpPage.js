import IllustrationImage from "../assets/images/SignupImg.png";
import '../styles/SignUpPage.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    address: '',
    occupation: '',
    password: '',
    userType: 'Chủ nhà',
    agreeTerms: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, phoneNumber, email, dateOfBirth, address, occupation, password, userType, agreeTerms } = formData;

    if (!fullName || !phoneNumber || !email || !dateOfBirth || !address || !occupation || !password || !agreeTerms) {
      alert('Vui lòng điền đầy đủ thông tin và đồng ý với điều khoản.');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify({ username: email, userType }));
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-illustration">
          {/* Placeholder for the illustration */}
                  <img
                    src={IllustrationImage}
                    alt="RentHub Illustration"
                    className="illustration-image"
                  />
        </div>
        <div className="auth-form">
          <h2 className="auth-title">Join RentHub</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="0868973555"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@itro.vn"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Hà Nội"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="occupation">Occupation</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                placeholder="Câu Giấy"
                value={formData.occupation}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="userType">User Type</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="Chủ nhà">Chủ nhà</option>
                <option value="Khách thuê">Khách thuê</option>
              </select>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeTerms">
                I agree to the <a href="#terms">Terms & Conditions</a>
              </label>
            </div>
            <button type="submit" className="btn-primary">Sign Up</button>
          </form>
          <div className="auth-links">
            <span>Already have an account?</span>
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;