import React, { useState } from 'react';
import TenantFormPopup from '../components/Tenant/TenantFormPopup';
import TenantDetailsPopup from '../components/Tenant/TenantDetailsPopup';
import ReservationFormPopup from '../components/Tenant/ReservationFormPopup';
import TenantTable from '../components/Tenant/TenantTable';

const TenantManagementPage = () => {
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showReservationPopup, setShowReservationPopup] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const houses = ['Nhà 1', 'Nhà 2'];

  const rooms = [
    {
      room_id: '1',
      roomName: 'Phòng 101',
      floor: 'Tầng 1',
      house: 'Nhà 1',
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
      house: 'Nhà 1',
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
      house: 'Nhà 2',
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
      house: 'Nhà 2',
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
      house: 'Nhà 2',
      price: 2800000,
      deposit: 1400000,
      area: 20,
      capacity: 2,
      availableDate: '2025-05-01',
      status: 'Trống',
    },
  ];

  const sampleTenant = {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyen.van.a@example.com',
    identity_number: '123456789',
    room_id: '2',
    permanent_address: '123 Đường Láng, Phường Láng Thượng, Quận Đống Đa, Hà Nội',
    is_active: true,
    is_lead_room: true,
    contract: {
      contract_id: 'HD001',
      deposit: 5000000,
      rent_amount: 3500000,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
    },
  };

  const handleAddTenant = (tenantData, account) => {
    setTenants((prev) => [...prev, { ...tenantData, id: Date.now().toString() }]);
    setShowFormPopup(false);
  };

  const handleAddReservation = (reservationData) => {
    setReservations((prev) => [...prev, { ...reservationData, id: Date.now().toString() }]);
    setShowReservationPopup(false);
  };

  const handleUpdateRoom = (updatedRoom) => {
    console.log('Cập nhật phòng:', updatedRoom);
  };

  const handleEditTenant = () => {
    setShowDetailsPopup(false);
    setShowFormPopup(true);
  };

  const openDetailsPopup = (tenant) => {
    console.log('Mở chi tiết khách thuê:', tenant); // Debug
    setSelectedTenant(tenant);
    setShowDetailsPopup(true);
    console.log('State sau khi mở:', { selectedTenant: tenant, showDetailsPopup: true }); // Debug
  };

  // Debug state mỗi khi render
  console.log('State hiện tại:', { showDetailsPopup, selectedTenant });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Quản lý khách thuê</h1>
      <button
        className="bg-indigo-600 text-white px-6 py-2 rounded-md mb-6"
        onClick={() => setShowFormPopup(true)}
      >
        Thêm khách thuê
      </button>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-md mb-6 ml-4"
        onClick={() => openDetailsPopup(sampleTenant)}
      >
        Xem khách thuê mẫu
      </button>
      <button
        className="bg-green-600 text-white px-6 py-2 rounded-md mb-6 ml-4"
        onClick={() => setShowReservationPopup(true)}
      >
        Thêm cọc giữ chỗ
      </button>

      <TenantTable tenants={tenants} rooms={rooms} onViewDetails={openDetailsPopup} />

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
          onClose={() => setShowDetailsPopup(false)}
          onEdit={handleEditTenant}
          isReservation={false}
          rooms={rooms}
        />
      )}

      {showReservationPopup && (
        <ReservationFormPopup
          onClose={() => setShowReservationPopup(false)}
          onSubmit={handleAddReservation}
          houses={houses}
          rooms={rooms}
        />
      )}
    </div>
  );
};

export default TenantManagementPage;