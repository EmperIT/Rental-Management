import { useState } from 'react';
import '../../styles/account/Profile.css';

function Profile() {
  // Mock user data (replace with API call or auth context)
  const [profile, setProfile] = useState({
    username: 'user1',
    email: 'user1@example.com',
    name: 'Tên người dùng',
    phone: '0123456789',
    room: 'P101',
    role: 'tenant_leader', // Could be landlord, manager, tenant_regular, tenant_leader
  });

  // Mock room tenants for tenant_leader (replace with API call)
  const [roomTenants, setRoomTenants] = useState([
    { id: 2, username: 'tenant1', name: 'Khách Thuê 1', phone: '0987654321' },
    { id: 3, username: 'tenant2', name: 'Khách Thuê 2', phone: '0912345678' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with API call to update profile
    alert('Thông tin đã được cập nhật!');
  };

  const isLandlord = profile.role === 'landlord';
  const isManager = profile.role === 'manager';
  const isTenant = profile.role === 'tenant_regular' || profile.role === 'tenant_leader';
  const isTenantLeader = profile.role === 'tenant_leader';

  return (
    <div className="profile">
      <h2 className="profile-title">Thông tin tài khoản</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>
          Tên đăng nhập:
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            disabled
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Họ và tên:
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Số điện thoại:
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
          />
        </label>
        {isTenant && (
          <label>
            Phòng:
            <input
              type="text"
              name="room"
              value={profile.room}
              onChange={handleInputChange}
              disabled
            />
          </label>
        )}
        {isLandlord && (
          <p className="role-info">Bạn là chủ trọ, có toàn quyền quản lý hệ thống.</p>
        )}
        {isManager && (
          <p className="role-info">Bạn là quản lý, có quyền quản lý phòng và hóa đơn.</p>
        )}
        {isTenantLeader && (
          <p className="role-info">
            Bạn là trưởng phòng, có thể quản lý thông tin khách thuê trong phòng {profile.room}.
          </p>
        )}
        {profile.role === 'tenant_regular' && (
          <p className="role-info">Bạn là khách thuê, có thể xem và cập nhật thông tin cá nhân.</p>
        )}
        <button type="submit">Cập nhật thông tin</button>
      </form>
      {isTenantLeader && (
        <div className="room-tenants">
          <h3>Khách thuê trong phòng {profile.room}</h3>
          <table>
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Họ và tên</th>
                <th>Số điện thoại</th>
              </tr>
            </thead>
            <tbody>
              {roomTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>{tenant.username}</td>
                  <td>{tenant.name}</td>
                  <td>{tenant.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Profile;