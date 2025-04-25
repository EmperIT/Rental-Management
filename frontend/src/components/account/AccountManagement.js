import { useState, useEffect } from 'react';
import RoleBasedAccess from '../dashboard/RoleBasedAccess';
import '../../styles/account/AccountManagement.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AccountManagement({ type }) {
  const [accounts, setAccounts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
    roomId: '',
    isLeadTenant: false,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const mockAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const mockRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    setAccounts(type === 'manager' ? mockAccounts.filter(a => a.role === 'manager') : mockAccounts.filter(a => a.role === 'tenant'));
    setRooms(mockRooms);
  }, [type]);

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData({
      ...formData,
      [name]: inputType === 'checkbox' ? checked : value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    let updatedAccounts = [...allAccounts];

    if (isEditMode) {
      // Cập nhật tài khoản (không cập nhật username, password)
      updatedAccounts = updatedAccounts.map((account) =>
        account.id === formData.id
          ? {
              ...account,
              fullName: formData.fullName,
              phone: formData.phone,
              email: formData.email,
              ...(type === 'tenant' && {
                roomId: formData.roomId,
                isLeadTenant: formData.isLeadTenant,
              }),
            }
          : account
      );
    } else {
      // Thêm tài khoản mới
      const newAccount = {
        ...formData,
        id: String(Date.now()),
        role: type,
      };
      updatedAccounts.push(newAccount);
    }

    // Cập nhật leadTenantId cho phòng nếu là tenant và isLeadTenant
    if (type === 'tenant' && formData.isLeadTenant && formData.roomId) {
      const updatedRooms = rooms.map((room) =>
        room.id === formData.roomId ? { ...room, leadTenantId: formData.id || String(Date.now()) } : room
      );
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }

    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setAccounts(type === 'manager' ? updatedAccounts.filter(a => a.role === 'manager') : updatedAccounts.filter(a => a.role === 'tenant'));
    resetForm();
    setIsPopupOpen(false);
  };

  const handleEdit = (account) => {
    setFormData(account);
    setIsEditMode(true);
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    let updatedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const accountToDelete = updatedAccounts.find((account) => account.id === id);

    if (type === 'tenant' && accountToDelete.isLeadTenant) {
      const updatedRooms = rooms.map((room) =>
        room.leadTenantId === id ? { ...room, leadTenantId: '' } : room
      );
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }

    updatedAccounts = updatedAccounts.filter((account) => account.id !== id);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setAccounts(type === 'manager' ? updatedAccounts.filter(a => a.role === 'manager') : updatedAccounts.filter(a => a.role === 'tenant'));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      username: '',
      password: '',
      fullName: '',
      phone: '',
      email: '',
      roomId: '',
      isLeadTenant: false,
    });
    setIsEditMode(false);
    setShowPassword(false);
  };

  return (
    <RoleBasedAccess allowedRoles={['landlord']}>
      <div className="account-management">
        <div className="account-management-header">
          <h2>Quản lý tài khoản {type === 'manager' ? 'Quản lý' : 'Khách thuê'}</h2>
          <button className="add-button" onClick={() => { resetForm(); setIsPopupOpen(true); }}>
            Thêm tài khoản
          </button>
        </div>
        <table className="account-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              {type === 'tenant' && <th>Phòng</th>}
              {type === 'tenant' && <th>Trưởng phòng</th>}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.username}</td>
                <td>{account.fullName}</td>
                <td>{account.phone}</td>
                <td>{account.email}</td>
                {type === 'tenant' && (
                  <td>{rooms.find((room) => room.id === account.roomId)?.name || '-'}</td>
                )}
                {type === 'tenant' && (
                  <td>{account.isLeadTenant ? 'Có' : 'Không'}</td>
                )}
                <td>
                  <button className="action-button edit" onClick={() => handleEdit(account)}>
                    Chỉnh sửa
                  </button>
                  <button className="action-button delete" onClick={() => handleDelete(account.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>{isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h4>Tài khoản</h4>
                  <div className="form-group">
                    <label>Tài khoản *</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      disabled={isEditMode}
                    />
                  </div>
                  <div className="form-group password-group">
                    <label>Mật khẩu *</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={isEditMode}
                      />
                      {!isEditMode && (
                        <span className="password-toggle" onClick={toggleShowPassword}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-section">
                  <h4>Thông tin cá nhân</h4>
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
                  {type === 'tenant' && (
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
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Lưu
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleBasedAccess>
  );
}

export default AccountManagement;