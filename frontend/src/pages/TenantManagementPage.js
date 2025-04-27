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

  // Hàm làm mới danh sách khách thuê
  const refreshTenants = async () => {
    try {
      const roomsData = await findAllRooms(0, 0);
      const roomList = roomsData.rooms || [];
      setRooms(roomList);

      const tenantPromises = roomList.map((room) =>
        findAllTenantsByFilter(room.id, undefined, 0, 0)
      );
      const tenantResponses = await Promise.all(tenantPromises);

      let allTenants = tenantResponses.flatMap((response) => response.tenants || []);

      const activeTenants = allTenants.filter((t) => t.isActive && !isReservation(t));
      const pastTenants = allTenants.filter((t) => !t.isActive);
      const reservationTenants = allTenants.filter((t) => isReservation(t));

      setTenants(activeTenants.concat(pastTenants));
      setReservations(reservationTenants);
    } catch (error) {
      console.error('Failed to refresh tenants:', error);
      alert('Không thể làm mới danh sách khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  useEffect(() => {
    refreshTenants();
  }, []);

  // Hàm xác định khách cọc (reservation)
  const isReservation = (tenant) => {
    const today = new Date();
    const startDate = tenant.startDate ? new Date(tenant.startDate) : null;
    return tenant.holdingDepositPrice > 0 && (!startDate || startDate > today);
  };

  // Thêm khách thuê
  const handleAddTenant = async (tenantData) => {
    try {
      const newTenant = await createTenant({
        name: tenantData.name,
        email: tenantData.email,
        phone: tenantData.phone,
        roomId: tenantData.roomId,
        isLeadRoom: tenantData.isLeadRoom || false,
        identityNumber: tenantData.identityNumber,
        permanentAddress: tenantData.permanentAddress || '',
        holdingDepositPrice: tenantData.holdingDepositPrice || 0,
        depositDate: tenantData.depositDate || null,
        startDate: tenantData.startDate || new Date().toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await refreshTenants(); // Làm mới danh sách sau khi thêm
      setShowFormPopup(false);
      alert('Thêm khách thuê thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm khách thuê:', error);
      alert('Không thể thêm khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  // Thêm khách cọc
  const handleAddReservation = async (reservationData) => {
    try {
      const newReservation = {
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        roomId: reservationData.roomId,
        isLeadRoom: false,
        identityNumber: reservationData.identityNumber,
        permanentAddress: reservationData.permanentAddress || '',
        holdingDepositPrice: reservationData.holdingDepositPrice || 0,
        depositDate: reservationData.depositDate || new Date().toISOString(),
        startDate: reservationData.startDate || new Date().toISOString(),
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createTenant(newReservation);
      await refreshTenants(); // Làm mới danh sách sau khi thêm
      setShowReservationPopup(false);
      alert('Thêm khách cọc thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm khách cọc:', error);
      alert('Không thể thêm khách cọc: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  // Sửa khách thuê
  const handleEditTenant = async (tenantData) => {
    try {
      const updatedTenant = await updateTenant(tenantData.id, {
        ...tenantData,
        updatedAt: new Date().toISOString(),
      });

      await refreshTenants(); // Làm mới danh sách sau khi sửa
      setShowFormPopup(false);
      setSelectedTenant(null);
      alert('Cập nhật khách thuê thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật khách thuê:', error);
      alert('Không thể cập nhật khách thuê: ' + (error.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  // Xóa khách thuê
  const handleDeleteTenant = async (tenant) => {
    const confirm = window.confirm('Bạn có chắc chắn muốn xóa khách thuê này?');
    if (confirm) {
      try {
        await removeTenant(tenant.id);
        await refreshTenants(); // Làm mới danh sách sau khi xóa
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

        await refreshTenants(); // Làm mới danh sách sau khi thay đổi trạng thái
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
          startDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await refreshTenants(); // Làm mới danh sách sau khi chuyển đổi
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
      if (statusFilter && !isReservation) {
        statusMatch = statusFilter === 'active' ? item.isActive : !item.isActive;
      } else if (statusFilter && isReservation) {
        statusMatch = statusFilter === 'reservation';
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
    ...tenants.map((tenant) => ({ ...tenant, type: tenant.isActive ? 'active' : 'past' })),
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