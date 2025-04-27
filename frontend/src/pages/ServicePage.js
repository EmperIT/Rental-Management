import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import AddServiceForm from '../components/service/AddServiceForm';
import RoomServiceCard from '../components/service/RoomServiceCard';
import '../styles/service/ServicePage.css';
import {
  getAllServices,
  saveService,
  removeService,
  findAllRooms,
  getRoomServices,
  updateRoomService,
} from '../services/rentalService';

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeRoomServices = (roomServices) => {
    if (Array.isArray(roomServices)) {
      return roomServices;
    }
    if (roomServices && typeof roomServices === 'object' && Array.isArray(roomServices.services)) {
      return roomServices.services;
    }
    return [];
  };

  const validRoomServiceTypes = ['CONFIG', 'FEE'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const serviceResponse = await getAllServices();
        console.log('Service Response:', serviceResponse);
        const apiServices = serviceResponse.services || [];

        const mappedServices = apiServices
          .filter((service) => validRoomServiceTypes.includes(service.type))
          .map((service, index) => ({
            id: index + 1,
            name: service.name,
            rate: parseFloat(service.value),
            unit: service.unit,
            type: service.type,
            hasIndices: service.type === 'CONFIG', // Infer hasIndices based on type
          }));
        setServices(mappedServices);
        console.log('Mapped services:', mappedServices);

        const roomResponse = await findAllRooms(0, 0);
        console.log('Room Response:', roomResponse);
        const apiRooms = roomResponse.rooms || [];

        const mappedRooms = await Promise.all(
          apiRooms.map(async (room) => {
            const roomServices = await getRoomServices(room.id);
            const servicesArray = normalizeRoomServices(roomServices);
            console.log(`Normalized Room Services for room ${room.id}:`, servicesArray);

            const mappedRoomServices = servicesArray
              .filter((rs) => mappedServices.some((s) => s.name === rs.service?.name))
              .map((rs) => {
                const service = mappedServices.find((s) => s.name === rs.service?.name);
                return {
                  id: service ? service.id : null,
                  oldIndex: rs.oldIndex || 0,
                  newIndex: rs.newIndex || 0,
                  inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : true,
                };
              })
              .filter((rs) => rs.id);

            return {
              id: room.id,
              name: room.roomNumber,
              price: room.price || 0,
              services: mappedRoomServices,
            };
          })
        );

        setRooms(mappedRooms);
        console.log('Mapped rooms:', mappedRooms);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addService = async (newService) => {
    try {
      const serviceData = {
        name: newService.name,
        value: newService.rate.toString(),
        description: newService.description || '',
        type: newService.hasIndices ? 'CONFIG' : 'FEE',
        unit: newService.unit,
      };
      console.log('Saving new service:', serviceData);
      const saveResponse = await saveService(serviceData);
      console.log('Save service response:', saveResponse);

      const serviceResponse = await getAllServices();
      console.log('Updated service response:', serviceResponse);
      const apiServices = serviceResponse.services || [];
      const mappedServices = apiServices
        .filter((service) => validRoomServiceTypes.includes(service.type))
        .map((service, index) => ({
          id: index + 1,
          name: service.name,
          rate: parseFloat(service.value),
          unit: service.unit,
          type: service.type,
          hasIndices: service.type === 'CONFIG',
        }));
      setServices(mappedServices);
      console.log('Updated services after addService:', mappedServices);

      // Since the backend automatically associates services with rooms, fetch updated room services
      const updatedRooms = await Promise.all(
        rooms.map(async (room) => {
          const roomServices = await getRoomServices(room.id);
          const servicesArray = normalizeRoomServices(roomServices);
          const mappedRoomServices = servicesArray
            .filter((rs) => mappedServices.some((s) => s.name === rs.service?.name))
            .map((rs) => {
              const service = mappedServices.find((s) => s.name === rs.service?.name);
              return {
                id: service ? service.id : null,
                oldIndex: rs.oldIndex || 0,
                newIndex: rs.newIndex || 0,
                inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : true,
              };
            })
            .filter((rs) => rs.id);

          return {
            ...room,
            services: mappedRoomServices,
          };
        })
      );

      setRooms(updatedRooms);
      console.log('Updated rooms after addService:', updatedRooms);
    } catch (err) {
      console.error('Error adding service:', err);
      alert('Không thể thêm dịch vụ: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const updateService = async (serviceId, updatedFields) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      const serviceData = {
        name: service.name,
        value: updatedFields.rate.toString(),
        description: updatedFields.description || '',
        type: service.hasIndices ? 'CONFIG' : 'FEE',
        unit: updatedFields.unit || service.unit,
      };
      console.log('Updating service:', serviceData);
      const updateResponse = await saveService(serviceData);
      console.log('Update service response:', updateResponse);

      const serviceResponse = await getAllServices();
      const apiServices = serviceResponse.services || [];
      const mappedServices = apiServices
        .filter((service) => validRoomServiceTypes.includes(service.type))
        .map((service, index) => ({
          id: index + 1,
          name: service.name,
          rate: parseFloat(service.value),
          unit: service.unit,
          type: service.type,
          hasIndices: service.type === 'CONFIG',
        }));
      setServices(mappedServices);
      console.log('Updated services after updateService:', mappedServices);
    } catch (err) {
      console.error('Error updating service:', err);
      alert('Không thể cập nhật dịch vụ: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const deleteService = async (serviceId) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      await removeService(service.name);
      console.log(`Deleted service ${service.name}`);

      const serviceResponse = await getAllServices();
      const apiServices = serviceResponse.services || [];
      const mappedServices = apiServices
        .filter((service) => validRoomServiceTypes.includes(service.type))
        .map((service, index) => ({
          id: index + 1,
          name: service.name,
          rate: parseFloat(service.value),
          unit: service.unit,
          type: service.type,
          hasIndices: service.type === 'CONFIG',
        }));
      setServices(mappedServices);
      console.log('Updated services after deleteService:', mappedServices);

      // Since the backend automatically removes the service from rooms, fetch updated room services
      const updatedRooms = await Promise.all(
        rooms.map(async (room) => {
          const roomServices = await getRoomServices(room.id);
          const servicesArray = normalizeRoomServices(roomServices);
          const mappedRoomServices = servicesArray
            .filter((rs) => mappedServices.some((s) => s.name === rs.service?.name))
            .map((rs) => {
              const service = mappedServices.find((s) => s.name === rs.service?.name);
              return {
                id: service ? service.id : null,
                oldIndex: rs.oldIndex || 0,
                newIndex: rs.newIndex || 0,
                inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : true,
              };
            })
            .filter((rs) => rs.id);

          return {
            ...room,
            services: mappedRoomServices,
          };
        })
      );

      setRooms(updatedRooms);
      console.log('Updated rooms after deleteService:', updatedRooms);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Không thể xóa dịch vụ: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const updateRoomServiceHandler = async (roomId, serviceId, updatedService) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      const roomServiceData = {
        oldIndex: updatedService.oldIndex || 0,
        newIndex: updatedService.newIndex || 0,
        isActive: updatedService.inUse,
      };

      console.log(`Updating room service for room ${roomId}, service ${service.name}:`, roomServiceData);

      const updateResponse = await updateRoomService(roomId, service.name, roomServiceData);
      console.log(`Update room service response:`, updateResponse);

      const roomServices = await getRoomServices(roomId);
      const updatedServicesArray = normalizeRoomServices(roomServices);
      console.log(`Updated services for room ${roomId}:`, updatedServicesArray.map(rs => ({
        serviceName: rs.service?.name,
        isActive: rs.isActive,
        active: rs.active,
        oldIndex: rs.oldIndex,
        newIndex: rs.newIndex,
        fullObject: rs
      })));

      const mappedRoomServices = updatedServicesArray
        .filter((rs) => services.some((s) => s.name === rs.service?.name))
        .map((rs) => {
          const service = services.find((s) => s.name === rs.service?.name);
          return {
            id: service ? service.id : null,
            oldIndex: rs.oldIndex || 0,
            newIndex: rs.newIndex || 0,
            inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : true,
          };
        })
        .filter((rs) => rs.id);

      console.log(`Mapped room services for room ${roomId}:`, mappedRoomServices.map(rs => ({
        id: rs.id,
        serviceName: services.find(s => s.id === rs.id)?.name,
        inUse: rs.inUse,
        oldIndex: rs.oldIndex,
        newIndex: rs.newIndex
      })));

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId ? { ...room, services: mappedRoomServices } : room
        )
      );
      console.log('Updated rooms after updateRoomService:', rooms);
    } catch (err) {
      console.error('Error updating room service:', err);
      alert('Không thể cập nhật dịch vụ của phòng: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const totalElectricityCost = rooms.reduce((sum, room) => {
    const electricityService = room.services.find((s) => {
      const service = services.find((srv) => srv.id === s.id);
      return service?.name === 'ELECTRICITY_PRICE' && s.inUse;
    });
    if (electricityService) {
      const serviceData = services.find((s) => s.name === 'ELECTRICITY_PRICE');
      const usage = electricityService.newIndex - electricityService.oldIndex;
      return sum + (usage >= 0 ? usage * serviceData.rate : 0);
    }
    return sum;
  }, 0);

  const totalWaterCost = rooms.reduce((sum, room) => {
    const waterService = room.services.find((s) => {
      const service = services.find((srv) => srv.id === s.id);
      return service?.name === 'WATER_PRICE' && s.inUse;
    });
    if (waterService) {
      const serviceData = services.find((s) => s.name === 'WATER_PRICE');
      const usage = waterService.newIndex - waterService.oldIndex;
      return sum + (usage >= 0 ? usage * serviceData.rate : 0);
    }
    return sum;
  }, 0);

  const totalFixedFeeCost = rooms.reduce((sum, room) => {
    const fixedFeeServices = room.services.filter((s) => {
      const service = services.find((srv) => srv.id === s.id);
      return service?.type === 'FEE' && s.inUse;
    });
    return sum + fixedFeeServices.reduce((feeSum, s) => {
      const service = services.find((srv) => srv.id === s.id);
      return feeSum + (service ? service.rate : 0);
    }, 0);
  }, 0);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  // Filter services to pass only FEE types to AddServiceForm
  const feeServices = services.filter((service) => service.type === 'FEE');

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
        <StatsCard
          title="Tổng tiền dịch vụ phí cố định"
          value={totalFixedFeeCost.toLocaleString() + ' đ'}
        />
      </div>

      <AddServiceForm
        services={feeServices}
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
            onUpdateService={updateRoomServiceHandler}
          />
        ))}
      </div>
    </div>
  );
}