import React, { useState } from 'react';
import RoomCard from '../components/RoomCard';
import InvoiceForm from '../components/invoice/InvoiceForm';
import RoomDetailModal from '../components/invoice/RoomDetailModal';
import '../styles/invoice/InvoicePage.css';
import { FaCog } from 'react-icons/fa';

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
    floor: 1,
    invoices: [] // Thêm danh sách hóa đơn cho phòng
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
    floor: 2,
    invoices: [] // Thêm danh sách hóa đơn cho phòng
  },
];

const initialReasons = [
  { id: '1', title: 'Thu tiền tháng đầu tiên' },
  { id: '2', title: 'Thanh toán theo kỳ' },
  { id: '3', title: 'Dịch vụ bổ sung' },
];

const InvoicePage = () => {
  const [rooms, setRooms] = useState(ROOMS); // Quản lý trạng thái ROOMS để có thể cập nhật
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [modalOpen, setModalOpen] = useState(false);
  const [roomDetailModalOpen, setRoomDetailModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [defaultBillingDay, setDefaultBillingDay] = useState(1);
  const [reasons, setReasons] = useState(initialReasons);
  const [newReason, setNewReason] = useState('');

  const handleCreateInvoice = (room) => {
    setActiveRoom(room);
    setModalOpen(true);
  };

  const handleViewRoomDetails = (room) => {
    setSelectedRoom(room);
    setRoomDetailModalOpen(true);
  };

  const handleAddReason = () => {
    if (!newReason.trim()) {
      alert('Vui lòng nhập lý do!');
      return;
    }
    const newId = (reasons.length + 1).toString();
    setReasons([...reasons, { id: newId, title: newReason.trim() }]);
    setNewReason('');
  };

  const handleSaveInvoice = (roomId, invoice) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              invoices: [...room.invoices, invoice],
              status: 'Đã lập'
            }
          : room
      )
    );
  };

  const filteredRooms = rooms.filter(
    (room) =>
      (selectedFloor === '' || room.floor === Number(selectedFloor)) &&
      room.invoiceDate.startsWith(selectedMonth)
  );

  return (
    <div className="ip-invoice-page">
      <h2>Quản lý hóa đơn</h2>
      <div className="ip-filter-bar">
        <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
          <option value="">Tất cả tầng</option>
          <option value="1">Tầng 1</option>
          <option value="2">Tầng 2</option>
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <button className="ip-settings-button" onClick={() => setSettingsModalOpen(true)}>
          <FaCog /> Cài đặt
        </button>
      </div>

      {settingsModalOpen && (
        <div className="ip-modal-overlay">
          <div className="ip-modal">
            <div className="ip-modal-header">
              <h3>Cài đặt hóa đơn</h3>
              <button
                className="ip-button ip-button-close"
                onClick={() => setSettingsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
            <div className="ip-modal-content">
              <div className="ip-settings-group">
                <label>Ngày lập hóa đơn tự động (Thanh toán theo kỳ):</label>
                <select
                  value={defaultBillingDay}
                  onChange={(e) => setDefaultBillingDay(Number(e.target.value))}
                >
                  {[...Array(31).keys()].map((day) => (
                    <option key={day + 1} value={day + 1}>
                      Ngày {day + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ip-settings-group">
                <label>Thêm lý do lập hóa đơn:</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Nhập lý do mới"
                />
                <button className="ip-button ip-button-add" onClick={handleAddReason}>
                  Thêm
                </button>
              </div>
              <div className="ip-reasons-list">
                <h4>Danh sách lý do:</h4>
                <ul>
                  {reasons.map((reason) => (
                    <li key={reason.id}>{reason.title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ip-room-grid">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onCreateInvoice={() => handleCreateInvoice(room)}
            onViewDetails={() => handleViewRoomDetails(room)}
          />
        ))}
      </div>
      <InvoiceForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={activeRoom || {}}
        reasons={reasons}
        defaultBillingDay={defaultBillingDay}
        onSave={handleSaveInvoice}
      />
      {roomDetailModalOpen && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setRoomDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InvoicePage;