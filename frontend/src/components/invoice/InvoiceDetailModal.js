import React, { useRef, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import '../../styles/invoice/InvoiceDetailModal.css';
import { robotoRegularBase64 } from '../../utils/roboto';
import { robotoBoldBase64 } from '../../utils/robotoBold';

// Thông tin ngân hàng của bạn
const BANK_INFO = {
  bin: "970422",
  accountNo: "0334053171",
  accountName: "Nguyen Minh Truong",
  template: "compact2",
};

const InvoiceDetailModal = ({ invoice, room, onClose }) => {
  const pdfRef = useRef(null);
  const [qrImage, setQrImage] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING'); // Thêm trạng thái thanh toán

  // Tạo URL Quick Link của VietQR
  const generateQrUrl = () => {
    const amount = invoice.total.toString();
    const description = `Thanh toan hoa don ${invoice.id}`;
    const encodedDescription = encodeURIComponent(description);
    const encodedAccountName = encodeURIComponent(BANK_INFO.accountName);
    return `https://img.vietqr.io/image/${BANK_INFO.bin}-${BANK_INFO.accountNo}-${BANK_INFO.template}.png?amount=${amount}&addInfo=${encodedDescription}&accountName=${encodedAccountName}`;
  };

  // Tải hình ảnh mã QR
  useEffect(() => {
    const qrUrl = generateQrUrl();
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = qrUrl;
    img.onload = () => {
      setQrImage(img);
    };
    img.onerror = () => {
      console.error('Lỗi khi tải hình ảnh mã QR từ VietQR');
    };
  }, [invoice]);

  // Hiển thị thông báo khi trạng thái thay đổi
  useEffect(() => {
    if (paymentStatus === 'PAID') {
      alert('Thanh toán thành công (kiểm tra thủ công trên webhook.site)!');
    }
  }, [paymentStatus]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Roboto fonts
    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegularBase64.split(',')[1]);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFileToVFS("Roboto-Bold.ttf", robotoBoldBase64.split(',')[1]);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    // Layout settings
    const leftMargin = 15;
    let y = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header: Invoice Title
    doc.setFont("Roboto", "bold");
    doc.setFontSize(18);
    const title = `HÓA ĐƠN ${invoice.id}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, y); // Center title
    y += 5;
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, pageWidth - leftMargin, y); // Underline
    y += 10;

    // Room Information
    doc.setFont("Roboto", "normal");
    doc.setFontSize(12);
    doc.text(`Phòng: ${room.name}`, leftMargin, y);
    y += 7;
    doc.text(`Chủ phòng: ${room.owner}`, leftMargin, y);
    y += 7;
    doc.text(`Số điện thoại: ${room.phone}`, leftMargin, y);
    y += 10;

    // Invoice Information
    doc.setFont("Roboto", "bold");
    doc.text(`Lý do: ${invoice.reason}`, leftMargin, y);
    y += 7;
    doc.setFont("Roboto", "normal");
    doc.text(`Ngày bắt đầu sử dụng: ${invoice.startDate}`, leftMargin, y);
    y += 7;
    doc.text(`Ngày kết thúc: ${invoice.endDate}`, leftMargin, y);
    y += 7;
    doc.text(`Hạn đóng: ${invoice.dueDate}`, leftMargin, y);
    y += 10;

    // Financial Details Table
    doc.setFont("Roboto", "bold");
    doc.setFontSize(12);
    doc.text("Chi tiết thanh toán:", leftMargin, y);
    y += 7;

    // Table settings
    const col1Width = 80;
    const col2Width = 60;
    const col3Width = 35;
    const tableX = leftMargin;
    const rowHeight = 8;
    const tableWidth = col1Width + col2Width + col3Width;

    // Table Header
    doc.setFillColor(220, 220, 220);
    doc.rect(tableX, y, tableWidth, rowHeight, 'F');
    doc.setFont("Roboto", "bold");
    doc.text("Mục", tableX + 2, y + 6);
    doc.text("Tính toán", tableX + col1Width + 2, y + 6);
    doc.text("Số tiền", tableX + col1Width + col2Width + 2, y + 6);
    y += rowHeight;

    // Table Rows
    doc.setFont("Roboto", "normal");

    // Rent Row
    doc.rect(tableX, y, tableWidth, rowHeight);
    doc.text(`Tiền thuê (${invoice.daysUsed} ngày)`, tableX + 2, y + 6);
    doc.text(`${room.price.toLocaleString()} đ / ${invoice.daysInMonth} ngày x ${invoice.daysUsed}`, tableX + col1Width + 2, y + 6);
    doc.setFillColor(255, 255, 200);
    doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
    doc.text(`${invoice.rentCharge.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
    y += rowHeight;

    // Service Rows
    invoice.services.forEach((service) => {
      if (service.inUse) {
        const usage = service.hasIndices
          ? `${service.newIndex - service.oldIndex} ${service.unit}`
          : `1 ${service.unit}`;
        doc.rect(tableX, y, tableWidth, rowHeight);
        doc.text(`Dịch vụ: ${service.name}`, tableX + 2, y + 6);
        doc.text(`${usage} x ${service.rate.toLocaleString()} đ`, tableX + col1Width + 2, y + 6);
        doc.setFillColor(255, 255, 200);
        doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
        doc.text(`${service.fee.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
        y += rowHeight;
      }
    });

    // Total Service Charge Row
    doc.rect(tableX, y, tableWidth, rowHeight);
    doc.setFont("Roboto", "bold");
    doc.text("Tổng phí dịch vụ", tableX + 2, y + 6);
    doc.text("", tableX + col1Width + 2, y + 6);
    doc.setFillColor(255, 255, 200);
    doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
    doc.text(`${invoice.serviceCharge.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
    y += rowHeight;

    // Total Amount Row
    doc.setFillColor(240, 240, 240);
    doc.rect(tableX, y, tableWidth, rowHeight, 'F');
    doc.setFont("Roboto", "bold");
    doc.text("Tổng tiền", tableX + 2, y + 6);
    doc.text("", tableX + col1Width + 2, y + 6);
    doc.setFillColor(255, 255, 100);
    doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
    doc.text(`${invoice.total.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
    y += 15;

    // QR Code
    if (qrImage) {
      const canvas = document.createElement('canvas');
      canvas.width = qrImage.width;
      canvas.height = qrImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(qrImage, 0, 0);
      const qrDataURL = canvas.toDataURL('image/png');
      doc.addImage(qrDataURL, 'PNG', leftMargin, y, 60, 60);
      y += 65; // Tăng khoảng cách vì QR lớn hơn
    }

    // Thêm trạng thái thanh toán vào PDF
    doc.setFont("Roboto", "bold");
    doc.text(`Trạng thái: ${paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Đang chờ'}`, leftMargin, y);

    // Save PDF
    doc.save(`invoice_${invoice.id}.pdf`);
  };

  useEffect(() => {
    const doc = new jsPDF();

    // Add Roboto fonts
    doc.addFileToVFS("Roboto-Regular.ttf", robotoRegularBase64.split(',')[1]);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFileToVFS("Roboto-Bold.ttf", robotoBoldBase64.split(',')[1]);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    // Layout settings
    const leftMargin = 15;
    let y = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header: Invoice Title
    doc.setFont("Roboto", "bold");
    doc.setFontSize(18);
    const title = `HÓA ĐƠN ${invoice.id}`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, y);
    y += 5;
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, pageWidth - leftMargin, y);
    y += 10;

    // Room Information
    doc.setFont("Roboto", "normal");
    doc.setFontSize(12);
    doc.text(`Phòng: ${room.name}`, leftMargin, y);
    y += 7;
    doc.text(`Chủ phòng: ${room.owner}`, leftMargin, y);
    y += 7;
    doc.text(`Số điện thoại: ${room.phone}`, leftMargin, y);
    y += 10;

    // Invoice Information
    doc.setFont("Roboto", "bold");
    doc.text(`Lý do: ${invoice.reason}`, leftMargin, y);
    y += 7;
    doc.setFont("Roboto", "normal");
    doc.text(`Ngày bắt đầu sử dụng: ${invoice.startDate}`, leftMargin, y);
    y += 7;
    doc.text(`Ngày kết thúc: ${invoice.endDate}`, leftMargin, y);
    y += 7;
    doc.text(`Hạn đóng: ${invoice.dueDate}`, leftMargin, y);
    y += 10;

    // Financial Details Table
    doc.setFont("Roboto", "bold");
    doc.setFontSize(12);
    doc.text("Chi tiết thanh toán:", leftMargin, y);
    y += 7;

    // Table settings
    const col1Width = 80;
    const col2Width = 60;
    const col3Width = 35;
    const tableX = leftMargin;
    const rowHeight = 8;
    const tableWidth = col1Width + col2Width + col3Width;

    // Table Header
    doc.setFillColor(220, 220, 220);
    doc.rect(tableX, y, tableWidth, rowHeight, 'F');
    doc.setFont("Roboto", "bold");
    doc.text("Mục", tableX + 2, y + 6);
    doc.text("Tính toán", tableX + col1Width + 2, y + 6);
    doc.text("Số tiền", tableX + col1Width + col2Width + 2, y + 6);
    y += rowHeight;

    // Table Rows
    doc.setFont("Roboto", "normal");

    // Rent Row
    doc.rect(tableX, y, tableWidth, rowHeight);
    doc.text(`Tiền thuê (${invoice.daysUsed} ngày)`, tableX + 2, y + 6);
    doc.text(`${room.price.toLocaleString()} đ / ${invoice.daysInMonth} ngày x ${invoice.daysUsed}`, tableX + col1Width + 2, y + 6);
    doc.setFillColor(255, 255, 200);
    doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
    doc.text(`${invoice.rentCharge.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
    y += rowHeight;

    // Service Rows
    invoice.services.forEach((service) => {
      if (service.inUse) {
        const usage = service.hasIndices
          ? `${service.newIndex - service.oldIndex} ${service.unit}`
          : `1 ${service.unit}`;
        doc.rect(tableX, y, tableWidth, rowHeight);
        doc.text(`Dịch vụ: ${service.name}`, tableX + 2, y + 6);
        doc.text(`${usage} x ${service.rate.toLocaleString()} đ`, tableX + col1Width + 2, y + 6);
        doc.setFillColor(255, 255, 200);
        doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
        doc.text(`${service.fee.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
        y += rowHeight;
      }
    });

    // Total Service Charge Row
    doc.rect(tableX, y, tableWidth, rowHeight);
    doc.setFont("Roboto", "bold");
    doc.text("Tổng phí dịch vụ", tableX + 2, y + 6);
    doc.text("", tableX + col1Width + 2, y + 6);
    doc.setFillColor(255, 255, 200);
    doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
    doc.text(`${invoice.serviceCharge.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
    y += rowHeight;

    // Total Amount Row
    doc.setFillColor(240, 240, 240);
    doc.rect(tableX, y, tableWidth, rowHeight, 'F');
    doc.setFont("Roboto", "bold");
    doc.text("Tổng tiền", tableX + 2, y + 6);
    doc.text("", tableX + col1Width + 2, y + 6);
    doc.setFillColor(255, 255, 100);
    doc.rect(tableX + col1Width + col2Width, y, col3Width, rowHeight, 'F');
    doc.text(`${invoice.total.toLocaleString()} đ`, tableX + col1Width + col2Width + 2, y + 6);
    y += 15;

    // QR Code
    if (qrImage) {
      const canvas = document.createElement('canvas');
      canvas.width = qrImage.width;
      canvas.height = qrImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(qrImage, 0, 0);
      const qrDataURL = canvas.toDataURL('image/png');
      doc.addImage(qrDataURL, 'PNG', leftMargin, y, 60, 60);
      y += 65; // Tăng khoảng cách vì QR lớn hơn
    }

    // Thêm trạng thái thanh toán vào PDF
    doc.setFont("Roboto", "bold");
    doc.text(`Trạng thái: ${paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Đang chờ'}`, leftMargin, y);

    const pdfDataUri = doc.output('datauristring');
    if (pdfRef.current) {
      pdfRef.current.src = pdfDataUri;
    }
  }, [invoice, room, qrImage, paymentStatus]);

  return (
    <div className="invoice-detail-modal-overlay">
      <div className="invoice-detail-modal">
        <div className="invoice-detail-modal-header">
          <h3>Chi tiết hóa đơn {invoice.id}</h3>
          <button className="close-button" onClick={onClose}>Đóng</button>
        </div>
        <div className="invoice-detail-modal-content">
          <iframe
            ref={pdfRef}
            title="Invoice PDF"
            style={{ width: '100%', height: '500px', border: 'none' }}
          />
          <p>Trạng thái thanh toán: {paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Đang chờ'}</p>
          <button className="download-button" onClick={generatePDF}>
            Tải PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailModal;