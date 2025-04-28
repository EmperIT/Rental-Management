import React, { useState } from 'react';
import "../../styles/contract/HeaderContract.css";
import CreateContractModal from "./CreateContractModal";

function HeaderContract({
  onContractCreated,
  createContract,
  rooms,
  allServices,
  allAssets,
  roomServicesMap,
  roomAssetsMap,
  fetchTenantsForRoom,
  createTenant,
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="header-contract">
        <h1 className="dashboard-title">Quản lý hợp đồng</h1>
        <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
          Thêm hợp đồng
        </button>
      </div>
      <CreateContractModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onContractCreated={onContractCreated}
        createContract={createContract}
        rooms={rooms}
        allServices={allServices}
        allAssets={allAssets}
        roomServicesMap={roomServicesMap}
        roomAssetsMap={roomAssetsMap}
        fetchTenantsForRoom={fetchTenantsForRoom}
        createTenant={createTenant}
      />
    </>
  );
}

export default HeaderContract;