import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import InvoiceForm from '../components/invoice/InvoiceForm';
import RoomDetailModal from '../components/invoice/RoomDetailModal';
import '../styles/invoice/InvoicePage.css';
import { FaCog } from 'react-icons/fa';
import {
  findAllRooms,
  findAllInvoicesByFilter,
  getAllServices,
  getRoomServices,
  findLatestReadings,
  createInvoice,
  saveService,
  triggerInvoiceGeneration,
  findAllTenantsByFilter,
} from '../services/rentalService';

const InvoicePage = () => {
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [roomServices, setRoomServices] = useState({});
  const [readings, setReadings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [modalOpen, setModalOpen] = useState(false);
  const [roomDetailModalOpen, setRoomDetailModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [defaultBillingDay, setDefaultBillingDay] = useState(1);
  const [dueDays, setDueDays] = useState(7);
  const [autoGenerate, setAutoGenerate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch services to get billing settings and service data
        const serviceResponse = await getAllServices();
        const apiServices = serviceResponse.services || [];

        // Extract billing settings
        const billingDayService = apiServices.find(s => s.name === 'INVOICE_GENERATION_DAY');
        const dueDaysService = apiServices.find(s => s.name === 'INVOICE_DUE_DAYS');
        const autoSendService = apiServices.find(s => s.name === 'AUTO_SEND_INVOICE');

        setDefaultBillingDay(billingDayService ? Number(billingDayService.value) : 1);
        setDueDays(dueDaysService ? Number(dueDaysService.value) : 7);
        setAutoGenerate(autoSendService ? autoSendService.value === 'true' : false);

        // Filter services: only ELECTRICITY_PRICE and WATER_PRICE for CONFIG, all FEE services
        const mappedServices = apiServices
          .filter((service) => 
            (service.type === 'CONFIG' && ['ELECTRICITY_PRICE', 'WATER_PRICE'].includes(service.name)) ||
            service.type === 'FEE'
          )
          .map((service) => ({
            name: service.name,
            rate: parseFloat(service.value),
            unit: service.unit,
            type: service.type,
            hasIndices: service.type === 'CONFIG' && ['ELECTRICITY_PRICE', 'WATER_PRICE'].includes(service.name),
          }));
        setServices(mappedServices);

        // Fetch rooms
        const roomResponse = await findAllRooms(0, 0);
        const apiRooms = roomResponse.rooms || [];

        // Fetch invoices, room services, readings, and lead tenant for each room
        const mappedRooms = await Promise.all(
          apiRooms.map(async (room) => {
            // Fetch invoices
            const invoicesResponse = await findAllInvoicesByFilter(0, 0, null, room.id, null);
            const invoices = invoicesResponse.invoices || [];

            // Fetch room services
            const roomServicesResponse = await getRoomServices(room.id);
            const servicesArray = Array.isArray(roomServicesResponse) ? roomServicesResponse : roomServicesResponse.services || [];
            setRoomServices(prev => ({
              ...prev,
              [room.id]: servicesArray,
            }));

            // Fetch latest readings
            const readingsResponse = await findLatestReadings(room.id);
            const roomReadings = readingsResponse || {};
            setReadings(prev => ({
              ...prev,
              [room.id]: roomReadings,
            }));

            // Fetch lead tenant (use page = 1 for 1-based indexing)
            const tenantsResponse = await findAllTenantsByFilter(room.id, true, 1, 1);
            const leadTenant = tenantsResponse.tenants?.[0] || null;

            const guestsResponse = await findAllTenantsByFilter(room.id, undefined, 1, 0);
            const guests = guestsResponse.total || 0;

            return {
              id: room.id,
              name: room.roomNumber,
              owner: leadTenant ? leadTenant.name : 'Chưa có thông tin',
              phone: leadTenant ? leadTenant.phone : 'Chưa có thông tin',
              contractEnd: room.contractEnd || 'Chưa có thông tin',
              invoiceDate: room.invoiceDate || new Date().toISOString().slice(0, 10),
              status: invoices.length > 0 ? 'Đã lập' : 'Chưa lập',
              price: room.price || 0,
              guests: guests || 0,
              invoices: invoices.map(invoice => ({
                id: invoice.id,
                roomId: invoice.roomId,
                month: invoice.month,
                fees: invoice.fees,
                total: invoice.total,
                dueDate: invoice.dueDate,
                isPaid: invoice.isPaid,
                paidAt: invoice.paidAt,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
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

  const handleCreateInvoice = (room) => {
    setActiveRoom(room);
    setModalOpen(true);
  };

  const handleViewRoomDetails = (room) => {
    setSelectedRoom(room);
    setRoomDetailModalOpen(true);
  };

  const handleSaveSettings = async () => {
    try {
      await saveService({
        name: 'INVOICE_GENERATION_DAY',
        value: defaultBillingDay.toString(),
        description: 'Ngày trong tháng để gửi hóa đơn (1-31)',
        type: 'CONFIG',
        unit: 'day',
      });

      await saveService({
        name: 'INVOICE_DUE_DAYS',
        value: dueDays.toString(),
        description: 'Số ngày để thanh toán hóa đơn sau khi gửi',
        type: 'CONFIG',
        unit: 'day',
      });

      await saveService({
        name: 'AUTO_SEND_INVOICE',
        value: autoGenerate.toString(),
        description: 'Tự động gửi hóa đơn khi đến ngày được cấu hình',
        type: 'CONFIG',
        unit: '',
      });

      if (autoGenerate) {
        await triggerInvoiceGeneration();
        alert('Đã kích hoạt tạo hóa đơn tự động!');
      }

      setSettingsModalOpen(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Không thể lưu cài đặt: ' + (err.response?.data?.message || 'Lỗi không xác định.'));
    }
  };

  const handleSaveInvoice = async (roomId, invoiceData) => {
    try {
      const response = await createInvoice(invoiceData);
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId
            ? {
                ...room,
                invoices: [...room.invoices, { ...invoiceData, id: response.id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }],
                status: 'Đã lập',
              }
            : room
        )
      );
      setModalOpen(false);
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Không thể tạo hóa đơn: ' + (err.response?.data?.message || err.message || 'Lỗi không xác định.'));
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      (selectedFloor === '' || room.floor === Number(selectedFloor)) &&
      room.invoiceDate.startsWith(selectedMonth)
  );

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ip-invoice-page">
      <h2>Quản lý hóa đơn</h2>
      <div className="ip-filter-bar">
        <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
          <option value="">Tất cả tầng</option>
          {[...new Set(rooms.map(room => room.floor))].map(floor => (
            <option key={floor} value={floor}>Tầng {floor}</option>
          ))}
        </select>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <button className="ip-settings-button" onClick={() => setSettingsModalOpen(true)}>
          <FaCog /> Cài đặt
        </button>
      </div>

      {settingsModalOpen && (
        <div className="ip-modal-overlay">
          <div className="ip-modal">
            <div className="ip-modal-header">
              <h3>Cài đặt hóa đơn</h3>
              <button
                className="ip-button ip-button-close"
                onClick={() => setSettingsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
            <div className="ip-modal-content">
              <div className="ip-settings-group">
                <label>Ngày lập hóa đơn tự động:</label>
                <select
                  value={defaultBillingDay}
                  onChange={(e) => setDefaultBillingDay(Number(e.target.value))}
                >
                  {[...Array(31).keys()].map((day) => (
                    <option key={day + 1} value={day + 1}>
                      Ngày {day + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ip-settings-group">
                <label>Số ngày hạn đóng hóa đơn:</label>
                <input
                  type="number"
                  value={dueDays}
                  onChange={(e) => setDueDays(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div className="ip-settings-group">
                <label>Tự động tạo hóa đơn:</label>
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                />
              </div>
              <button className="ip-button ip-button-save" onClick={handleSaveSettings}>
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="ip-room-grid">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onCreateInvoice={() => handleCreateInvoice(room)}
            onViewDetails={() => handleViewRoomDetails(room)}
          />
        ))}
      </div>
      <InvoiceForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        room={activeRoom || {}}
        services={services}
        roomServices={activeRoom ? roomServices[activeRoom.id] || [] : []}
        readings={activeRoom ? readings[activeRoom.id] || {} : {}}
        defaultBillingDay={defaultBillingDay}
        dueDays={dueDays}
        onSave={handleSaveInvoice}
      />
      {roomDetailModalOpen && (
        <RoomDetailModal
          room={selectedRoom}
          onClose={() => setRoomDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default InvoicePage;