import React, { useState, useEffect } from 'react';
import SummaryCards from '../components/RoomManagement/SummaryCards';
import RoomFilter from '../components/RoomManagement/RoomFilter';
import RoomTable from '../components/RoomManagement/RoomTable';
import RoomFormPopup from '../components/RoomManagement/RoomFormPopup';
import ExcelUpload from '../components/RoomManagement/ExcelUpload';
import '../styles/roomanagement/roomanagement.css';
import { findAllRooms, createRoom, updateRoom, removeRoom } from '../services/rentalService';

const RoomManagementPage = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await findAllRooms();
        setRooms(response.rooms || []);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
        alert('Không thể lấy danh sách phòng. Vui lòng thử lại.');
      }
    };
    fetchRooms();
  }, []);

  const handleExcelUpload = async (newRooms) => {
    try {
      setRooms((prev) => [...prev, ...newRooms]);
    } catch (error) {
      console.error('Lỗi khi upload file Excel:', error);
      alert('Không thể upload file Excel. Vui lòng thử lại.');
    }
  };

  const handleAddRoom = async (roomData) => {
    try {
      const formData = new FormData();
      Object.keys(roomData).forEach((key) => {
        if (key !== 'images' && key !== 'newImages' && key !== 'createdAt' && key !== 'updatedAt') {
          formData.append(key, roomData[key]);
        }
      });
      if (roomData.newImages && roomData.newImages.length > 0) {
        roomData.newImages.forEach((image) => {
          formData.append('images', image);
        });
      }

      const newRoom = await createRoom(formData);
      setRooms((prev) => [...prev, newRoom]);
      setShowAddPopup(false);
      alert('Thêm phòng thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm phòng:', error);
      alert('Không thể thêm phòng. Vui lòng thử lại.');
    }
  };

  const handleEditRoom = async (index, updatedRoom) => {
    try {
      const roomId = rooms[index].id;
      const formData = new FormData();
      
      Object.keys(updatedRoom).forEach((key) => {
        if (key !== 'images' && key !== 'newImages' && key !== 'createdAt' && key !== 'updatedAt') {
          formData.append(key, updatedRoom[key]);
        }
      });
  
      // Chỉ append nếu có ảnh mới
      if (updatedRoom.newImages && updatedRoom.newImages.length > 0) {
        updatedRoom.newImages.forEach((image) => {
          formData.append('images', image);
        });
      }
      // Nếu không có ảnh mới => KHÔNG append 'images' gì hết
  
      const updatedRoomData = await updateRoom(roomId, formData);
      setRooms((prev) =>
        prev.map((room, i) => (i === index ? updatedRoomData : room))
      );
      setShowEditPopup(false);
      alert('Cập nhật phòng thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật phòng:', error);
      alert('Không thể cập nhật phòng: ' + (error.response?.data?.message || 'Lỗi không xác định. Vui lòng thử lại.'));
    }
  };
  
  const handleDeleteRoom = async (index) => {
    try {
      const roomId = rooms[index].id;
      await removeRoom(roomId);
      setRooms((prev) => prev.filter((_, i) => i !== index));
      alert('Xóa phòng thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa phòng:', error);
      alert('Không thể xóa phòng. Vui lòng thử lại.');
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const roomStatus = room.isEmpty ? 'Trống' : 'Đang thuê';
    const matchesStatus = statusFilter === 'Tất cả' || roomStatus === statusFilter;
    let matchesDateFrom = true;
    let matchesDateTo = true;
    if (dateFrom && room.depositDate) {
      const depositDate = new Date(room.depositDate);
      const fromDate = new Date(dateFrom);
      matchesDateFrom = !isNaN(depositDate) && !isNaN(fromDate) && depositDate >= fromDate;
    }
    if (dateTo && room.depositDate) {
      const depositDate = new Date(room.depositDate);
      const toDate = new Date(dateTo);
      matchesDateTo = !isNaN(depositDate) && !isNaN(toDate) && depositDate <= toDate;
    }
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">Quản lý phòng trọ</h1>
          <div className="flex space-x-3">
            <button
              className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'manual' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => {
                setActiveTab('manual');
                setShowAddPopup(true);
              }}
            >
              Thêm phòng trọ
            </button>
            <button
              className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                activeTab === 'excel' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveTab('excel')}
            >
              Thêm từ Excel
            </button>
          </div>
        </header>

        {(activeTab === 'manual' || activeTab === 'excel') && (
          <>
            <SummaryCards rooms={rooms} />
            {activeTab === 'excel' && <ExcelUpload onUpload={handleExcelUpload} />}
          </>
        )}

        <RoomFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

        <RoomTable
          rooms={filteredRooms}
          onEdit={(index) => {
            setEditRoom({ index, data: rooms[index] });
            setShowEditPopup(true);
          }}
          onDelete={handleDeleteRoom}
        />

        {showAddPopup && (
          <RoomFormPopup
            onClose={() => setShowAddPopup(false)}
            onSubmit={handleAddRoom}
          />
        )}

        {showEditPopup && editRoom && (
          <RoomFormPopup
            onClose={() => setShowEditPopup(false)}
            onSubmit={(data) => handleEditRoom(editRoom.index, data)}
            initialData={editRoom.data}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
};

export default RoomManagementPage;