import React, { useState } from 'react';
import RoomCard from '../components/RoomCard';
import InvoiceForm from '../components/invoice/InvoiceForm';
import '../styles/invoice/InvoicePage.css';

const ROOMS = [
  {
    id: 1,
    name: 'Phòng 101',
    owner: 'Nguyễn Văn A',
    phone: '0123456789',
    contractEnd: '2025-12-01',
    invoiceDate: '2025-04-01',
    status: 'Chưa lập',
    price: 3500000,
    guests: 2,
    floor: 1
  },
  {
    id: 2,
    name: 'Phòng 202',
    owner: 'Trần Thị B',
    phone: '0987654321',
    contractEnd: '2026-01-15',
    invoiceDate: '2025-04-01',
    status: 'Đã lập',
    price: 4000000,
    guests: 3,
    floor: 2
  },
];

const InvoicePage = () => {
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const handleCreateInvoice = (room) => {
    setActiveRoom(room);
    setModalOpen(true);
  };
  const filteredRooms = ROOMS.filter(room =>
    (selectedFloor === '' || room.floor === Number(selectedFloor)) &&
    room.invoiceDate.startsWith(selectedMonth)
  );

  return (
    <div className="invoice-page">
      <h2>Quản lý hóa đơn</h2>
      <div className="filter-bar">
        <select value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)}>
          <option value="">Tất cả tầng</option>
          <option value="1">Tầng 1</option>
          <option value="2">Tầng 2</option>
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="room-grid">
        {filteredRooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onCreateInvoice={() => handleCreateInvoice(room)}
          />
        ))}
      </div>
      <InvoiceForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={activeRoom || {}}
      />

    </div>
  );
};

export default InvoicePage;
