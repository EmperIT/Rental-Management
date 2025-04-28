import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/contract/SummaryCard';
import HeaderContract from '../components/contract/HeaderContract';
import SearchBox from '../components/SearchBox';
import ContractTable from '../components/contract/ContractTable';
import ContractDetailModal from '../components/contract/ContractDetailModal';
import FilterContract from '../components/contract/FilterContract';
import {
  getContracts,
  getContractById,
  createContract,
} from '../services/contractService';
import {
  findAllRooms,
  getAllServices,
  getAllAssets,
  getRoomServices,
  getRoomAssets,
  createTenant,
  findAllTenantsByFilter,
} from '../services/rentalService';
import '../styles/contract/Contract.css';

const Contract = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for fetched data to pass as props
  const [rooms, setRooms] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [roomServicesMap, setRoomServicesMap] = useState({});
  const [roomAssetsMap, setRoomAssetsMap] = useState({});

  // Fetch contracts
  const fetchContracts = async () => {
    try {
      setLoading(true);
      let isActive = '';
      if (statusFilter === 'Active' || statusFilter === 'Near Expire') {
        isActive = true;
      } else if (statusFilter === 'Expired') {
        isActive = false;
      }
      const response = await getContracts(1, 0, '', '', isActive);
      const apiContracts = response.contracts || [];

      console.log('getContracts response:', response);

      const mappedContracts = apiContracts.map((contract) => {
        const contractEndDate = new Date(contract.endDate);
        const now = new Date();
        const nearExpireThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const rentAmount = contract.rentAmount ?? 0;

        return {
          id: contract.contractId,
          room: `Phòng ${contract.roomId}`,
          status: contract.isActive
            ? contractEndDate < now
              ? 'Expired'
              : contractEndDate <= now && contractEndDate >= nearExpireThreshold
              ? 'Near Expire'
              : 'Active'
            : 'Expired',
          duration: calculateDuration(contract.startDate, contract.endDate),
          start: contract.startDate,
          end: contract.endDate,
          amount: `${rentAmount.toLocaleString('en-US')} VND`,
          deposit: contract.deposit ?? 0,
          rawContract: contract,
        };
      });

      setContracts(mappedContracts);
    } catch (err) {
      setError('Không thể tải danh sách hợp đồng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new tenant
  const handleCreateTenant = async (tenantData) => {
    try {
      const response = await createTenant(tenantData);
      const tenantId = response.tenant?.id;
      if (!tenantId) {
        throw new Error('Không thể tạo người thuê.');
      }
      console.log('Created tenant:', response);
      return tenantId;
    } catch (err) {
      throw new Error('Không thể tạo người thuê: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };
  const fetchTenantsForRoom = async (roomId) => {
      try {
        const tenantResponse = await findAllTenantsByFilter( roomId, undefined, 0, 0 );
        const fetchedTenants = tenantResponse.tenants || [];
        console.log(`Fetched tenants for room ${roomId}:`, fetchedTenants);
        return fetchedTenants;
      } catch (err) {
        console.error(`Error fetching tenants for room ${roomId}:`, err);
        return [];
      }
    };
  // Fetch rooms, services, assets, room-specific data, and tenants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsResponse = await findAllRooms(0, 0);
        const fetchedRooms = roomsResponse.rooms || [];
        setRooms(fetchedRooms);
        console.log('Fetched rooms in Contract:', fetchedRooms);

        // Fetch services
        const servicesResponse = await getAllServices();
        const fetchedServices = servicesResponse.services || [];
        setAllServices(fetchedServices);
        console.log('Fetched all services in Contract:', fetchedServices);

        // Fetch assets
        const assetsResponse = await getAllAssets();
        const fetchedAssets = assetsResponse.assets || [];
        setAllAssets(fetchedAssets.map((asset) => asset.name));
        console.log('Fetched all assets in Contract:', fetchedAssets);

        // Fetch room-specific services, assets, and tenants for all rooms
        const servicesMap = {};
        const assetsMap = {};
        for (const room of fetchedRooms) {
          try {
            // Fetch room services
            const serviceResponse = await getRoomServices(room.id);
            const fetchedRoomServices = serviceResponse.roomServices || [];
            servicesMap[room.id] = fetchedRoomServices;
            console.log(`Fetched services for room ${room.id}:`, fetchedRoomServices);

            // Fetch room assets
            const assetResponse = await getRoomAssets(room.id);
            const fetchedRoomAssets = assetResponse.roomAssets || [];
            const assetNames = fetchedRoomAssets.map((asset) => asset.name);
            assetsMap[room.id] = assetNames;
            console.log(`Fetched assets for room ${room.id}:`, assetNames);

            // Fetch tenants for the room
           } catch (err) {
            console.error(`Error fetching data for room ${room.id}:`, err);
            servicesMap[room.id] = [];
            assetsMap[room.id] = [];
          }
        }
        setRoomServicesMap(servicesMap);
        setRoomAssetsMap(assetsMap);

        // Fetch contracts
        await fetchContracts();
      } catch (err) {
        setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
      }
    };

    fetchData();
  }, [statusFilter]);

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth() + years * 12;
    return months >= 12 ? `${Math.floor(months / 12)} năm` : `${months} tháng`;
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.room.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'All' || contract.status === statusFilter;

    const contractStartDate = new Date(contract.start);
    const contractEndDate = new Date(contract.end);

    let matchesDate = true;
    if (startDate && endDate) {
      matchesDate = contractEndDate >= startDate && contractStartDate <= endDate;
    } else if (startDate) {
      matchesDate = contractEndDate >= startDate;
    } else if (endDate) {
      matchesDate = contractStartDate <= endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = async (contract) => {
    try {
      const response = await getContractById(contract.id);
      const detailedContract = response.contract;

      if (!detailedContract) {
        throw new Error('Hợp đồng không tồn tại');
      }

      console.log('getContractById response:', response);

      const content = detailedContract.content || '';

      const htmlContent = content
        .replace(/\n/g, '<br>')
        .replace(/(CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM|HỢP ĐỒNG THUÊ PHÒNG TRỌ|Điều \d+:.*)/g, '<strong>$1</strong>')
        .replace(/------\*\*\*------/, '<hr>');

      setSelectedContract({
        id: contract.id,
        html: htmlContent,
        contract: {
          room: contract.room,
          start: detailedContract.startDate,
          end: detailedContract.endDate,
          amount: `${(detailedContract.rentAmount ?? 0).toLocaleString('en-US')} VND`,
          deposit: detailedContract.deposit ?? 0,
        },
      });
      setIsModalOpen(true);
    } catch (err) {
      alert('Không thể tải chi tiết hợp đồng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };

  const handleExport = (contractId) => {
    alert(`Chức năng export cho hợp đồng ${contractId} sẽ được thực hiện khi có API.`);
  };

  const handleSendEmail = (contract) => {
    alert(`Chức năng gửi email cho hợp đồng ${contract.id} sẽ được thực hiện khi có API.`);
  };

  const handleContractCreated = () => {
    fetchContracts();
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <HeaderContract
        onContractCreated={handleContractCreated}
        createContract={createContract}
        rooms={rooms}
        allServices={allServices}
        allAssets={allAssets}
        roomServicesMap={roomServicesMap}
        roomAssetsMap={roomAssetsMap}
        fetchTenantsForRoom={fetchTenantsForRoom}
        createTenant={handleCreateTenant}
      />
      <div className="summary-card-wrapper">
        <SummaryCard title="Tổng số hợp đồng" value={contracts.length} change="+ 0" />
        <SummaryCard title="Hợp đồng hoạt động" value={contracts.filter((contract) => contract.status === 'Active').length} change="+ 0" />
        <SummaryCard title="Sắp hết hạn" value={contracts.filter((contract) => contract.status === 'Near Expire').length} change="+ 0" />
      </div>
      <div className="filter-wrapper">
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
      <ContractTable
        contracts={filteredContracts}
        onViewDetails={handleViewDetails}
        onSendEmail={handleSendEmail}
      />
      {isModalOpen && (
        <ContractDetailModal
          contractContent={selectedContract}
          onClose={() => setIsModalOpen(false)}
          onExport={() => handleExport(selectedContract.id)}
        />
      )}
    </div>
  );
};

export default Contract;