import React, { useState } from 'react';
import SummaryCards from '../components/RoomManagement/SummaryCards';
import RoomFilter from '../components/RoomManagement/RoomFilter';
import RoomTable from '../components/RoomManagement/RoomTable';
import RoomFormPopup from '../components/RoomManagement/RoomFormPopup';
import ExcelUpload from '../components/RoomManagement/ExcelUpload';
import '../styles/roomanagement/roomanagement.css';

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

  const handleExcelUpload = (newRooms) => {
    setRooms((prev) => [...prev, ...newRooms]);
  };

  const handleAddRoom = (roomData) => {
    setRooms((prev) => [...prev, roomData]);
    setShowAddPopup(false);
  };

  const handleEditRoom = (index, updatedRoom) => {
    setRooms((prev) =>
      prev.map((room, i) => (i === index ? updatedRoom : room))
    );
    setShowEditPopup(false);
  };

  const handleDeleteRoom = (index) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tất cả' || room.status === statusFilter;
    let matchesDateFrom = true;
    let matchesDateTo = true;
    if (dateFrom && room.availableDate) {
      const availableDate = new Date(room.availableDate);
      const fromDate = new Date(dateFrom);
      matchesDateFrom = !isNaN(availableDate) && !isNaN(fromDate) && availableDate >= fromDate;
    }
    if (dateTo && room.availableDate) {
      const availableDate = new Date(room.availableDate);
      const toDate = new Date(dateTo);
      matchesDateTo = !isNaN(availableDate) && !isNaN(toDate) && availableDate <= toDate;
    }
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý phòng trọ</h1>
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