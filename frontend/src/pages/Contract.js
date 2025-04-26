import React, { useState } from 'react';
import SummaryCard from '../components/contract/SummaryCard';
import HeaderContract from '../components/contract/HeaderContract';
import SearchBox from '../components/SearchBox';
import ContractTable from '../components/contract/ContractTable';
import ContractDetailModal from '../components/contract/ContractDetailModal';
import "../styles/contract/Contract.css";
import FilterContract from '../components/contract/FilterContract';
import contractTemplate from '../utils/contract_template';

const Contract = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContractContent, setSelectedContractContent] = useState(null);

  const contracts = [
    {
      id: "CT001",
      room: "Phòng P01",
      assignedTo: "Ihdizein",
      status: "Active",
      duration: "1 năm",
      start: "2022-09-17",
      end: "2023-09-17",
      amount: "6,300 USD",
      partyA: {
        name: "Nguyễn Văn A",
        birthYear: "1980",
        idNumber: "123456789",
        idIssueDate: "2010-05-15",
        idIssuePlace: "Hà Nội",
        address: "123 Đường Láng, Hà Nội",
        phone: "0987654321",
        permanentAddress: "123 Đường Láng, Hà Nội"
      },
      partyB: {
        name: "Trần Thị B",
        birthYear: "1990",
        idNumber: "987654321",
        idIssueDate: "2015-08-20",
        idIssuePlace: "Hà Nội",
        address: "456 Đường Giải Phóng, Hà Nội",
        phone: "0901234567",
        permanentAddress: "456 Đường Giải Phóng, Hà Nội"
      },
      paymentDate: "5",
      electricityRecipient: "Bên A",
      electricityPaymentDate: "5",
      electricityPrice: "3000 đ/kWh",
      waterRecipient: "Bên A",
      waterPaymentDate: "5",
      waterPrice: "20000 đ/m³",
      otherFees: "Không có",
      deposit: 6300,
      depositInWords: "Sáu nghìn ba trăm USD",
      pages: 2,
      email: "recipient@example.com"
    },
    {
      id: "CT002",
      room: "Phòng P02",
      assignedTo: "Mufti Hidayat",
      status: "Near Expire",
      duration: "2 năm",
      start: "2024-11-13",
      end: "2025-11-13",
      amount: "4,900 USD",
      partyA: {
        name: "Lê Văn C",
        birthYear: "1975",
        idNumber: "456789123",
        idIssueDate: "2008-03-10",
        idIssuePlace: "TP.HCM",
        address: "123 Đường Lê Lợi, TP.HCM",
        phone: "0912345678",
        permanentAddress: "123 Đường Lê Lợi, TP.HCM"
      },
      partyB: {
        name: "Phạm Thị D",
        birthYear: "1990",
        idNumber: "321654987",
        idIssueDate: "2012-07-25",
        idIssuePlace: "TP.HCM",
        address: "456 Đường Trần Hưng Đạo, TP.HCM",
        phone: "0934567890",
        permanentAddress: "456 Đường Trần Hưng Đạo, TP.HCM"
      },
      paymentDate: "5",
      electricityRecipient: "Bên A",
      electricityPaymentDate: "5",
      electricityPrice: "3000 đ/kWh",
      waterRecipient: "Bên A",
      waterPaymentDate: "5",
      waterPrice: "20000 đ/m³",
      otherFees: "Không có",
      deposit: 4900,
      depositInWords: "Bốn nghìn chín trăm USD",
      pages: 2,
      email: "recipient2@example.com"
    },
  ];

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

  const handleViewDetails = (contract) => {
    // Chuẩn bị dữ liệu hợp đồng để thay thế placeholder
    const flatData = {
      id: contract.id,
      start_date: contract.start,
      end_date: contract.end,
      status: contract.status,
      address: `${contract.room}, Hà Nội`,
      duration: contract.duration.replace(' năm', ''),
      price: contract.amount.replace(' USD', '').replace(',', ''),
      price_in_words: contract.depositInWords,
      name_a: contract.partyA.name,
      birth_year_a: contract.partyA.birthYear,
      id_number_a: contract.partyA.idNumber,
      id_issue_date_a: contract.partyA.idIssueDate,
      id_issue_place_a: contract.partyA.idIssuePlace,
      address_a: contract.partyA.address,
      phone_a: contract.partyA.phone,
      permanent_address_a: contract.partyA.permanentAddress,
      name_b: contract.partyB.name,
      birth_year_b: contract.partyB.birthYear,
      id_number_b: contract.partyB.idNumber,
      id_issue_date_b: contract.partyB.idIssueDate,
      id_issue_place_b: contract.partyB.idIssuePlace,
      address_b: contract.partyB.address,
      phone_b: contract.partyB.phone,
      permanent_address_b: contract.partyB.permanentAddress,
      payment_date: contract.paymentDate,
      electricity_recipient: contract.electricityRecipient,
      electricity_payment_date: contract.electricityPaymentDate,
      electricity_price: contract.electricityPrice,
      water_recipient: contract.waterRecipient,
      water_payment_date: contract.waterPaymentDate,
      water_price: contract.waterPrice,
      other_fees: contract.otherFees,
      deposit: contract.deposit,
      deposit_in_words: contract.depositInWords,
      pages: contract.pages,
    };

    // Thay thế placeholder trong template
    let content = contractTemplate;
    for (const [key, value] of Object.entries(flatData)) {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), value);
    }

    // Thay thế {{current_date}}
    const currentDate = new Date();
    const formattedDate = `ngày ${currentDate.getDate().toString().padStart(2, '0')} tháng ${(currentDate.getMonth() + 1).toString().padStart(2, '0')} năm ${currentDate.getFullYear()}`;
    content = content.replace('{{current_date}}', formattedDate);

    // Chuyển đổi plain text thành HTML để hiển thị tốt hơn
    const htmlContent = content
      .replace(/\n/g, '<br>')
      .replace(/(CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM|HỢP ĐỒNG THUÊ PHÒNG TRỌ|BÊN A : BÊN CHO THUÊ|BÊN B : BÊN THUÊ|Điều \d+:.*)/g, '<strong>$1</strong>')
      .replace(/------\*\*\*------/, '<hr>');

    setSelectedContractContent({ id: contract.id, html: htmlContent });
    setIsModalOpen(true);
  };

  const handleExport = (contractId) => {
    // Placeholder cho API export (khi có API thật, bạn sẽ gọi API ở đây)
    alert(`Chức năng export cho hợp đồng ${contractId} sẽ được thực hiện khi có API.`);
  };

  const handleSendEmail = (contract) => {
    // Placeholder cho API gửi email (khi có API thật, bạn sẽ gọi API ở đây)
    alert(`Chức năng gửi email cho hợp đồng ${contract.id} sẽ được thực hiện khi có API.`);
  };

  return (
    <div>
      <HeaderContract />
      <div className='summary-card-wrapper'>
        <SummaryCard title="Tổng số hợp đồng" value={contracts.length} change="+ 42" />
        <SummaryCard title="Hợp đồng hoạt động" value={contracts.filter(contract => contract.status === "Active").length} change="+ 42" />
        <SummaryCard title="Sắp hết hạn" value={contracts.filter(contract => contract.status === "Near Expire").length} change="- 6" />
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