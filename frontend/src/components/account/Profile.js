import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Profile({ onProfileUpdate }) {
  const userRole = localStorage.getItem('userRole') || 'tenant';
  const userId = localStorage.getItem('userId') || '1';
  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    phone: '',
    email: '',
    roomId: '',
    password: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const user = accounts.find(a => a.id === userId) || {};
    setProfile(user);
    setRooms(JSON.parse(localStorage.getItem('rooms') || '[]'));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      password: newPassword || profile.password,
    };
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const updatedAccounts = accounts.map(a => a.id === userId ? updatedProfile : a);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setProfile(updatedProfile);
    setNewPassword('');
    onProfileUpdate();
  };

  return (
    <div className="profile">
      <form onSubmit={handleSubmit} className="profile-form">
        <div>
          <label>Tài khoản</label>
          <input
            type="text"
            value={profile.username}
            disabled
          />
        </div>
        <div>
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <div>
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            required
          />
        </div>
        {userRole === 'tenant' && (
          <div>
            <label>Phòng</label>
            <select
              name="roomId"
              value={profile.roomId}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn phòng</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="submit">Cập nhật</button>
      </form>
      {userRole === 'tenant' && (
        <Link to="/tenant-dashboard" className="tenant-dashboard-link">
          Xem thông tin tiền phòng
        </Link>
      )}
    </div>
  );
}

export default Profile;