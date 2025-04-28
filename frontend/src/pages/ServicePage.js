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
  addDefaultRoomService,
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

  const validRoomServiceTypes = ['FEE'];

  const validateServices = (servicesArray, context = '') => {
    const validServices = servicesArray.filter((service) => {
      if (!service.id || !service.name || !service.type) {
        console.warn(`Invalid service in ${context}:`, service);
        return false;
      }
      return true;
    });
    return validServices;
  };

  const fetchRoomServicesForAllRooms = async (mappedServices) => {
    const updatedRooms = await Promise.all(
      rooms.map(async (room) => {
        const roomServices = await getRoomServices(room.id);
        const servicesArray = normalizeRoomServices(roomServices);
        console.log(`Room ${room.id} servicesArray from getRoomServices:`, servicesArray);

        const mappedRoomServices = servicesArray
          .filter((rs) => mappedServices.some((s) => s.name === rs.service?.name))
          .map((rs) => {
            const service = mappedServices.find((s) => s.name === rs.service?.name);
            if (!service) {
              console.warn(`Service not found in mappedServices for room ${room.id}:`, rs);
              return null;
            }
            return {
              id: service.id,
              name: rs.service?.name,
              oldIndex: rs.oldIndex || 0,
              newIndex: rs.newIndex || 0,
              inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
            };
          })
          .filter((rs) => rs && rs.id && rs.name);

        // Calculate registration status for this room
        const registrationStatus = {};
        const feeServices = mappedServices.filter((service) => service.type === 'FEE');
        for (const service of feeServices) {
          const isRegistered = servicesArray.some((rs) => rs.service?.name === service.name);
          registrationStatus[service.name] = isRegistered;
        }
        console.log(`Registration status for room ${room.id}:`, registrationStatus);

        return {
          ...room,
          services: mappedRoomServices,
          registrationStatus, // Add registrationStatus to the room object
        };
      })
    );
    setRooms(updatedRooms);
    console.log('Updated rooms after fetchRoomServicesForAllRooms:', updatedRooms);
  };

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
            hasIndices: service.type === 'CONFIG',
          }));
        const validatedServices = validateServices(mappedServices, 'fetchData');
        setServices(validatedServices);
        console.log('Mapped services:', validatedServices);

        const roomResponse = await findAllRooms(1, 0);
        console.log('Room Response:', roomResponse);
        const apiRooms = roomResponse.rooms || [];

        await addDefaultRoomService();
        console.log('Applied default services to all rooms on initial load');

        const mappedRooms = await Promise.all(
          apiRooms.map(async (room) => {
            const roomServices = await getRoomServices(room.id);
            const servicesArray = normalizeRoomServices(roomServices);
            console.log(`Normalized Room Services for room ${room.id}:`, servicesArray);

            const mappedRoomServices = servicesArray
              .filter((rs) => validatedServices.some((s) => s.name === rs.service?.name))
              .map((rs) => {
                const service = validatedServices.find((s) => s.name === rs.service?.name);
                if (!service) {
                  console.warn(`Service not found in mappedServices for room ${room.id}:`, rs);
                  return null;
                }
                return {
                  id: service.id,
                  name: rs.service?.name,
                  oldIndex: rs.oldIndex || 0,
                  newIndex: rs.newIndex || 0,
                  inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
                };
              })
              .filter((rs) => rs && rs.id && rs.name);

            // Calculate registration status for this room
            const registrationStatus = {};
            const feeServices = validatedServices.filter((service) => service.type === 'FEE');
            for (const service of feeServices) {
              const isRegistered = servicesArray.some((rs) => rs.service?.name === service.name);
              registrationStatus[service.name] = isRegistered;
            }
            console.log(`Registration status for room ${room.id}:`, registrationStatus);

            return {
              id: room.id,
              name: room.roomNumber,
              price: room.price || 0,
              services: mappedRoomServices,
              registrationStatus, // Add registrationStatus to the room object
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
        type: 'FEE',
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
      const validatedServices = validateServices(mappedServices, 'addService');
      setServices(validatedServices);
      console.log('Updated services after addService:', validatedServices);

      await addDefaultRoomService();
      console.log('Applied default services to all rooms after adding a service');

      await fetchRoomServicesForAllRooms(validatedServices);
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
        type: 'FEE',
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
      const validatedServices = validateServices(mappedServices, 'updateService');
      setServices(validatedServices);
      console.log('Updated services after updateService:', validatedServices);

      await addDefaultRoomService();
      console.log('Applied default services to all rooms after updating a service');

      await fetchRoomServicesForAllRooms(validatedServices);
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
      const validatedServices = validateServices(mappedServices, 'deleteService');
      setServices(validatedServices);
      console.log('Updated services after deleteService:', validatedServices);

      await addDefaultRoomService();
      console.log('Applied default services to all rooms after deleting a service');

      await fetchRoomServicesForAllRooms(validatedServices);
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Không thể xóa dịch vụ: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const updateRoomServiceHandler = async (roomId, serviceId, updatedService) => {
    try {
      if (!roomId || !serviceId) {
        throw new Error('Room ID hoặc Service ID không hợp lệ');
      }

      const service = services.find((s) => s.id === serviceId);
      if (!service || !service.name) {
        throw new Error('Không tìm thấy dịch vụ với ID: ' + serviceId);
      }

      const roomServiceData = {
        oldIndex: updatedService.oldIndex || 0,
        newIndex: updatedService.newIndex || 0,
        isActive: updatedService.inUse,
        quantity: 1,
        customPrice: service.rate,
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
            name: rs.service?.name || null,
            oldIndex: rs.oldIndex || 0,
            newIndex: rs.newIndex || 0,
            inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
          };
        })
        .filter((rs) => rs && rs.id && rs.name);

      console.log(`Mapped room services for room ${roomId}:`, mappedRoomServices.map(rs => ({
        id: rs.id,
        serviceName: rs.name,
        inUse: rs.inUse,
        oldIndex: rs.oldIndex,
        newIndex: rs.newIndex
      })));

      // Recalculate registration status after update
      const registrationStatus = {};
      const feeServices = services.filter((service) => service.type === 'FEE');
      for (const service of feeServices) {
        const isRegistered = updatedServicesArray.some((rs) => rs.service?.name === service.name);
        registrationStatus[service.name] = isRegistered;
      }
      console.log(`Updated registration status for room ${roomId}:`, registrationStatus);

      setRooms((prev) =>
        prev.map((room) =>
          room.id === roomId
            ? { ...room, services: mappedRoomServices, registrationStatus }
            : room
        )
      );
      console.log('Updated rooms after updateRoomService:', rooms);
    } catch (err) {
      console.error('Error updating room service:', err);
    }
  };

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

  console.log('Services passed to RoomServiceCard:', services);

  return (
    <div className="service-page">
      <h2>Quản lý dịch vụ</h2>
      <div className="stats-grid">
        <StatsCard title="Số lượng dịch vụ" value={services.length} />
        <StatsCard
          title="Tổng tiền dịch vụ phí cố định"
          value={totalFixedFeeCost.toLocaleString() + ' đ'}
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
            registrationStatus={room.registrationStatus || {}} // Pass registrationStatus as a prop
            onUpdateService={updateRoomServiceHandler}
          />
        ))}
      </div>
    </div>
  );
}