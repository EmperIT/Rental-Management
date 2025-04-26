import React, { useState } from 'react';
import Sidebar from '../components/customerdashboard/Sidebar';
import ContractList from '../components/customerdashboard/ContractList';
import TempResidenceList from '../components/customerdashboard/TempResidenceList';
import PersonalInfo from '../components/customerdashboard/PersonalInfo';
import InvoiceList from '../components/customerdashboard/InvoiceList';
import '../styles/customerdashboard/CustomerDashboard.css';

export default function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState('contracts');

  const renderContent = () => {
    switch (activeSection) {
      case 'contracts':
        return <ContractList />;
      case 'temp-residence':
        return <TempResidenceList />;
      case 'personal-info':
        return <PersonalInfo />;
      case 'invoices':
        return <InvoiceList />;
      default:
        return <ContractList />;
    }
  };

  return (
    <div className="cd-dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="cd-dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}