import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/account/Profile.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    roomId: '',
    isLeadTenant: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const mockRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const currentUser = accounts.find((account) => account.id === userId);
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        roomId: currentUser.roomId || '',
        isLeadTenant: currentUser.isLeadTenant || false,
      });
    }
    setRooms(mockRooms);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handleVerifyPasswordChange = (e) => {
    setVerifyPassword(e.target.value);
  };

  const handleToggleShowPassword = () => {
    setIsVerifyPopupOpen(true);
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (verifyPassword === user.password) {
      setShowPassword(!showPassword);
      setError('');
      setIsVerifyPopupOpen(false);
      setVerifyPassword('');
    } else {
      setError('Mật khẩu xác nhận không đúng');
    }
  };

  const handleVerifyCancel = () => {
    setIsVerifyPopupOpen(false);
    setVerifyPassword('');
    setError('');
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const updatedAccounts = accounts.map((account) =>
      account.id === user.id
        ? { ...account, ...formData }
        : account
    );

    // Cập nhật leadTenantId cho phòng nếu là tenant và isLeadTenant
    if (user.role === 'tenant' && formData.isLeadTenant && formData.roomId) {
      const updatedRooms = rooms.map((room) =>
        room.id === formData.roomId ? { ...room, leadTenantId: user.id } : room
      );
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }

    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setUser({ ...user, ...formData });
    setSuccess('Cập nhật thông tin thành công');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.currentPassword !== user.password) {
      setError('Mật khẩu hiện tại không đúng');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const updatedAccounts = accounts.map((account) =>
      account.id === user.id
        ? { ...account, password: passwordForm.newPassword }
        : account
    );
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setUser({ ...user, password: passwordForm.newPassword });
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
    setVerifyPassword('');
    setShowPassword(false);
    setError('');
    setSuccess('Đổi mật khẩu thành công');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Thông tin cá nhân</h2>
      <div className="tab-nav">
        <button
          className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Tài khoản
        </button>
        <button
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Thông tin cá nhân
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'account' && (
          <div className="profile-section">
            <h3>Tài khoản</h3>
            <div className="account-password-row">
              <div className="form-group">
                <label>Tài khoản</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                />
              </div>
              <div className="form-group password-group">
                <label>Mật khẩu</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={user.password}
                    disabled
                  />
                  <span className="password-toggle" onClick={handleToggleShowPassword}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>
            <h3>Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label>Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới *</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
              <button type="submit" className="save-button">
                Đổi mật khẩu
              </button>
            </form>
          </div>
        )}
        {activeTab === 'personal' && (
          <div className="profile-section">
            <h3>Thông tin cá nhân</h3>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {user.role === 'tenant' && (
                <>
                  <div className="form-group">
                    <label>Phòng</label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn phòng</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isLeadTenant"
                        checked={formData.isLeadTenant}
                        onChange={handleInputChange}
                      />
                      Trưởng phòng
                    </label>
                  </div>
                </>
              )}
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
              <button type="submit" className="save-button">
                Lưu thông tin
              </button>
            </form>
          </div>
        )}
      </div>

      {isVerifyPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Xác nhận mật khẩu</h3>
            <form onSubmit={handleVerifySubmit}>
              <div className="form-group">
                <label>Nhập mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={verifyPassword}
                  onChange={handleVerifyPasswordChange}
                  required
                />
              </div>
              {error && <p className="error">{error}</p>}
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Xác nhận
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleVerifyCancel}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;