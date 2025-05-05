import React, { useState, useCallback } from 'react';
import { FaEye } from 'react-icons/fa';
import '../../styles/service/RoomServiceCard.css';
import _ from 'lodash';

export default function RoomServiceCard({ room, services, registrationStatus, onUpdateService }) {
  const [showDetails, setShowDetails] = useState(false);
  const [toggling, setToggling] = useState(false);

  const toggleServiceUsage = useCallback(
    _.debounce((serviceId, currentInUse, serviceName) => {
      if (!serviceId) {
        console.error(`Service ID is undefined for service ${serviceName}`);
        return;
      }
      if (toggling) {
        console.warn(`Toggle in progress for service ${serviceName}, ignoring`);
        return;
      }

      console.log(`Attempting to toggle service ${serviceId} (${serviceName}) for room ${room.id}: ${currentInUse} -> ${!currentInUse}`);
      setToggling(true);
      onUpdateService(room.id, serviceId, {
        inUse: !currentInUse,
      }).finally(() => {
        console.log(`Toggle completed for service ${serviceName}`);
        setToggling(false);
      });
    }, 300),
    [room?.id, onUpdateService, toggling]
  );

  if (!room || !room.id) {
    console.error('Invalid room prop:', room);
    return <div>Lỗi: Không tìm thấy thông tin phòng</div>;
  }

  console.log(`Room ${room.id} services in RoomServiceCard:`, room.services);
  console.log(`All services for room ${room.id}:`, services);

  const displayedServices = showDetails
    ? services
    : services.filter((service) =>
        room.services.some((s) => s.name === service.name && s.inUse)
      );

  console.log(`Displayed services for room ${room.id}:`, displayedServices);

  return (
    <div className="room-service-card">
      <div className="room-service-header">
        <h3>{room.name}</h3>
        <p>Giá phòng: {room.price.toLocaleString()} đ/tháng</p>
      </div>
      <div className="room-services">
        <div className="services-header">
          <h4>Dịch vụ:</h4>
          <button
            className="btn-details"
            onClick={() => setShowDetails(!showDetails)}
          >
            <FaEye /> {showDetails ? 'Ẩn chi tiết' : 'Chi tiết'}
          </button>
        </div>
        {displayedServices.length === 0 && !showDetails ? (
          <p className="no-services">Không có dịch vụ đang sử dụng</p>
        ) : (
          displayedServices.map((service) => {
            if (!service.id) {
              console.warn(`Skipping service with undefined ID for room ${room.id}:`, service);
              return null;
            }

            const roomService = room.services.find((s) => s.name === service.name);
            const isRegistered = registrationStatus[service.name] || false;
            const inUse = roomService ? roomService.inUse : false;
            const fee = inUse ? service.rate : 0;

            console.log(`Service ${service.name} (ID: ${service.id}, Type: ${service.type}) for room ${room.id}:`, {
              isRegistered,
              roomService,
              inUse,
              hasIndices: service.hasIndices,
            });

            return (
              <div key={service.id} className={`service-item ${isRegistered ? '' : 'unregistered'}`}>
                <div className="service-header">
                  <span>
                    {service.name} ({service.rate.toLocaleString()} đ/1{service.unit}, {service.type})
                    {service.hasIndices && ' (Có chỉ số)'}
                  </span>
                  {showDetails && (
                    <div className="service-controls">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={inUse}
                          disabled={!isRegistered || toggling}
                          onChange={() => isRegistered && toggleServiceUsage(service.id, inUse, service.name)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  )}
                </div>
                <div className="service-status">
                  {inUse ? `Phí: ${fee.toLocaleString()} đ` : 'Không sử dụng'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}