import React, { useState, useCallback } from 'react';
import { FaEye } from 'react-icons/fa';
import '../../styles/service/RoomServiceCard.css';
import _ from 'lodash';

export default function RoomServiceCard({ room, services, onUpdateService }) {
  const [showDetails, setShowDetails] = useState(false);

  // Define hooks at the top, before any early returns
  const toggleServiceUsage = useCallback(
    _.debounce((serviceId, currentInUse, serviceName) => {
      if (!serviceId) {
        console.error(`Service ID is undefined for service ${serviceName}`);
        return;
      }

      console.log(`Toggling service ${serviceId} (${serviceName}) for room ${room.id}: ${currentInUse} -> ${!currentInUse}`);
      onUpdateService(room.id, serviceId, {
        inUse: !currentInUse,
        oldIndex: 0,
        newIndex: 0,
      });
    }, 300),
    [room?.id, onUpdateService] // Use optional chaining to handle undefined room
  );

  // Now handle the early return after all hooks are called
  if (!room || !room.id) {
    console.error('Invalid room prop:', room);
    return <div>Lỗi: Không tìm thấy thông tin phòng</div>;
  }

  console.log(`Room ${room.id} services in RoomServiceCard:`, room.services);

  const feeServices = services.filter((service) => service.type === 'FEE');
  console.log(`Fee services for room ${room.id}:`, feeServices);

  const displayedServices = showDetails
    ? feeServices
    : feeServices.filter((service) =>
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
            const isRegistered = !!roomService;
            const inUse = roomService ? roomService.inUse : false;
            const fee = inUse ? service.rate : 0;

            console.log(`Service ${service.name} (ID: ${service.id}) for room ${room.id}:`, {
              isRegistered,
              roomService,
              inUse,
            });

            return (
              <div key={service.id} className="service-item">
                <div className="service-header">
                  <span>
                    {service.name} ({service.rate.toLocaleString()} đ/1{service.unit})
                  </span>
                  {showDetails && (
                    <div className="service-controls">
                      {isRegistered ? (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={inUse}
                            onChange={() => toggleServiceUsage(service.id, inUse, service.name)}
                          />
                          <span className="slider"></span>
                        </label>
                      ) : (
                        <span className="unregistered-service">
                          (Chưa đăng ký)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="service-status">
                  {isRegistered
                    ? inUse
                      ? `Phí: ${fee.toLocaleString()} đ`
                      : 'Không sử dụng'
                    : 'Dịch vụ chưa được đăng ký cho phòng này'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}