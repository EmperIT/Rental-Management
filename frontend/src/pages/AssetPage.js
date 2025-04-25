import React, { useState } from 'react';
import StatsCard from '../components/StatsCard';
import AddAssetForm from '../components/asset/AssetForm';
import RoomAssetCard from '../components/asset/RoomAssetCard';
import '../styles/asset/AssetPage.css';

const initialAssets = [
  { id: 1, name: 'Bàn', value: 500000, unit: 'Cái' },
  { id: 2, name: 'Ghế', value: 200000, unit: 'Cái' },
];

const initialRooms = [
  {
    id: 1,
    name: 'Phòng 101',
    price: 3000000,
    assets: [
      { id: 1, inUse: true },
      { id: 2, inUse: true },
    ],
  },
  {
    id: 2,
    name: 'Phòng 102',
    price: 3500000,
    assets: [
      { id: 1, inUse: true },
      { id: 2, inUse: false },
    ],
  },
];

export default function AssetPage() {
  const [assets, setAssets] = useState(initialAssets);
  const [rooms, setRooms] = useState(initialRooms);

  const addAsset = (newAsset) => {
    const newAssetId = assets.length + 1;
    const updatedAsset = { id: newAssetId, ...newAsset };

    setAssets((prev) => [...prev, updatedAsset]);

    setRooms((prev) =>
      prev.map((room) => ({
        ...room,
        assets: [...room.assets, { id: newAssetId, inUse: true }],
      }))
    );
  };

  const updateAsset = (assetId, updatedFields) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId ? { ...asset, ...updatedFields } : asset
      )
    );
  };

  const deleteAsset = (assetId) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
    setRooms((prev) =>
      prev.map((room) => ({
        ...room,
        assets: room.assets.filter((a) => a.id !== assetId),
      }))
    );
  };

  const updateRoomAsset = (roomId, assetId, updatedAsset) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              assets: room.assets.map((a) =>
                a.id === assetId ? { ...a, ...updatedAsset } : a
              ),
            }
          : room
      )
    );
  };

  const totalAssetCount = assets.length;

  const totalAssetValue = rooms.reduce((sum, room) => {
    return (
      sum +
      room.assets.reduce((roomSum, asset) => {
        if (asset.inUse) {
          const assetData = assets.find((a) => a.id === asset.id);
          return roomSum + (assetData ? assetData.value : 0);
        }
        return roomSum;
      }, 0)
    );
  }, 0);

  return (
    <div className="asset-page">
      <h2>Quản lý tài sản</h2>
      <div className="stats-grid">
        <StatsCard title="Số lượng tài sản" value={totalAssetCount} />
        <StatsCard
          title="Tổng giá trị tài sản"
          value={totalAssetValue.toLocaleString() + ' đ'}
        />
      </div>

      <AddAssetForm
        assets={assets}
        onAddAsset={addAsset}
        onUpdateAsset={updateAsset}
        onDeleteAsset={deleteAsset}
      />

      <div className="rooms-grid">
        {rooms.map((room) => (
          <RoomAssetCard
            key={room.id}
            room={room}
            assets={assets}
            onUpdateAsset={updateRoomAsset}
          />
        ))}
      </div>
    </div>
  );
}