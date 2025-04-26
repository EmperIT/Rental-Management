import React, { useState, useEffect } from 'react';
import TenantFormPopup from '../components/Tenant/TenantFormPopup';
import TenantDetailsPopup from '../components/Tenant/TenantDetailsPopup';
import ReservationFormPopup from '../components/Tenant/ReservationFormPopup';
import TenantTable from '../components/Tenant/TenantTable';
import SummaryCards from '../components/Tenant/SummaryCards';
import ExcelExport from '../components/Tenant/ExcelExport';
import '../styles/Tenant/tenantmanagement.css';

const TenantManagementPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showReservationPopup, setShowReservationPopup] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [floorFilter, setFloorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rooms, setRooms] = useState([
    {
      room_id: '1',
      roomName: 'Phòng 101',
      floor: 'Tầng 1',
      price: 3000000,
      deposit: 1500000,
      area: 25,
      capacity: 2,
      availableDate: '2025-05-01',
      status: 'Trống',
    },
    {
      room_id: '2',
      roomName: 'Phòng 102',
      floor: 'Tầng 2',
      price: 3500000,
      deposit: 1750000,
      area: 30,
      capacity: 3,
      availableDate: '2025-05-01',
      status: 'Đã thuê',
    },
    {
      room_id: '3',
      roomName: 'Phòng 103',
      floor: 'Tầng 1',
      price: 3200000,
      deposit: 1600000,
      area: 28,
      capacity: 2,
      availableDate: '2025-05-01',
      status: 'Trống',
    },
    {
      room_id: '4',
      roomName: 'Phòng 104',
      floor: 'Tầng 2',
      price: 4000000,
      deposit: 2000000,
      area: 35,
      capacity: 4,
      availableDate: '2025-05-01',
      status: 'Đã thuê',
    },
    {
      room_id: '5',
      roomName: 'Phòng 105',
      floor: 'Tầng 3',
      price: 2800000,
      deposit: 1400000,
      area: 20,
      capacity: 2,
      availableDate: '2025-05-01',
      status: 'Trống',
    },
  ]);

  const handleAddTenant = (tenantData, account) => {
    const newTenant = {
      tenant_id: Date.now(),
      room_id: tenantData.room_id,
      name: tenantData.name,
      email: tenantData.email,
      phone: tenantData.phone,
      identity_number: tenantData.identity_number,
      province: tenantData.province,
      district: tenantData.district,
      ward: tenantData.ward,
      address: tenantData.address,
      is_lead_room: tenantData.is_lead_room,
      is_active: true,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      contract: tenantData.contract,
    };
    setTenants((prev) => [...prev, newTenant]);
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.room_id === tenantData.room_id ? { ...room, status: 'Đã thuê' } : room
      )
    );
    setShowFormPopup(false);
  };

  const handleAddReservation = (reservationData) => {
    const newReservation = {
      tenant_id: Date.now(),
      room_id: reservationData.room_id,
      name: reservationData.name,
      email: reservationData.email,
      phone: reservationData.phone,
      identity_number: reservationData.identity_number,
      province: reservationData.province || '',
      district: reservationData.district || '',
      ward: reservationData.ward || '',
      address: reservationData.address || '',
      is_lead_room: false,
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
      contract: reservationData.contract,
      moveInDate: reservationData.moveInDate,
    };
    setReservations((prev) => [...prev, newReservation]);
    setShowReservationPopup(false);
  };

  const handleUpdateRoom = (updatedRoom) => {
    console.log('Cập nhật phòng:', updatedRoom);
  };

  const handleEditTenant = () => {
    setShowDetailsPopup(false);
    setShowFormPopup(true);
  };

  const handleChangeStatus = (tenant, isActive) => {
    const confirm = window.confirm(
      isActive
        ? 'Bạn có chắc chắn muốn cho khách thuê lại?'
        : 'Bạn có chắc chắn muốn chuyển trạng thái khách thuê thành "Rời đi"?'
    );
    if (confirm) {
      const updatedTenant = { ...tenant, is_active: isActive, update_at: new Date().toISOString() };
      if (isActive) {
        setTenants((prev) => [...prev, updatedTenant]);
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.room_id === tenant.room_id ? { ...room, status: 'Đã thuê' } : room
          )
        );
      } else {
        setTenants((prev) =>
          prev.map((t) => (t.tenant_id === tenant.tenant_id ? updatedTenant : t))
        );
        const remainingTenants = tenants.filter(
          (t) => t.room_id === tenant.room_id && t.tenant_id !== tenant.tenant_id && t.is_active
        );
        if (remainingTenants.length === 0) {
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room.room_id === tenant.room_id ? { ...room, status: 'Trống' } : room
            )
          );
        }
      }
      setShowDetailsPopup(false);
      setSelectedTenant(null);
    }
  };

  const handleReRent = (tenant) => {
    handleChangeStatus(tenant, true);
  };

  const handleConvertToTenant = (reservation) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn chuyển khách cọc thành khách đang thuê?');
    if (confirm) {
      const newTenant = {
        ...reservation,
        is_active: true,
        is_lead_room: false,
        create_at: new Date().toISOString(),
        update_at: new Date().toISOString(),
      };
      setTenants((prev) => [...prev, newTenant]);
      setReservations((prev) =>
        prev.filter((r) => r.tenant_id !== reservation.tenant_id)
      );
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.room_id === reservation.room_id ? { ...room, status: 'Đã thuê' } : room
        )
      );
      setShowDetailsPopup(false);
      setSelectedTenant(null);
    }
  };

  const openDetailsPopup = (tenant, isReservation = false) => {
    setSelectedTenant({ ...tenant, isReservation });
    setShowDetailsPopup(true);
  };

  const floors = [...new Set(rooms.map((room) => room.floor))];

  const filterTenantsAndReservations = (data, isReservation = false) => {
    return data.filter((item) => {
      let nameMatch = true;
      if (searchQuery) {
        nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      let statusMatch = true;
      if (statusFilter && !isReservation) {
        statusMatch = statusFilter === 'active' ? item.is_active : !item.is_active;
      } else if (statusFilter && isReservation) {
        statusMatch = statusFilter === 'reservation';
      }

      let floorMatch = true;
      if (floorFilter) {
        const room = rooms.find((r) => r.room_id === item.room_id);
        floorMatch = room && room.floor === floorFilter;
      }

      let dateMatch = true;
      if (dateFrom && dateTo) {
        const itemDate = new Date(item.create_at);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        dateMatch = itemDate >= fromDate && itemDate <= toDate;
      }

      return nameMatch && statusMatch && floorMatch && dateMatch;
    });
  };

  const allTenantsAndReservations = [
    ...tenants.map((tenant) => ({ ...tenant, type: tenant.is_active ? 'active' : 'past' })),
    ...reservations.map((reservation) => ({ ...reservation, type: 'reservation' })),
  ];

  const filteredData = filterTenantsAndReservations(allTenantsAndReservations);

  const filteredCurrentTenants = filteredData.filter((item) => item.type === 'active');
  const filteredPastTenants = filteredData.filter((item) => item.type === 'past');
  const filteredReservations = filteredData.filter((item) => item.type === 'reservation');

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="header">
          <h1 className="header-title">Quản lý khách thuê tọ</h1>
          <div className="header-buttons">
            <button className="btn-primary" onClick={() => setShowFormPopup(true)}>
              Thêm khách thuê
            </button>
            <button className="btn-primary" onClick={() => setShowReservationPopup(true)}>
              Thêm khách cọc
            </button>
            <ExcelExport tenants={tenants} reservations={reservations} rooms={rooms} />
          </div>
        </div>

        <SummaryCards
          currentTenants={filteredCurrentTenants}
          pastTenants={filteredPastTenants}
          reservations={filteredReservations}
        />

        <div className="filter-container">
          <div className="filter-content">
            <div className="filter-search-wrapper">
              <span className="filter-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Tìm kiếm khách thuê"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input filter-search-input"
              />
            </div>
            <div className="filter-select-wrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả</option>
                <option value="active">Khách đang thuê</option>
                <option value="past">Khách đã rời</option>
                <option value="reservation">Khách cọc</option>
              </select>
            </div>
            <div className="filter-select-wrapper">
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Tất cả tầng</option>
                {floors.map((floor) => (
                  <option key={floor} value={floor}>
                    {floor}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-date-wrapper">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="filter-input"
                placeholder="mm/dd/yyyy"
              />
              <span className="mx-2">-</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="filter-input"
                placeholder="mm/dd/yyyy"
              />
            </div>
          </div>
        </div>

        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Khách đang thuê ({filteredCurrentTenants.length})
          </button>
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Khách đã rời ({filteredPastTenants.length})
          </button>
          <button
            className={`tab ${activeTab === 'reservation' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservation')}
          >
            Khách cọc giữ chỗ ({filteredReservations.length})
          </button>
        </div>

        {activeTab === 'current' && (
          <TenantTable
            tenants={filteredCurrentTenants}
            rooms={rooms}
            onViewDetails={(tenant) => openDetailsPopup(tenant, false)}
            isReservationTab={false}
          />
        )}
        {activeTab === 'past' && (
          <TenantTable
            tenants={filteredPastTenants}
            rooms={rooms}
            onViewDetails={(tenant) => openDetailsPopup(tenant, false)}
            isReservationTab={false}
          />
        )}
        {activeTab === 'reservation' && (
          <TenantTable
            tenants={filteredReservations}
            rooms={rooms}
            onViewDetails={(tenant) => openDetailsPopup(tenant, true)}
            isReservationTab={true}
          />
        )}

        {showFormPopup && (
          <TenantFormPopup
            onClose={() => setShowFormPopup(false)}
            onSubmit={handleAddTenant}
            rooms={rooms}
            onUpdateRoom={handleUpdateRoom}
            initialData={selectedTenant}
            isEdit={!!selectedTenant}
          />
        )}

        {showDetailsPopup && selectedTenant && (
          <TenantDetailsPopup
            tenant={selectedTenant}
            onClose={() => {
              setShowDetailsPopup(false);
              setSelectedTenant(null);
            }}
            onEdit={handleEditTenant}
            onChangeStatus={handleChangeStatus}
            onReRent={handleReRent}
            onConvertToTenant={handleConvertToTenant}
            isReservation={selectedTenant.isReservation || false}
            rooms={rooms}
          />
        )}

        {showReservationPopup && (
          <ReservationFormPopup
            onClose={() => setShowReservationPopup(false)}
            onSubmit={handleAddReservation}
            rooms={rooms}
          />
        )}
      </div>
    </div>
  );
};

export default TenantManagementPage;