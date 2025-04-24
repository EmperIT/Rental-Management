import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/account/AccountManagementPage.css';

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    password: '',
    role: 'tenant_regular',
    name: '',
    phone: '',
    room: '',
  });
  const [editingAccount, setEditingAccount] = useState(null);
  const [error, setError] = useState('');

  // Mock data (replace with API call)
  useEffect(() => {
    const mockAccounts = [
      {
        id: 1,
        username: 'landlord',
        email: 'landlord@example.com',
        role: 'landlord',
        name: 'Chủ Trọ',
        phone: '0123456789',
        room: '',
      },
    ];
    setAccounts(mockAccounts);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  };

  const validateAccount = () => {
    // Check for one landlord
    if (newAccount.role === 'landlord') {
      const landlordExists = accounts.some((acc) => acc.role === 'landlord');
      if (landlordExists && (!editingAccount || editingAccount.role !== 'landlord')) {
        setError('Chỉ được phép có một tài khoản chủ trọ!');
        return false;
      }
    }
    // Check for one tenant_leader per room
    if (newAccount.role === 'tenant_leader' && newAccount.room) {
      const roomLeaderExists = accounts.some(
        (acc) =>
          acc.role === 'tenant_leader' &&
          acc.room === newAccount.room &&
          (!editingAccount || acc.id !== editingAccount.id)
      );
      if (roomLeaderExists) {
        setError(`Phòng ${newAccount.room} đã có trưởng phòng!`);
        return false;
      }
    }
    // Required fields
    if (!newAccount.username || !newAccount.email || !newAccount.name) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return false;
    }
    if (!editingAccount && !newAccount.password) {
      setError('Mật khẩu là bắt buộc khi tạo tài khoản!');
      return false;
    }
    // Room required for tenants
    if (
      (newAccount.role === 'tenant_regular' || newAccount.role === 'tenant_leader') &&
      !newAccount.room
    ) {
      setError('Phòng là bắt buộc cho khách thuê!');
      return false;
    }
    return true;
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setError('');
    if (!validateAccount()) return;

    const account = { ...newAccount, id: accounts.length + 1 };
    setAccounts([...accounts, account]);
    setNewAccount({
      username: '',
      email: '',
      password: '',
      role: 'tenant_regular',
      name: '',
      phone: '',
      room: '',
    });
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setNewAccount({ ...account, password: '' });
    setError('');
  };

  const handleUpdateAccount = (e) => {
    e.preventDefault();
    setError('');
    if (!validateAccount()) return;

    setAccounts(
      accounts.map((acc) =>
        acc.id === editingAccount.id ? { ...newAccount, id: acc.id } : acc
      )
    );
    setEditingAccount(null);
    setNewAccount({
      username: '',
      email: '',
      password: '',
      role: 'tenant_regular',
      name: '',
      phone: '',
      room: '',
    });
  };

  const handleDeleteAccount = (id) => {
    const account = accounts.find((acc) => acc.id === id);
    if (account.role === 'landlord') {
      setError('Không thể xóa tài khoản chủ trọ!');
      return;
    }
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  return (
    <div className="account-management">
      <h2 className="account-title">Quản lý tài khoản</h2>
      {error && <div className="error-message">{error}</div>}
      <form
        onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}
        className="account-form"
      >
        <input
          type="text"
          name="username"
          value={newAccount.username}
          onChange={handleInputChange}
          placeholder="Tên đăng nhập *"
          required
        />
        <input
          type="email"
          name="email"
          value={newAccount.email}
          onChange={handleInputChange}
          placeholder="Email *"
          required
        />
        <input
          type="text"
          name="name"
          value={newAccount.name}
          onChange={handleInputChange}
          placeholder="Họ và tên *"
          required
        />
        <input
          type="tel"
          name="phone"
          value={newAccount.phone}
          onChange={handleInputChange}
          placeholder="Số điện thoại"
        />
        <input
          type="text"
          name="room"
          value={newAccount.room}
          onChange={handleInputChange}
          placeholder="Phòng (cho khách thuê) *"
          disabled={newAccount.role === 'landlord' || newAccount.role === 'manager'}
        />
        {!editingAccount && (
          <input
            type="password"
            name="password"
            value={newAccount.password}
            onChange={handleInputChange}
            placeholder="Mật khẩu *"
            required
          />
        )}
        <select name="role" value={newAccount.role} onChange={handleInputChange}>
          <option value="landlord">Chủ trọ</option>
          <option value="manager">Quản lý</option>
          <option value="tenant_regular">Khách thuê (Thường)</option>
          <option value="tenant_leader">Khách thuê (Trưởng phòng)</option>
        </select>
        <button type="submit">{editingAccount ? 'Cập nhật' : 'Tạo tài khoản'}</button>
      </form>
      <div className="account-list">
        <h3>Danh sách tài khoản</h3>
        <table>
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Phòng</th>
              <th>Vai trò</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.username}</td>
                <td>{account.email}</td>
                <td>{account.name}</td>
                <td>{account.phone || '-'}</td>
                <td>{account.room || '-'}</td>
                <td>
                  {account.role === 'landlord'
                    ? 'Chủ trọ'
                    : account.role === 'manager'
                    ? 'Quản lý'
                    : account.role === 'tenant_regular'
                    ? 'Khách thuê (Thường)'
                    : 'Khách thuê (Trưởng phòng)'}
                </td>
                <td>
                  <button
                    onClick={() => handleEditAccount(account)}
                    className="edit-btn"
                    disabled={account.role === 'landlord'}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="delete-btn"
                    disabled={account.role === 'landlord'}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccountManagement;