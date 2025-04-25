import React, { useState } from 'react';
import StatsCard from '../components/StatsCard';
import AddServiceForm from '../components/service/AddServiceForm';
import RoomServiceCard from '../components/service/RoomServiceCard';
import '../styles/service/ServicePage.css';

const initialServices = [
    { id: 1, name: 'Điện', rate: 1700, unit: 'kWh', hasIndices: true },
    { id: 2, name: 'Nước', rate: 18000, unit: 'm³', hasIndices: true },
  ];
  
  const initialRooms = [
    {
      id: 1,
      name: 'Phòng 101',
      price: 3000000,
      services: [
        { id: 1, oldIndex: 50, newIndex: 68, inUse: true },
        { id: 2, oldIndex: 20, newIndex: 28, inUse: true },
      ],
    },
    {
      id: 2,
      name: 'Phòng 102',
      price: 3500000,
      services: [
        { id: 1, oldIndex: 40, newIndex: 60, inUse: true },
        { id: 2, oldIndex: 15, newIndex: 20, inUse: true },
      ],
    },
  ];
  
  export default function ServicePage() {
    const [services, setServices] = useState(initialServices);
    const [rooms, setRooms] = useState(initialRooms);
  
    const addService = (newService) => {
      const newServiceId = services.length + 1;
      const updatedService = { id: newServiceId, ...newService };
  
      setServices((prev) => [...prev, updatedService]);
  
      setRooms((prev) =>
        prev.map((room) => ({
          ...room,
          services: [
            ...room.services,
            { id: newServiceId, oldIndex: 0, newIndex: 0, inUse: true },
          ],
        }))
      );
    };
  
    const updateService = (serviceId, updatedFields) => {
      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId ? { ...service, ...updatedFields } : service
        )
      );
    };
  
    const deleteService = (serviceId) => {
      setServices((prev) => prev.filter((service) => service.id !== serviceId));
      setRooms((prev) =>
        prev.map((room) => ({
          ...room,
          services: room.services.filter((s) => s.id !== serviceId),
        }))
      );
    };
  
    const updateRoomService = (roomId, serviceId, updatedService) => {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? {
                ...room,
                services: room.services.map((s) =>
                  s.id === serviceId ? { ...s, ...updatedService } : s
                ),
              }
            : room
        )
      );
    };
  
    const totalElectricityCost = rooms.reduce((sum, room) => {
      const electricityService = room.services.find((s) => s.id === 1 && s.inUse);
      if (electricityService) {
        const serviceData = services.find((s) => s.id === 1);
        const usage = electricityService.newIndex - electricityService.oldIndex;
        return sum + (usage >= 0 ? usage * serviceData.rate : 0);
      }
      return sum;
    }, 0);
  
    const totalWaterCost = rooms.reduce((sum, room) => {
      const waterService = room.services.find((s) => s.id === 2 && s.inUse);
      if (waterService) {
        const serviceData = services.find((s) => s.id === 2);
        const usage = waterService.newIndex - waterService.oldIndex;
        return sum + (usage >= 0 ? usage * serviceData.rate : 0);
      }
      return sum;
    }, 0);
  
    return (
      <div className="service-page">
        <h2>Quản lý dịch vụ</h2>
        <div className="stats-grid">
          <StatsCard title="Số lượng dịch vụ" value={services.length} />
          <StatsCard
            title="Tổng tiền dịch vụ điện"
            value={totalElectricityCost.toLocaleString() + ' đ'}
          />
          <StatsCard
            title="Tổng tiền dịch vụ nước"
            value={totalWaterCost.toLocaleString() + ' đ'}
          />
        </div>
  
        <AddServiceForm
          services={services}
          onAddService={addService}
          onUpdateService={updateService}
          onDeleteService={deleteService}
        />
  
        <div className="rooms-grid">
          {rooms.map((room) => (
            <RoomServiceCard
              key={room.id}
              room={room}
              services={services}
              onUpdateService={updateRoomService}
            />
          ))}
        </div>
      </div>
    );
  }