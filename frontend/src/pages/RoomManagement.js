import React, { useState, useEffect } from 'react';
import SummaryCards from '../components/RoomManagement/SummaryCards';
import RoomFilter from '../components/RoomManagement/RoomFilter';
import RoomTable from '../components/RoomManagement/RoomTable';
import RoomFormPopup from '../components/RoomManagement/RoomFormPopup';
import ExcelUpload from '../components/RoomManagement/ExcelUpload';
import '../styles/roomanagement/roomanagement.css';
import { findAllRooms, createRoom, updateRoom, removeRoom, findAllTenantsByFilter } from '../services/rentalService';

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
        const fetchedRooms = response.rooms || [];
        const updatedRooms = await Promise.all(
          fetchedRooms.map(async (room) => {
            const startDate = room.depositDate ? await getStartDate(room.id) : null;
            const { isEmpty, status } = computeStatus(room.depositDate, startDate);
            if(isEmpty != room.isEmpty){
              const updateFormData = new FormData();
              updateFormData.append('isEmpty', isEmpty);
              await updateRoom(room.id, updateFormData);
              room.isEmpty = isEmpty;
            }
            console.log(`Room ${room.roomNumber}: status=${status}`)
            return{...room, status};
          })
        );
        setRooms(updatedRooms);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phòng:', error);
        alert('Không thể lấy danh sách phòng. Vui lòng thử lại.');
      }
    };
    fetchRooms();
  }, []);

  const handleExcelUpload = async (newRooms) => {
    try {
      const updatedNewRooms = await Promise.all(
        newRooms.map(async (room) => {
          const startDate = room.depositDate ? await getStartDate(room.id) : null;
          const { isEmpty, status } = computeStatus(room.depositDate, await startDate);
          if(isEmpty != room.isEmpty){
            const updateFormData = new FormData();
            updateFormData.append('isEmpty', isEmpty);
            await updateRoom(room.id, updateFormData);
            room.isEmpty = isEmpty;
          }
          return {...room, status};
        })
      )
      setRooms((prev) => [...prev, ...updatedNewRooms]);
    } catch (error) {
      console.error('Lỗi khi upload file Excel:', error);
      alert('Không thể upload file Excel. Vui lòng thử lại.');
    }
  };

  const handleAddRoom = async (roomData) => {
    try {
      const formData = new FormData();
      formData.append('isEmpty', true);

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
      const startDate = newRoom.depositDate ? await getStartDate(newRoom.id) : null;
      const { isEmpty, status } = computeStatus(newRoom.depositDate, startDate);
      if (isEmpty !== newRoom.isEmpty) {
        const updateFormData = new FormData();
        updateFormData.append('isEmpty', isEmpty);
        await updateRoom(newRoom.id, updateFormData);
        newRoom.isEmpty = isEmpty;
      }
      newRoom.status = status;
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
      const startDate = updatedRoom.depositDate ? await getStartDate(roomId) : null;
      const { isEmpty, status } = computeStatus(updatedRoom.depositDate, startDate);
      if (isEmpty !== updatedRoomData.isEmpty) {
        const updateFormData = new FormData();
        updateFormData.append('isEmpty', isEmpty);
        await updateRoom(roomId, updateFormData);
        updatedRoomData.isEmpty = isEmpty;
      }
      updatedRoomData.status = status;
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
    const roomStatus = room.status || (room.isEmpty ? 'Trống' : 'Đang thuê');
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

  const computeStatus = (depositDate, startDate) => {
    const currentDate = new Date();
    if(!depositDate){
      return { isEmpty: true, status: 'Trống' };
    }

    const deposit = new Date(depositDate);
    if(isNaN(deposit)){
      return { isEmpty: true, status: 'Trống' };
    }

    if(!startDate){
      return { isEmpty: true, status: 'Đã cọc' };
    }

    const start = new Date(startDate);
    if(isNaN(start)){
      return { isEmpty: true, status: 'Đã cọc' };
    }
    if(start <= currentDate){
      return { isEmpty: false, status: 'Đang thuê' };
    }
    else{
      return { isEmpty: true, status: 'Đã cọc' };
    }
  }

  const getStartDate = async(roomId) => {
    try{
      const res = await findAllTenantsByFilter(roomId, true, 0, 0);
      if(res && res.tenants && res.tenants.length > 0){
        return res.tenants[0].startDate;
      }
      else{
        return null;
      }
    } catch(error){
      console.error('Lỗi khi lấy ngày bắt đầu:', error);
      return null;
    }
  }
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