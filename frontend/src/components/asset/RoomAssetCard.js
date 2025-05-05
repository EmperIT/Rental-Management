import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import '../../styles/asset/RoomAssetCard.css';

export default function RoomAssetCard({ room, assets, onUpdateAsset, loading, error }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleAssetUsage = (assetId, inUse) => {
    const roomAsset = (room.assets || []).find((a) => a.id === assetId) || {
      id: assetId,
      inUse: false,
    };
    onUpdateAsset(room.id, assetId, { inUse });
  };

  const displayedAssets = showDetails
    ? assets.filter((asset) => (room.assets || []).some((a) => a.id === asset.id))
    : assets.filter((asset) =>
        (room.assets || []).some((a) => a.id === asset.id && a.inUse)
      );

  if (loading) return <div className="room-asset-card loading">Đang tải...</div>;
  if (error) return <div className="room-asset-card error">{error}</div>;

  return (
    <div className="room-asset-card">
      <div className="room-asset-header">
        <h3>{room.name}</h3>
        <p>Giá phòng: {room.price.toLocaleString()} đ/tháng</p>
      </div>
      <div className="room-assets">
        <div className="assets-header">
          <h4>Tài sản:</h4>
          <button
            className="btn-details"
            onClick={() => setShowDetails(!showDetails)}
            aria-label={showDetails ? 'Ẩn chi tiết tài sản' : 'Xem chi tiết tài sản'}
          >
            <FaEye /> {showDetails ? 'Ẩn chi tiết' : 'Chi tiết'}
          </button>
        </div>
        {displayedAssets.length === 0 && !showDetails ? (
          <p className="no-assets">Không có tài sản đang sử dụng</p>
        ) : (
          displayedAssets.map((asset) => {
            const roomAsset = (room.assets || []).find((a) => a.id === asset.id) || {
              id: asset.id,
              inUse: false,
            };
            const value = roomAsset.inUse ? asset.value : 0;

            return (
              <div key={asset.id} className="asset-item">
                <div className="asset-header">
                  <span>
                    {asset.name} ({asset.value.toLocaleString()} đ/1{asset.unit})
                  </span>
                  {showDetails && (
                    <div className="asset-controls">
                      <label className="switch" aria-label={`Bật/tắt ${asset.name}`}>
                        <input
                          type="checkbox"
                          checked={roomAsset.inUse}
                          onChange={() => toggleAssetUsage(asset.id, !roomAsset.inUse)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  )}
                </div>
                <div className="asset-status">
                  {roomAsset.inUse
                    ? `1 ${asset.unit} - ${value.toLocaleString()} đ`
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