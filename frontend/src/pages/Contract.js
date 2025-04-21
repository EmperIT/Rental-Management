import React, { useState } from 'react';
import SummaryCard from '../components/contract/SummaryCard';
import HeaderContract from '../components/contract/HeaderContract';
import SearchBox from '../components/SearchBox';
import ContractTable from '../components/contract/ContractTable';
import "../styles/contract/Contract.css";
import FilterContract from '../components/contract/FilterContract';

const Contract = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const contracts = [
    {
      id: "CT001",
      room: "Phòng P01",
      assignedTo: "Ihdizein",
      status: "Active",
      duration: "1 năm",
      start: "2022-09-17",
      end: "2023-09-17",
      amount: "6,300 USD"
    },
    {
      id: "CT002",
      room: "Phòng P02",
      assignedTo: "Mufti Hidayat",
      status: "Near Expire",
      duration: "2 năm",
      start: "2024-11-13",
      end: "2025-11-13",
      amount: "4,900 USD"
    },
  ]

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.room.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'All' || contract.status === statusFilter;
  
    const contractStartDate = new Date(contract.start);
    const contractEndDate = new Date(contract.end);
  
    let matchesDate = true;
    if (startDate && endDate) {
      matchesDate = (contractEndDate >= startDate) && (contractStartDate <= endDate);
    } else if (startDate) {
      matchesDate = contractEndDate >= startDate;
    } else if (endDate) {
      matchesDate = contractStartDate <= endDate;
    }
  
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  return (
    <div>
      <HeaderContract />
      <div className='summary-card-wrapper'>
        <SummaryCard title="Tổng số hợp đồng" value={contracts.length} change="+ 42" />
        <SummaryCard title="Hợp đồng hoạt động" value={contracts.filter(contract => contract.status === "Hoạt động").length} change="+ 42" />
        <SummaryCard title="Sắp hết hạn" value={contracts.filter(contract => contract.status === "Sắp hết hạn").length} change="- 6" />
      </div>
      <div className='filter-wrapper'>
        <SearchBox placeholder="Tìm kiếm theo phòng" onChange={(e) => setSearchText(e.target.value)} />
        <FilterContract
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>
      <ContractTable contracts={filteredContracts} />
    </div>
  );
};

export default Contract;
