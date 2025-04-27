import React from 'react';
import { FaPhoneAlt, FaUser, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaFileInvoice } from 'react-icons/fa';
import { formatDate } from '../utils/formatDate'; 
import '../styles/RoomCard.css';

const RoomCard = ({ room, onCreateInvoice, onViewDetails }) => {
  return (
    <div className="room-card" onClick={() => onViewDetails(room)}>
      <div className="room-header">
        <FaFileInvoice className="icon" />
        <h3>{room.name}</h3>
      </div>
      <p><FaUser className="icon" /> Chủ: {room.owner}</p>
      <p><FaPhoneAlt className="icon" /> SĐT: {room.phone}</p>
      <p><FaCalendarAlt className={`icon ${room.contractEnd}`} /> Hạn hợp đồng: {room.contractEnd}</p>
      <p><FaCalendarAlt className="icon" /> Ngày lập: {formatDate(room.invoiceDate)}</p>
      <p className={`status ${room.status === 'Đã lập' ? 'created' : 'pending'}`}>
        {room.status}
      </p>
      <p><FaMoneyBillWave className="icon" /> Giá thuê: {room.price.toLocaleString()} VNĐ</p>
      <p><FaUsers className="icon" /> Khách: {room.guests} người</p>
      <button
        className="invoice-btn"
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện click lan lên thẻ cha
          onCreateInvoice(room.id);
        }}
      >
        Lập hóa đơn
      </button>
    </div>
  );
};

export default RoomCard;