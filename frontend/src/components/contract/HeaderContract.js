import React, { useState } from 'react';
import "../../styles/contract/HeaderContract.css";
import CreateContractModal from "./CreateContractModal";
function Header() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="header-contract">
        <h1 className="dashboard-title">Quản lý hợp đồng</h1>
        <button className="btn btn-primary" onClick={() => setOpenModal(true)}>
          Thêm hợp đồng
        </button>
      </div>
      <CreateContractModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}

export default Header;