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
  addRoomService,
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
              inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
            };
          })
          .filter((rs) => rs && rs.id && rs.name);

        const registrationStatus = {};
        for (const service of mappedServices) {
          const isRegistered = servicesArray.some((rs) => rs.service?.name === service.name);
          registrationStatus[service.name] = isRegistered;
        }
        console.log(`Registration status for room ${room.id}:`, registrationStatus);

        return {
          ...room,
          services: mappedRoomServices,
          registrationStatus,
        };
      })
    );
    setRooms(updatedRooms);
    console.log('Updated rooms after fetchRoomServicesForAllRooms:', updatedRooms);
  };

  const registerServicesForRoom = async (roomId, serviceName) => {
    try {
      console.log(`Registering service ${serviceName} for room ${roomId}`);
      const service = services.find((s) => s.name === serviceName);
      if (!service) {
        throw new Error(`Service ${serviceName} not found in services list`);
      }
      const roomServiceData = {
        roomId,
        serviceName,
        quantity: 1,
        customPrice: service.rate,
        isActive: false,
      };
      const response = await addRoomService(roomServiceData);
      console.log(`Register services response for room ${roomId}:`, response);

      const roomServices = await getRoomServices(roomId);
      const servicesArray = normalizeRoomServices(roomServices);
      const mappedServices = services;
      const mappedRoomServices = servicesArray
        .filter((rs) => mappedServices.some((s) => s.name === rs.service?.name))
        .map((rs) => {
          const service = mappedServices.find((s) => s.name === rs.service?.name);
          if (!service) {
            console.warn(`Service not found in mappedServices for room ${roomId}:`, rs);
            return null;
          }
          return {
            id: service.id,
            name: rs.service?.name,
            inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
          };
        })
        .filter((rs) => rs && rs.id && rs.name);

      const registrationStatus = {};
      for (const service of mappedServices) {
        const isRegistered = servicesArray.some((rs) => rs.service?.name === service.name);
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
      console.log(`Successfully registered service ${serviceName} for room ${roomId}`);
      return true;
    } catch (err) {
      console.error(`Error registering service ${serviceName} for room ${roomId}:`, err.response?.data || err);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const serviceResponse = await getAllServices();
        console.log('Service Response:', serviceResponse);
        const apiServices = serviceResponse.services || [];

        const mappedServices = apiServices.map((service, index) => ({
          id: index + 1,
          name: service.name,
          rate: parseFloat(service.value) || 0,
          unit: service.unit || '',
          type: service.type,
          hasIndices: service.type === 'CONFIG',
        }));
        const validatedServices = validateServices(mappedServices, 'fetchData');
        setServices(validatedServices);
        console.log('Mapped services:', validatedServices);

        const roomResponse = await findAllRooms(1, 0);
        console.log('Room Response:', roomResponse);
        const apiRooms = roomResponse.rooms || [];

        try {
          await addDefaultRoomService();
          console.log('Applied default services to all rooms on initial load');
        } catch (err) {
          console.warn('Error applying default services on initial load:', err.response?.data || err);
        }

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
                  inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
                };
              })
              .filter((rs) => rs && rs.id && rs.name);

            const registrationStatus = {};
            for (const service of validatedServices) {
              const isRegistered = servicesArray.some((rs) => rs.service?.name === service.name);
              registrationStatus[service.name] = isRegistered;
            }
            console.log(`Registration status for room ${room.id}:`, registrationStatus);

            return {
              id: room.id,
              name: room.roomNumber,
              price: room.price || 0,
              services: mappedRoomServices,
              registrationStatus,
            };
          })
        );

        setRooms(mappedRooms);
        console.log('Mapped rooms:', mappedRooms);
      } catch (err) {
        console.error('Error fetching data:', err.response?.data || err);
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
        type: newService.type || 'FEE',
        unit: newService.unit,
      };
      console.log('Saving new service:', serviceData);
      const saveResponse = await saveService(serviceData);
      console.log('Save service response:', saveResponse);

      const serviceResponse = await getAllServices();
      console.log('Updated service response:', serviceResponse);
      const apiServices = serviceResponse.services || [];
      const mappedServices = apiServices.map((service, index) => ({
        id: index + 1,
        name: service.name,
        rate: parseFloat(service.value) || 0,
        unit: service.unit || '',
        type: service.type,
        hasIndices: service.type === 'CONFIG',
      }));
      const validatedServices = validateServices(mappedServices, 'addService');
      setServices(validatedServices);
      console.log('Updated services after addService:', validatedServices);

      try {
        await addDefaultRoomService();
        console.log('Applied default services to all rooms after adding a service');
      } catch (err) {
        console.warn('Error applying default services after adding a service:', err.response?.data || err);
      }

      await fetchRoomServicesForAllRooms(validatedServices);
    } catch (err) {
      console.error('Error adding service:', err.response?.data || err);
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
        type: updatedFields.type || service.type,
        unit: updatedFields.unit || service.unit,
      };
      console.log('Updating service:', serviceData);
      const updateResponse = await saveService(serviceData);
      console.log('Update service response:', updateResponse);

      const serviceResponse = await getAllServices();
      const apiServices = serviceResponse.services || [];
      const mappedServices = apiServices.map((service, index) => ({
        id: index + 1,
        name: service.name,
        rate: parseFloat(service.value) || 0,
        unit: service.unit || '',
        type: service.type,
        hasIndices: service.type === 'CONFIG',
      }));
      const validatedServices = validateServices(mappedServices, 'updateService');
      setServices(validatedServices);
      console.log('Updated services after updateService:', validatedServices);

      try {
        await addDefaultRoomService();
        console.log('Applied default services to all rooms after updating a service');
      } catch (err) {
        console.warn('Error applying default services after updating a service:', err.response?.data || err);
      }

      await fetchRoomServicesForAllRooms(validatedServices);
    } catch (err) {
      console.error('Error updating service:', err.response?.data || err);
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
      const mappedServices = apiServices.map((service, index) => ({
        id: index + 1,
        name: service.name,
        rate: parseFloat(service.value) || 0,
        unit: service.unit || '',
        type: service.type,
        hasIndices: service.type === 'CONFIG',
      }));
      const validatedServices = validateServices(mappedServices, 'deleteService');
      setServices(validatedServices);
      console.log('Updated services after deleteService:', validatedServices);

      try {
        await addDefaultRoomService();
        console.log('Applied default services to all rooms after deleting a service');
      } catch (err) {
        console.warn('Error applying default services after deleting a service:', err.response?.data || err);
      }

      await fetchRoomServicesForAllRooms(validatedServices);
    } catch (err) {
      console.error('Error deleting service:', err.response?.data || err);
      alert('Không thể xóa dịch vụ: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const updateRoomServiceHandler = async (roomId, serviceId, updatedService) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service || !service.name) {
      alert('Không thể cập nhật dịch vụ phòng: Không tìm thấy dịch vụ với ID ' + serviceId);
      return;
    }

    try {
      if (!roomId || !serviceId) {
        throw new Error('Room ID hoặc Service ID không hợp lệ');
      }
      if (isNaN(service.rate) || service.rate <= 0) {
        throw new Error('Giá dịch vụ không hợp lệ: ' + service.rate);
      }

      const roomServiceData = {
        roomId,
        serviceName: service.name,
        quantity: 1,
        customPrice: service.rate,
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
        fullObject: rs
      })));

      const mappedRoomServices = updatedServicesArray
        .filter((rs) => services.some((s) => s.name === rs.service?.name))
        .map((rs) => {
          const service = services.find((s) => s.name === rs.service?.name);
          return {
            id: service ? service.id : null,
            name: rs.service?.name || null,
            inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
          };
        })
        .filter((rs) => rs && rs.id && rs.name);

      const registrationStatus = {};
      for (const service of services) {
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
      console.error('Error updating room service:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        roomId,
        serviceId,
        updatedService,
        serviceName: service.name,
        roomServiceData: {
          roomId,
          serviceName: service.name,
          quantity: 1,
          customPrice: service.rate,
          isActive: updatedService.inUse,
        },
      });
      if (err.response?.status === 400 && err.response?.data?.message.includes('Phòng chưa đăng ký dịch vụ này')) {
        console.warn(`Service ${service.name} not registered for room ${roomId}, attempting to re-register`);
        const registered = await registerServicesForRoom(roomId, service.name);
        if (registered && updatedService.inUse) {
          const roomServiceData = {
            roomId,
            serviceName: service.name,
            quantity: 1,
            customPrice: service.rate,
            isActive: true,
          };
          console.log(`Auto-retrying update for room ${roomId}, service ${service.name}:`, roomServiceData);
          try {
            const retryResponse = await updateRoomService(roomId, service.name, roomServiceData);
            console.log(`Auto-retry update response:`, retryResponse);

            const roomServices = await getRoomServices(roomId);
            const updatedServicesArray = normalizeRoomServices(roomServices);
            console.log(`Post-registration services for room ${roomId}:`, updatedServicesArray.map(rs => ({
              serviceName: rs.service?.name,
              isActive: rs.isActive,
              active: rs.active,
              fullObject: rs
            })));

            const mappedRoomServices = updatedServicesArray
              .filter((rs) => services.some((s) => s.name === rs.service?.name))
              .map((rs) => {
                const service = services.find((s) => s.name === rs.service?.name);
                return {
                  id: service ? service.id : null,
                  name: rs.service?.name || null,
                  inUse: rs.isActive !== undefined ? rs.isActive : rs.active !== undefined ? rs.active : false,
                };
              })
              .filter((rs) => rs && rs.id && rs.name);

            const registrationStatus = {};
            for (const service of services) {
              const isRegistered = updatedServicesArray.some((rs) => rs.service?.name === service.name);
              registrationStatus[service.name] = isRegistered;
            }
            console.log(`Post-registration status for room ${roomId}:`, registrationStatus);

            setRooms((prev) =>
              prev.map((room) =>
                room.id === roomId
                  ? { ...room, services: mappedRoomServices, registrationStatus }
                  : room
              )
            );
          } catch (retryErr) {
            console.error(`Retry failed for room ${roomId}, service ${service.name}:`, retryErr.response?.data || retryErr);
            alert('Không thể cập nhật dịch vụ sau khi đăng ký: ' + (retryErr.response?.data?.message || 'Lỗi không xác định.'));
          }
        } else if (!registered) {
          alert('Không thể đăng ký dịch vụ: Lỗi đăng ký.');
        }
      } else {
        alert('Không thể cập nhật dịch vụ phòng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
      }
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
            registrationStatus={room.registrationStatus || {}}
            onUpdateService={updateRoomServiceHandler}
          />
        ))}
      </div>
    </div>
  );
}