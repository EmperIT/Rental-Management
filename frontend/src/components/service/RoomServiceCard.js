import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import '../../styles/service/RoomServiceCard.css';

export default function RoomServiceCard({ room, services, onUpdateService }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleServiceUsage = (serviceId, inUse) => {
    let roomService = room.services.find((s) => s.id === serviceId);
    if (!roomService) {
      roomService = { id: serviceId, oldIndex: 0, newIndex: 0, inUse: false };
      onUpdateService(room.id, serviceId, roomService);
    }
    onUpdateService(room.id, serviceId, { inUse });
  };

  const updateIndex = (serviceId, field, value) => {
    onUpdateService(room.id, serviceId, { [field]: Number(value) });
  };

  const displayedServices = showDetails
    ? services
    : services.filter((service) =>
        room.services.some((s) => s.id === service.id && s.inUse)
      );

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
            const roomService = room.services.find((s) => s.id === service.id) || {
              id: service.id,
              oldIndex: 0,
              newIndex: 0,
              inUse: false,
            };
            const usage = roomService.inUse
              ? roomService.newIndex - roomService.oldIndex
              : 0;
            const fee = roomService.inUse
              ? service.hasIndices
                ? usage >= 0
                  ? usage * service.rate
                  : 0
                : service.rate
              : 0;

            return (
              <div key={service.id} className="service-item">
                <div className="service-header">
                  <span>
                    {service.name} ({service.rate.toLocaleString()} đ/1{service.unit})
                  </span>
                  {showDetails && (
                    <div className="service-controls">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={roomService.inUse}
                          onChange={() => toggleServiceUsage(service.id, !roomService.inUse)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  )}
                </div>
                {roomService.inUse && service.hasIndices && showDetails && (
                  <div className="service-indices">
                    <div>
                      <label>Số cũ:</label>
                      <input
                        type="number"
                        value={roomService.oldIndex}
                        onChange={(e) => updateIndex(service.id, 'oldIndex', e.target.value)}
                      />
                    </div>
                    <div>
                      <label>Số mới:</label>
                      <input
                        type="number"
                        value={roomService.newIndex}
                        onChange={(e) => updateIndex(service.id, 'newIndex', e.target.value)}
                      />
                    </div>
                  </div>
                )}
                <div className="service-status">
                  {roomService.inUse
                    ? service.hasIndices
                      ? `Số: [${roomService.oldIndex} - ${roomService.newIndex}] - ${fee.toLocaleString()} đ`
                      : `1 ${service.unit} - ${fee.toLocaleString()} đ`
                    : 'Không sử dụng'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}