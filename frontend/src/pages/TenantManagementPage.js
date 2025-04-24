import React, { useState } from 'react';
import TenantFilter from '../components/Tenant/TenantFilter';
import TenantTable from '../components/Tenant/TenantTable';
import TenantFormPopup from '../components/Tenant/TenantFormPopup';
import TenantDetailsPopup from '../components/Tenant/TenantDetailsPopup';
import ReservationFormPopup from '../components/Tenant/ReservationFormPopup';
import '../styles/Tenant/tenantmanagement.css'
import ExcelUpload from '../components/Tenant/ExcelUpload'; // Import ExcelUpload component
const TenantManagementPage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [tenants, setTenants] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [houseFilter, setHouseFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [showAddTenantPopup, setShowAddTenantPopup] = useState(false);
  const [showEditTenantPopup, setShowEditTenantPopup] = useState(false);
  const [showTenantDetailsPopup, setShowTenantDetailsPopup] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showAddReservationPopup, setShowAddReservationPopup] = useState(false);
  const [showEditReservationPopup, setShowEditReservationPopup] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showExcelUpload, setShowExcelUpload] = useState(false);

  const houses = ['Nhà A', 'Nhà B'];
  const rooms = ['Phòng 101', 'Phòng 102'];

  const filteredTenants = tenants.filter((tenant) => {
    const matchesTab = activeTab === 'current'; // Only "Current" tenants
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = !houseFilter || tenant.house === houseFilter;
    const matchesRoom = !roomFilter || tenant.room === roomFilter;
    return matchesTab && matchesSearch && matchesHouse && matchesRoom;
  });

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = reservation.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHouse = !houseFilter || reservation.house === houseFilter;
    const matchesRoom = !roomFilter || reservation.room === roomFilter;
    return matchesSearch && matchesHouse && matchesRoom;
  });

  const handleAddTenant = (tenantData) => {
    // Add contract information to tenant
    const newTenant = {
      ...tenantData,
      is_active: true, // From schema
      is_lead_room: tenantData.isRepresentative || false,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      contract: {
        contract_id: Date.now(), // Mock contract_id
        tenant_id: tenantData.id,
        room_id: tenantData.room, // Link to room
        template_id: null, // Optional
        deposit: '0', // Default
        rent_amount: '0', // Default
        content: '', // Default
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year contract
        create_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      },
    };
    setTenants((prev) => [...prev, newTenant]);
    setShowAddTenantPopup(false);
  };

  const handleEditTenant = (updatedTenant) => {
    setTenants((prev) =>
      prev.map((tenant) =>
        tenant.id === updatedTenant.id
          ? {
              ...tenant,
              ...updatedTenant,
              update_at: new Date().toISOString(),
              contract: {
                ...tenant.contract,
                room_id: updatedTenant.room, // Update room in contract
                update_at: new Date().toISOString(),
              },
            }
          : tenant
      )
    );
    setShowEditTenantPopup(false);
    setShowTenantDetailsPopup(false);
  };

  const handleExcelUpload = (data) => {
    const newTenants = data.map((row, index) => ({
      id: Date.now() + index,
      room_id: row.room || rooms[0], // Map to room_id
      is_active: true,
      is_lead_room: row.isRepresentative === 'true',
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      identity_number: row.identityNumber || '',
      house: row.house || houses[0],
      room: row.room || rooms[0],
      province: row.province || '',
      district: row.district || '',
      ward: row.ward || '',
      address: row.address || '',
      notes: row.notes || '',
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      contract: {
        contract_id: Date.now() + index,
        tenant_id: Date.now() + index,
        room_id: row.room || rooms[0],
        template_id: null,
        deposit: row.deposit || '0',
        rent_amount: row.rent_amount || '0',
        content: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        create_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      },
    }));
    setTenants((prev) => [...prev, ...newTenants]);
    setShowExcelUpload(false);
  };

  const handleAddReservation = (reservationData) => {
    setReservations((prev) => [...prev, reservationData]);
    setShowAddReservationPopup(false);
  };

  const handleEditReservation = (updatedReservation) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === updatedReservation.id ? { ...reservation, ...updatedReservation } : reservation
      )
    );
    setShowEditReservationPopup(false);
  };

  const handleDeleteReservation = (reservationId) => {
    setReservations((prev) => prev.filter((reservation) => reservation.id !== reservationId));
    alert('Xóa thành công!');
  };

  return (
    <div className="page-container">
      <div className="page-content">
        <header className="header">
          <h1 className="header-title">Quản lý khách thuê</h1>
          <div className="header-buttons">
            {activeTab === 'current' && (
              <>
                <button
                  className="btn-primary"
                  onClick={() => setShowAddTenantPopup(true)}
                >
                  Thêm khách
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setShowExcelUpload(true)}
                >
                  Thêm bằng Excel
                </button>
              </>
            )}
            {activeTab === 'upcoming' && (
              <button
                className="btn-primary"
                onClick={() => setShowAddReservationPopup(true)}
              >
                Thêm cọc giữ chỗ
              </button>
            )}
          </div>
        </header>

        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Đang thuê
          </button>
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Sắp chuyển đến
          </button>
        </div>

        <TenantFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          houseFilter={houseFilter}
          setHouseFilter={setHouseFilter}
          roomFilter={roomFilter}
          setRoomFilter={setRoomFilter}
          houses={houses}
          rooms={rooms}
        />

        <TenantTable
          tenants={activeTab === 'upcoming' ? filteredReservations : filteredTenants}
          onView={(tenant) => {
            setSelectedTenant(tenant);
            setShowTenantDetailsPopup(true);
          }}
          isReservation={activeTab === 'upcoming'}
        />

        {showAddTenantPopup && (
          <TenantFormPopup
            onClose={() => setShowAddTenantPopup(false)}
            onSubmit={handleAddTenant}
            houses={houses}
            rooms={rooms}
          />
        )}

        {showEditTenantPopup && selectedTenant && (
          <TenantFormPopup
            onClose={() => setShowEditTenantPopup(false)}
            onSubmit={handleEditTenant}
            initialData={selectedTenant}
            isEdit={true}
            houses={houses}
            rooms={rooms}
          />
        )}

        {showTenantDetailsPopup && selectedTenant && (
          <TenantDetailsPopup
            tenant={selectedTenant}
            onClose={() => setShowTenantDetailsPopup(false)}
            onEdit={() => {
              setShowEditTenantPopup(true);
              setShowTenantDetailsPopup(false);
            }}
            roomTenants={tenants.filter(
              (t) => t.room === selectedTenant.room && t.is_active && t.id !== selectedTenant.id
            )}
            isReservation={activeTab === 'upcoming'}
            onEditReservation={() => {
              setSelectedReservation(selectedTenant);
              setShowEditReservationPopup(true);
              setShowTenantDetailsPopup(false);
            }}
            onDeleteReservation={handleDeleteReservation}
          />
        )}

        {showAddReservationPopup && (
          <ReservationFormPopup
            onClose={() => setShowAddReservationPopup(false)}
            onSubmit={handleAddReservation}
            houses={houses}
            rooms={rooms}
          />
        )}

        {showEditReservationPopup && selectedReservation && (
          <ReservationFormPopup
            onClose={() => setShowEditReservationPopup(false)}
            onSubmit={handleEditReservation}
            initialData={selectedReservation}
            isEdit={true}
            houses={houses}
            rooms={rooms}
          />
        )}

        {showExcelUpload && (
          <ExcelUpload
            onClose={() => setShowExcelUpload(false)}
            onUpload={handleExcelUpload}
            expectedHeaders={[
              'name',
              'email',
              'phone',
              'identityNumber',
              'house',
              'room',
              'province',
              'district',
              'ward',
              'address',
              'notes',
              'isRepresentative',
              'deposit',
              'rent_amount',
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default TenantManagementPage;