import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/contract/SummaryCard';
import HeaderContract from '../components/contract/HeaderContract';
import SearchBox from '../components/SearchBox';
import ContractTable from '../components/contract/ContractTable';
import ContractDetailModal from '../components/contract/ContractDetailModal';
import FilterContract from '../components/contract/FilterContract';
import { getContracts,  getContractById } from '../services/contractService';
import '../styles/contract/Contract.css';

const Contract = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractContent, setSelectedContractContent] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách hợp đồng từ API
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await getContracts(0, 10, '', '', statusFilter === 'All' ? '' : statusFilter);
        const apiContracts = response.contracts || [];

        // Ánh xạ dữ liệu từ API sang định dạng giao diện
        const mappedContracts = apiContracts.map((contract) => ({
          id: contract.contractId,
          room: `Phòng ${contract.roomId}`, // Giả định roomId là mã phòng
          status: contract.isActive
            ? new Date(contract.endDate) < new Date() && new Date(contract.endDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ? 'Near Expire'
              : 'Active'
            : 'Expired',
          duration: calculateDuration(contract.startDate, contract.endDate),
          start: contract.startDate,
          end: contract.endDate,
          amount: `${contract.rentAmount.toLocaleString('en-US')} VND`,
          deposit: contract.deposit,
        }));

        setContracts(mappedContracts);
      } catch (err) {
        setError('Không thể tải danh sách hợp đồng: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [statusFilter]);

  // Hàm tính thời gian hợp đồng (duration)
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth() + years * 12;
    return months >= 12 ? `${Math.floor(months / 12)} năm` : `${months} tháng`;
  };

  // Lọc hợp đồng theo tìm kiếm và ngày
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

  // Xem chi tiết hợp đồng
  const handleViewDetails = async (contract) => {
    try {
      // Gọi API để lấy chi tiết hợp đồng
      const detailedContract = await getContractById(contract.id);

      // Dùng nội dung từ API (content) để hiển thị
      const content = detailedContract.content;

      // Chuyển đổi plain text thành HTML
      const htmlContent = content
        .replace(/\n/g, '<br>')
        .replace(/(CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM|HỢP ĐỒNG THUÊ PHÒNG TRỌ|Điều \d+:.*)/g, '<strong>$1</strong>')
        .replace(/------\*\*\*------/, '<hr>');

      setSelectedContractContent({ id: contract.id, html: htmlContent });
      setIsModalOpen(true);
    } catch (err) {
      alert('Không thể tải chi tiết hợp đồng: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const handleExport = (contractId) => {
    alert(`Chức năng export cho hợp đồng ${contractId} sẽ được thực hiện khi có API.`);
  };

  const handleSendEmail = (contract) => {
    alert(`Chức năng gửi email cho hợp đồng ${contract.id} sẽ được thực hiện khi có API.`);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <HeaderContract />
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
          contractContent={selectedContractContent}
          onClose={() => setIsModalOpen(false)}
          onExport={() => handleExport(selectedContractContent.id)}
        />
      )}
    </div>
  );
};

export default Contract;