import { useState } from 'react';
import AccountManagement from '../components/account/AccountManagement';
import '../styles/account/AccountManagementPage.css';

function AccountManagementPage({ type }) {
  const [refresh, setRefresh] = useState(false);

  const handleAccountChange = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="account-management-page">
      <AccountManagement type={type} onAccountChange={handleAccountChange} key={refresh} />
    </div>
  );
}

export default AccountManagementPage;