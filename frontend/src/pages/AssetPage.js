import React, { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import AddAssetForm from '../components/asset/AssetForm';
import RoomAssetCard from '../components/asset/RoomAssetCard';
import '../styles/asset/AssetPage.css';
import {
  createAsset,
  getAllAssets,
  updateAsset,
  removeAsset,
  addRoomAsset,
  getRoomAssets,
  updateRoomAsset,
  removeRoomAsset,
  findAllRooms,
} from '../services/rentalService';

export default function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all assets
        const assetResponse = await getAllAssets();
        const apiAssets = Array.isArray(assetResponse) ? assetResponse : assetResponse.assets || [];
        setAssets(apiAssets.map(asset => ({
          id: asset.id,
          name: asset.name,
          value: parseFloat(asset.value) || 0,
          unit: asset.unit || 'Cái',
        })));

        // Fetch all rooms
        const roomResponse = await findAllRooms(0, 0);
        const apiRooms = roomResponse.rooms || [];

        // Fetch assets for each room
        const mappedRooms = await Promise.all(
          apiRooms.map(async (room) => {
            const roomAssetsResponse = await getRoomAssets(room.id);
            const roomAssets = Array.isArray(roomAssetsResponse) ? roomAssetsResponse : roomAssetsResponse.assets || [];
            return {
              id: room.id,
              name: room.roomNumber,
              price: room.price || 0,
              assets: roomAssets.map(asset => ({
                id: asset.id,
                inUse: asset.inUse !== undefined ? asset.inUse : true,
              })),
            };
          })
        );

        setRooms(mappedRooms);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addAsset = async (newAsset) => {
    try {
      // Create new asset
      const assetResponse = await createAsset({
        name: newAsset.name,
        value: newAsset.value.toString(),
        unit: newAsset.unit,
      });

      const newAssetId = assetResponse.id;
      const updatedAsset = { id: newAssetId, ...newAsset };

      // Update local assets state
      setAssets((prev) => [...prev, updatedAsset]);

      // Add asset to all rooms
      const roomAssetPromises = rooms.map(room =>
        addRoomAsset({
          roomId: room.id,
          assetId: newAssetId,
          inUse: true,
        })
      );
      await Promise.all(roomAssetPromises);

      // Update local rooms state
      setRooms((prev) =>
        prev.map((room) => ({
          ...room,
          assets: [...room.assets, { id: newAssetId, inUse: true }],
        }))
      );

      alert('Thêm tài sản thành công!');
    } catch (err) {
      console.error('Error adding asset:', err);
      alert('Không thể thêm tài sản: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };

  const updateAsset = async (assetId, updatedFields) => {
    try {
      await updateAsset(assetId, updatedFields);
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === assetId ? { ...asset, ...updatedFields } : asset
        )
      );
      alert('Cập nhật tài sản thành công!');
    } catch (err) {
      console.error('Error updating asset:', err);
      alert('Không thể cập nhật tài sản: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };

  const deleteAsset = async (assetId) => {
    try {
      // Remove asset from all rooms
      const roomAssetPromises = rooms.map(room =>
        removeRoomAsset({ roomId: room.id, assetId })
      );
      await Promise.all(roomAssetPromises);

      // Remove asset
      await removeAsset(assetId);

      // Update local state
      setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
      setRooms((prev) =>
        prev.map((room) => ({
          ...room,
          assets: room.assets.filter((a) => a.id !== assetId),
        }))
      );

      alert('Xóa tài sản thành công!');
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Không thể xóa tài sản: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };

  const updateRoomAsset = async (roomId, assetId, updatedAsset) => {
    try {
      await updateRoomAsset({ roomId, assetId, inUse: updatedAsset.inUse });
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
      alert('Cập nhật tài sản phòng thành công!');
    } catch (err) {
      console.error('Error updating room asset:', err);
      alert('Không thể cập nhật tài sản phòng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
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

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

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