import React, { useState, useEffect } from 'react';
import TenantFormPopup from '../components/Tenant/TenantFormPopup';
import TenantDetailsPopup from '../components/Tenant/TenantDetailsPopup';
import ReservationFormPopup from '../components/Tenant/ReservationFormPopup';
import TenantTable from '../components/Tenant/TenantTable';
import SummaryCards from '../components/Tenant/SummaryCards';
import ExcelExport from '../components/Tenant/ExcelExport';
import { createTenant, findAllRooms, findAllTenantsByFilter, updateTenant, removeTenant } from '../services/rentalService';
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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [rooms, setRooms] = useState([]);

  const refreshTenants = async () => {
    try {
      const roomsData = await findAllRooms(0, 0);
      const roomList = roomsData.rooms || [];
      setRooms(roomList);

      const tenantPromises = roomList.map((room) =>
        findAllTenantsByFilter(room.id, undefined, 1, 0)
      );
      const tenantResponses = await Promise.all(tenantPromises);

      let allTenants = tenantResponses.flatMap((response) => response.tenants || []);

      const activeTenants = allTenants.filter((t) => t.isActive && !isReservation(t) && getTenantStatus(t) === 'Đang thuê');
      const aboutToMoveInTenants = allTenants.filter((t) => t.isActive && getTenantStatus(t) === 'Sắp chuyển đến');
      const depositedTenants = allTenants.filter((t) => t.isActive && getTenantStatus(t) === 'Đã cọc');
      const pastTenants = allTenants.filter((t) => !t.isActive);
      const reservationTenants = allTenants.filter((t) => isReservation(t));

      setTenants(activeTenants.concat(aboutToMoveInTenants, depositedTenants, pastTenants));
      setReservations(reservationTenants);

      console.log('Refreshed tenants:', allTenants);
    } catch (error) {
      console.error('Failed to refresh tenants:', error);
      alert('Không thể làm mới danh sách khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  useEffect(() => {
    refreshTenants();
  }, []);

  const getTenantStatus = (tenant) => {
    const today = new Date();
    const startDate = tenant.startDate ? new Date(tenant.startDate) : null;
    const depositDate = tenant.depositDate ? new Date(tenant.depositDate) : null;

    if (!depositDate) {
      return 'Sắp chuyển đến';
    } else if (depositDate && !startDate) {
      return 'Đã cọc';
    } else if (startDate && startDate <= today) {
      return 'Đang thuê';
    }
    return 'Sắp chuyển đến';
  };

  const isReservation = (tenant) => {
    const today = new Date();
    const startDate = tenant.startDate ? new Date(tenant.startDate) : null;
    return tenant.holdingDepositPrice > 0 && (!startDate || startDate > today);
  };

  const handleAddTenant = async (tenantData) => {
    try {
      console.log('Adding tenant data:', tenantData);
      console.log('Gender and birthday:', { gender: tenantData.gender, birthday: tenantData.birthday });
      const newTenant = await createTenant({
        name: tenantData.name,
        email: tenantData.email || '',
        phone: tenantData.phone,
        roomId: tenantData.roomId,
        isLeadRoom: tenantData.isLeadRoom || false,
        identityNumber: tenantData.identityNumber,
        permanentAddress: tenantData.permanentAddress || '',
        holdingDepositPrice: tenantData.holdingDepositPrice || 0,
        depositDate: tenantData.depositDate || null,
        startDate: tenantData.startDate || null,
        gender: tenantData.gender || null,
        birthday: tenantData.birthday || null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log('Created tenant response:', newTenant);
      await refreshTenants();
      setShowFormPopup(false);
      alert('Thêm khách thuê thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm khách thuê:', error);
      alert('Không thể thêm khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const handleAddReservation = async (reservationData) => {
    try {
      console.log('Adding reservation data:', reservationData);
      console.log('Gender and birthday:', { gender: reservationData.gender, birthday: reservationData.birthday });
      const newReservation = {
        name: reservationData.name,
        email: reservationData.email || '',
        phone: reservationData.phone,
        roomId: reservationData.roomId,
        isLeadRoom: false,
        identityNumber: reservationData.identityNumber,
        permanentAddress: reservationData.permanentAddress || '',
        holdingDepositPrice: reservationData.holdingDepositPrice || 0,
        depositDate: reservationData.depositDate || null,
        startDate: reservationData.startDate || null,
        gender: reservationData.gender || null,
        birthday: reservationData.birthday || null,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await createTenant(newReservation);
      console.log('Created reservation response:', response);
      await refreshTenants();
      setShowReservationPopup(false);
      alert('Thêm khách cọc thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm khách cọc:', error);
      alert('Không thể thêm khách cọc: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const handleEditTenant = async (tenantData) => {
    try {
      console.log('Editing tenant data:', tenantData);
      console.log('Gender and birthday:', { gender: tenantData.gender, birthday: tenantData.birthday });
      const updatedTenant = await updateTenant(tenantData.id, {
        ...tenantData,
        birthday: tenantData.birthday || null,
        gender: tenantData.gender || null,
        updatedAt: new Date().toISOString(),
      });

      console.log('Updated tenant response:', updatedTenant);
      await refreshTenants();
      setShowFormPopup(false);
      setSelectedTenant(null);
      alert('Cập nhật khách thuê thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật khách thuê:', error);
      alert('Không thể cập nhật khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const handleDeleteTenant = async (tenant) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa khách thuê này?');
    if (confirm) {
      try {
        await removeTenant(tenant.id);
        await refreshTenants();
        setShowDetailsPopup(false);
        setSelectedTenant(null);
        alert('Xóa khách thuê thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa khách thuê:', error);
        alert('Không thể xóa khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
      }
    }
  };

  const handleChangeStatus = async (tenant, isActive) => {
    const confirm = window.confirm(
      isActive
        ? 'Bạn có chắc chắn muốn cho khách thuê lại?'
        : 'Bạn có chắc chắn muốn chuyển trạng thái khách thuê thành "Rời đi"?'
    );
    if (confirm) {
      try {
        await updateTenant(tenant.id, {
          ...tenant,
          isActive: isActive,
          updatedAt: new Date().toISOString(),
        });

        await refreshTenants();
        setShowDetailsPopup(false);
        setSelectedTenant(null);
        alert(`Cập nhật trạng thái khách thuê thành công!`);
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái khách thuê:', error);
        alert('Không thể cập nhật trạng thái: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
      }
    }
  };

  const handleReRent = (tenant) => {
    handleChangeStatus(tenant, true);
  };

  const handleConvertToTenant = async (reservation) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn chuyển khách cọc thành khách đang thuê?');
    if (confirm) {
      try {
        await updateTenant(reservation.id, {
          ...reservation,
          isActive: true,
          isLeadRoom: false,
          startDate: reservation.startDate || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await refreshTenants();
        setShowDetailsPopup(false);
        setSelectedTenant(null);
        alert('Chuyển khách cọc thành khách thuê thành công!');
      } catch (error) {
        console.error('Lỗi khi chuyển khách cọc:', error);
        alert('Không thể chuyển khách cọc: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
      }
    }
  };

  const openDetailsPopup = (tenant, isReservation = false) => {
    setSelectedTenant({ ...tenant, isReservation });
    setShowDetailsPopup(true);
  };

  const filterTenantsAndReservations = (data, isReservation = false) => {
    return data.filter((item) => {
      let nameMatch = true;
      if (searchQuery) {
        nameMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      let statusMatch = true;
      if (statusFilter) {
        if (isReservation) {
          statusMatch = statusFilter === 'reservation';
        } else {
          const tenantStatus = getTenantStatus(item);
          statusMatch =
            (statusFilter === 'current' && tenantStatus === 'Đang thuê') ||
            (statusFilter === 'aboutToMoveIn' && tenantStatus === 'Sắp chuyển đến') ||
            (statusFilter === 'deposited' && tenantStatus === 'Đã cọc') ||
            (statusFilter === 'past' && !item.isActive);
        }
      }

      let dateMatch = true;
      if (dateFrom && dateTo) {
        const itemDate = new Date(item.createdAt);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        dateMatch = itemDate >= fromDate && itemDate <= toDate;
      }

      return nameMatch && statusMatch && dateMatch;
    });
  };

  const allTenantsAndReservations = [
    ...tenants.map((tenant) => ({ ...tenant, type: getTenantStatus(tenant) })),
    ...reservations.map((reservation) => ({ ...reservation, type: 'reservation' })),
  ];

  const filteredData = filterTenantsAndReservations(allTenantsAndReservations);

  const filteredCurrentTenants = filteredData.filter((item) => item.type === 'Đang thuê');
  const filteredAboutToMoveInTenants = filteredData.filter((item) => item.type === 'Sắp chuyển đến');
  const filteredDepositedTenants = filteredData.filter((item) => item.type === 'Đã cọc');
  const filteredPastTenants = filteredData.filter((item) => item.type === 'past');
  const filteredReservations = filteredData.filter((item) => item.type === 'reservation');

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="header">
          <h1 className="header-title">Quản lý khách thuê trọ</h1>
          <div className="header-buttons">
            <button className="btn-primary" onClick={() => setShowFormPopup(true)}>
              Thêm khách
            </button>
            <ExcelExport tenants={tenants} reservations={reservations} rooms={rooms} />
          </div>
        </div>

        <SummaryCards
          currentTenants={filteredCurrentTenants}
          aboutToMoveInTenants={filteredAboutToMoveInTenants}
          depositedTenants={filteredDepositedTenants}
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
                <option value="current">Đang thuê</option>
                <option value="aboutToMoveIn">Sắp chuyển đến</option>
                <option value="deposited">Đã cọc</option>
                <option value="past">Đã rời</option>
                <option value="reservation">Khách cọc</option>
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
            Đang thuê ({filteredCurrentTenants.length})
          </button>
          <button
            className={`tab ${activeTab === 'aboutToMoveIn' ? 'active' : ''}`}
            onClick={() => setActiveTab('aboutToMoveIn')}
          >
            Sắp chuyển đến ({filteredAboutToMoveInTenants.length})
          </button>
          <button
            className={`tab ${activeTab === 'deposited' ? 'active' : ''}`}
            onClick={() => setActiveTab('deposited')}
          >
            Đã cọc ({filteredDepositedTenants.length})
          </button>
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Đã rời ({filteredPastTenants.length})
          </button>
          <button
            className={`tab ${activeTab === 'reservation' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservation')}
          >
            Khách cọc ({filteredReservations.length})
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
        {activeTab === 'aboutToMoveIn' && (
          <TenantTable
            tenants={filteredAboutToMoveInTenants}
            rooms={rooms}
            onViewDetails={(tenant) => openDetailsPopup(tenant, false)}
            isReservationTab={false}
          />
        )}
        {activeTab === 'deposited' && (
          <TenantTable
            tenants={filteredDepositedTenants}
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
            onClose={() => {
              setShowFormPopup(false);
              setSelectedTenant(null);
            }}
            onSubmit={selectedTenant ? handleEditTenant : handleAddTenant}
            rooms={rooms}
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
            onEdit={() => {
              setShowDetailsPopup(false);
              setShowFormPopup(true);
            }}
            onDelete={handleDeleteTenant}
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