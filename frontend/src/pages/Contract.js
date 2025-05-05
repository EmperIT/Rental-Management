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

  const [rooms, setRooms] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [roomServicesMap, setRoomServicesMap] = useState({});
  const [roomAssetsMap, setRoomAssetsMap] = useState({});
  const [tenantsMap, setTenantsMap] = useState({});

  const fetchContracts = async () => {
    try {
      setLoading(true);
      let isActive = undefined;
      if (statusFilter === 'Active' || statusFilter === 'Near Expire') {
        isActive = true;
      } else if (statusFilter === 'Expired') {
        isActive = false;
      }
      const response = await getContracts(1, 10, searchText, '', isActive);
      const apiContracts = response.contracts || [];
      console.log('getContracts response:', response);
      setContracts(apiContracts);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError('Không thể tải danh sách hợp đồng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await findAllRooms(0, 0);
        const fetchedRooms = roomsResponse.rooms || [];
        console.log('findAllRooms response:', roomsResponse);
        setRooms(fetchedRooms.map(room => ({
          id: room.id,
          roomName: room.roomNumber || `Phòng ${room.id}`,
          deposit: room.depositPrice ? parseFloat(room.depositPrice) : null,
          price: room.price ? parseFloat(room.price) : null,
        })));

        const servicesResponse = await getAllServices();
        const fetchedServices = servicesResponse.services || [];
        setAllServices(fetchedServices.map(s => ({
          id: s.id,
          name: s.name,
          price: s.value ? parseFloat(s.value) : 'N/A',
          unit: s.unit || '',
        })));

        const assetsResponse = await getAllAssets();
        const fetchedAssets = Array.isArray(assetsResponse) ? assetsResponse : assetsResponse.assets || [];
        setAllAssets(fetchedAssets.map(asset => ({
          id: asset.id,
          name: asset.name,
          value: parseFloat(asset.value) || 0,
          unit: asset.unit || 'Cái',
        })));

        const servicesMap = {};
        const assetsMap = {};
        const tenantsMap = {};
        for (const room of fetchedRooms) {
          try {
            const serviceResponse = await getRoomServices(room.id);
            const fetchedRoomServices = Array.isArray(serviceResponse) ? serviceResponse : serviceResponse.services || [];
            servicesMap[room.id] = fetchedRoomServices.map(s => ({
              id: s.id,
              name: s.service?.name || 'Dịch vụ không xác định',
              price: s.customPrice || parseFloat(s.service?.value) || 0,
              unit: s.service?.unit || '',
            }));

            const assetResponse = await getRoomAssets(room.id);
            const fetchedRoomAssets = Array.isArray(assetResponse) ? assetResponse : assetResponse.assets || [];
            assetsMap[room.id] = fetchedRoomAssets.map(a => ({
              id: a.id,
              name: a.name,
              value: parseFloat(a.value) || 0,
              unit: a.unit || 'Cái',
            }));

            const tenantResponse = await findAllTenantsByFilter(room.id, undefined, 0, 0);
            tenantsMap[room.id] = tenantResponse.tenants || [];
          } catch (err) {
            console.error(`Error fetching data for room ${room.id}:`, err);
            servicesMap[room.id] = [];
            assetsMap[room.id] = [];
            tenantsMap[room.id] = [];
          }
        }
        setRoomServicesMap(servicesMap);
        setRoomAssetsMap(assetsMap);
        setTenantsMap(tenantsMap);

        await fetchContracts();
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Không thể tải dữ liệu: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
      }
    };

    fetchData();
  }, [statusFilter, searchText]);

  const filteredContracts = contracts.filter((contract) => {
    const room = rooms.find(r => r.id === contract.roomId);
    const roomName = room ? room.roomName : '';
    const tenant = tenantsMap[contract.roomId]?.[0];
    const tenantName = tenant ? tenant.name : '';

    const matchesSearch = roomName.toLowerCase().includes(searchText.toLowerCase()) ||
                         tenantName.toLowerCase().includes(searchText.toLowerCase());

    const contractEndDate = new Date(contract.endDate);
    const contractStartDate = new Date(contract.startDate);
    const now = new Date();
    const nearExpireThreshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    let status;
    if (contractEndDate < now) {
      status = 'Expired';
    } else if (contractEndDate <= nearExpireThreshold && contractStartDate <= now) {
      status = 'Near Expire';
    } else if (contractStartDate <= now && contractEndDate > now) {
      status = 'Active';
    } else {
      status = 'Unknown';
    }
    const matchesStatus = statusFilter === 'All' || statusFilter === status;

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
      if (!contract.contractId) {
        throw new Error('ID hợp đồng không hợp lệ');
      }
      console.log('Fetching details for contract:', contract);
      const response = await getContractById(contract.contractId);
      console.log('getContractById response:', response);
      
      // Handle different response structures
      const detailedContract = response.contract || response.data?.contract || response;
      if (!detailedContract || !detailedContract.contractId) {
        throw new Error('Hợp đồng không tồn tại hoặc dữ liệu không hợp lệ');
      }

      const content = detailedContract.content || '';
      const htmlContent = content
        ? content
            .replace(/\n/g, '<br>')
            .replace(/(CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM|HỢP ĐỒNG THUÊ PHÒNG TRỌ|Điều \d+:.*)/g, '<strong>$1</strong>')
            .replace(/------\*\*\*------/, '<hr>')
        : 'Nội dung hợp đồng trống';

      const room = rooms.find(r => r.id === contract.roomId);
      const deposit = room && room.deposit ? room.deposit : 0;
      // Use rentAmount from contract, fall back to room.price
      const rentAmount = detailedContract.rentAmount ?? (room?.price ?? null);

      setSelectedContract({
        id: detailedContract.contractId,
        html: htmlContent,
        contract: {
          room: room ? room.roomName : 'N/A',
          start: detailedContract.startDate,
          end: detailedContract.endDate,
          amount: rentAmount ? `${parseFloat(rentAmount).toLocaleString('vi-VN')} VNĐ` : 'N/A',
          deposit: deposit,
        },
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error in handleViewDetails:', {
        message: err.message,
        response: err.response,
        contractId: contract.contractId,
        detailedContract: err.response?.data || null,
      });
      setError('Không thể tải chi tiết hợp đồng: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };

  const handleExport = (contractId) => {
    alert(`Chức năng export cho hợp đồng ${contractId} sẽ được thực hiện khi có API.`);
  };

  const handleSendEmail = (contract) => {
    alert(`Chức năng gửi email cho hợp đồng ${contract.contractId} sẽ được thực hiện khi có API.`);
  };

  const handleContractCreated = () => {
    fetchContracts();
  };

  const fetchTenantsForRoom = async (roomId, email = '') => {
    try {
      const tenantResponse = await findAllTenantsByFilter(roomId, undefined, 0, 0, email);
      return tenantResponse.tenants || [];
    } catch (err) {
      console.error(`Error fetching tenants for room ${roomId}:`, err);
      return [];
    }
  };

  const handleCreateTenant = async (tenantData) => {
    try {
      const response = await createTenant(tenantData);
      const tenantId = response.tenant?.id;
      if (!tenantId) {
        throw new Error('Không thể tạo người thuê.');
      }
      return tenantId;
    } catch (err) {
      throw err;
    }
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
        <SummaryCard title="Hợp đồng hoạt động" value={contracts.filter(c => {
          const now = new Date();
          return new Date(c.startDate) <= now && new Date(c.endDate) > now;
        }).length} change="+ 0" />
        <SummaryCard title="Sắp hết hạn" value={contracts.filter(c => {
          const end = new Date(c.endDate);
          const now = new Date();
          const threshold = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return end <= threshold && end > now && new Date(c.startDate) <= now;
        }).length} change="+ 0" />
      </div>
      <div className="filter-wrapper">
        <SearchBox placeholder="Tìm kiếm theo phòng hoặc khách thuê" onChange={(e) => setSearchText(e.target.value)} />
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
        rooms={rooms}
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