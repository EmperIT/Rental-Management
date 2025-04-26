import { ApiProperty } from '@nestjs/swagger';
import { Rental } from '@app/commonn';
import { isEmpty } from 'rxjs';

// Room DTOs
export class CreateRoomSwaggerDto {
  @ApiProperty({
    description: 'Số phòng',
    example: 'A101',
    required: true
  })
  roomNumber: string;

  @ApiProperty({
    description: 'Giá phòng',
    example: 3500000,
    required: true
  })
  price: number;

  @ApiProperty({
    description: 'Diện tích phòng',
    example: 32,
    required: true
  })
  area: number;

  @ApiProperty({
    description: 'Ảnh phòng',
    type: 'string',
    format: 'binary',
    isArray: true,
  })
  images: Express.Multer.File[];

  @ApiProperty({
    description: 'Thời gian đặt cọc phòng',
    required: false
  })
  depositDate: string;

  @ApiProperty({
    description: 'Tiền cọc phòng',
    required: true
  })
  depositPrice: number;

  @ApiProperty({
    description: 'Số người tối đa trong phòng',
    required: false
  })
  maxTenants: number;

  @ApiProperty({
    description: 'Trạng thái phòng trống',
    example: 'true',
    required: true
  })
  isEmpty: boolean;
}

export class UpdateRoomSwaggerDto{
  @ApiProperty({
    description: 'ID của phòng',
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'Số phòng',
    example: 'A101',
    required: false
  })
  roomNumber: string;

  @ApiProperty({
    description: 'Giá phòng',
    example: 3500000,
    required: false
  })
  price: number;

  @ApiProperty({
    description: 'Diện tích phòng',
    example: 32,
    required: true
  })
  area: number;

  @ApiProperty({
    description: 'Ảnh phòng',
    required: false
  })
  images: Express.Multer.File[];

  @ApiProperty({
    description: 'Thời gian đặt cọc phòng',
    required: false
  })
  depositDate: string;

  @ApiProperty({
    description: 'Tiền cọc phòng',
    required: true
  })
  depositPrice: number;

  @ApiProperty({
    description: 'Số người tối đa trong phòng',
    required: false
  })
  maxTenants: number;

  @ApiProperty({
    description: 'Trạng thái phòng trống',
    example: 'false',
    required: false
  })
  isEmpty: boolean;
}

export class FindAllRoomsSwaggerDto implements Rental.FindAllRoomsByFilterDto {
  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
    required: true
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng phòng mỗi trang',
    example: 10,
    required: true
  })
  limit: number;

  @ApiProperty({
    description: 'Trạng thái phòng trống',
    example: true,
    required: false
  })
  isEmpty: boolean;
}

export class RoomSwaggerDto implements Rental.Room {
  @ApiProperty({
    description: 'ID của phòng'
  })
  id: string;

  @ApiProperty({
    description: 'Số phòng',
    example: 'A101'
  })
  roomNumber: string;

  @ApiProperty({
    description: 'Giá phòng',
    example: 3500000
  })
  price: number;

  @ApiProperty({
    description: 'Diện tích phòng',
    example: 32,
    required: true
  })
  area: number;

  @ApiProperty({
    description: 'Ảnh phòng',
    required: false
  })
  images: string[];

  @ApiProperty({
    description: 'Thời gian đặt cọc phòng',
    required: false
  })
  depositDate: string;

  @ApiProperty({
    description: 'Tiền cọc phòng',
    required: true
  })
  depositPrice: number;

  @ApiProperty({
    description: 'Số người tối đa trong phòng',
    required: false
  })
  maxTenants: number;

  @ApiProperty({
    description: 'Trạng thái phòng trống',
    example: true
  })
  isEmpty: boolean;

  @ApiProperty({
    description: 'Thời gian tạo',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    format: 'date-time'
  })
  updatedAt: string;
}

export class RoomsSwaggerDto implements Rental.Rooms {
  @ApiProperty({
    description: 'Danh sách phòng',
    type: [RoomSwaggerDto]
  })
  rooms: RoomSwaggerDto[];

  @ApiProperty({
    description: 'Tổng số phòng'
  })
  total: number;
}

// Tenant DTOs
export class CreateTenantSwaggerDto implements Rental.CreateTenantDto {
  @ApiProperty({
    description: 'Tên người thuê',
    example: 'Nguyễn Văn A',
    required: true
  })
  name: string;

  @ApiProperty({
    description: 'Email người thuê',
    example: 'nguyenvana@gmail.com',
    required: true
  })
  email: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0901234567',
    required: true
  })
  phone: string;

  @ApiProperty({
    description: 'ID phòng thuê',
    required: true
  })
  roomId: string;

  @ApiProperty({
    description: 'Là người đại diện phòng',
    example: 'true',
    required: true
  })
  isLeadRoom: boolean;

  @ApiProperty({
    description: 'Số CMND/CCCD',
    example: '001201012345',
    required: true
  })
  identityNumber: string;

  @ApiProperty({
    description: 'Địa chỉ thường trú',
    example: 'Số 123, Đường ABC, Quận XYZ, TP. HCM',
    required: true
  })
  permanentAddress: string;

  @ApiProperty({
    description: 'Phí cọc giữ chỗ',
    example: 1000000,
    required: true
  })
  holdingDepositPrice: number;

  @ApiProperty({
    description: 'Thời gian đóng cọc',
    example: '2025-04-01',
    required: false
  })
  depositDate: string;

  @ApiProperty({
    description: 'Ngày bắt đầu thuê',
    example: '2025-04-01',
    required: true
  })
  startDate: string;
}

export class UpdateTenantSwaggerDto implements Partial<Rental.UpdateTenantDto> {
  @ApiProperty({
    description: 'ID của người thuê',
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'Tên người thuê',
    example: 'Nguyễn Văn A',
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'Email người thuê',
    example: 'nguyenvana@gmail.com',
    required: false
  })
  email?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0901234567',
    required: false
  })
  phone?: string;

  @ApiProperty({
    description: 'ID phòng thuê',
    required: false
  })
  roomId?: string;

  @ApiProperty({
    description: 'Là người đại diện phòng',
    example: 'true',
    required: false
  })
  isLeadRoom?: boolean;

  @ApiProperty({
    description: 'Số CMND/CCCD',
    example: '001201012345',
    required: false
  })
  identityNumber?: string;

  @ApiProperty({
    description: 'Địa chỉ thường trú',
    example: 'Số 123, Đường ABC, Quận XYZ, TP. HCM',
    required: false
  })
  permanentAddress?: string;

  @ApiProperty({
    description: 'Phí cọc giữ chỗ',
    example: 1000000,
    required: true
  })
  holdingDepositPrice: number;

  @ApiProperty({
    description: 'Thời gian đóng cọc',
    example: '2025-04-01',
    required: false
  })
  depositDate: string;

  @ApiProperty({
    description: 'Ngày bắt đầu thuê',
    example: '2023-04-01',
    required: false
  })
  startDate?: string;

  @ApiProperty({
    description: 'Trạng thái người thuê',
    example: true,
    required: false
  })
  isActive?: boolean;
}

export class FindAllTenantsByFilterSwaggerDto implements Partial<Rental.FindAllTenantsByFilterDto> {
  @ApiProperty({
    description: 'ID phòng thuê',
    required: false
  })
  roomId?: string;

  @ApiProperty({
    description: 'Là người đại diện phòng',
    required: false
  })
  isLeadRoom?: boolean;

  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
    required: true
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng người thuê mỗi trang',
    example: 10,
    required: true
  })
  limit: number;
}

export class TenantSwaggerDto implements Rental.Tenant {
  @ApiProperty({
    description: 'ID của người thuê'
  })
  id: string;

  @ApiProperty({
    description: 'Tên người thuê',
    example: 'Nguyễn Văn A'
  })
  name: string;

  @ApiProperty({
    description: 'Email người thuê',
    example: 'nguyenvana@gmail.com'
  })
  email: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0901234567'
  })
  phone: string;

  @ApiProperty({
    description: 'ID phòng thuê'
  })
  roomId: string;

  @ApiProperty({
    description: 'Là người đại diện phòng',
    example: 'true'
  })
  isLeadRoom: boolean;

  @ApiProperty({
    description: 'Số CMND/CCCD',
    example: '001201012345'
  })
  identityNumber: string;

  @ApiProperty({
    description: 'Địa chỉ thường trú',
    example: 'Số 123, Đường ABC, Quận XYZ, TP. HCM'
  })
  permanentAddress: string;

  @ApiProperty({
    description: 'Phí cọc giữ chỗ',
    example: 1000000,
    required: true
  })
  holdingDepositPrice: number;

  @ApiProperty({
    description: 'Thời gian đóng cọc',
    example: '2025-04-01',
    required: false
  })
  depositDate: string;

  @ApiProperty({
    description: 'Ngày bắt đầu thuê',
    example: '2023-04-01'
  })
  startDate: string;

  @ApiProperty({
    description: 'Trạng thái người thuê',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Thời gian tạo',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    format: 'date-time'
  })
  updatedAt: string;
}

export class TenantsSwaggerDto implements Rental.Tenants {
  @ApiProperty({
    description: 'Danh sách người thuê',
    type: [TenantSwaggerDto]
  })
  tenants: TenantSwaggerDto[];

  @ApiProperty({
    description: 'Tổng số người thuê'
  })
  total: number;
}

// Fee DTOs
export class FeeSwaggerDto implements Rental.Fee {
  @ApiProperty({
    description: 'Loại phí',
    example: 'electricity'
  })
  type: string;

  @ApiProperty({
    description: 'Số tiền',
    example: 500000
  })
  amount: number;

  @ApiProperty({
    description: 'Chỉ số (dành cho điện, nước)',
    example: 100,
    required: false
  })
  reading: number;

  @ApiProperty({
    description: 'Mô tả khoản phí',
    example: 'Tiền điện tháng 4',
    required: false
  })
  description: string;

  @ApiProperty({
    description: 'Thời gian tạo',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    format: 'date-time'
  })
  updatedAt: string;
}

// Invoice DTOs
export class CreateInvoiceSwaggerDto implements Rental.CreateInvoiceDto {
  @ApiProperty({
    description: 'ID của phòng',
    required: true
  })
  roomId: string;

  @ApiProperty({
    description: 'Tháng lập hóa đơn',
    example: '2023-04',
    required: true
  })
  month: string;

  @ApiProperty({
    description: 'Các khoản phí',
    type: [FeeSwaggerDto],
    required: true
  })
  fees: FeeSwaggerDto[];

  @ApiProperty({
    description: 'Tổng tiền',
    example: 5000000,
    required: true
  })
  total: number;

  @ApiProperty({
    description: 'Ngày hết hạn thanh toán',
    example: '2023-04-15',
    required: true
  })
  dueDate: string;
}

export class UpdateInvoiceSwaggerDto implements Partial<Rental.UpdateInvoiceDto> {
  @ApiProperty({
    description: 'ID của hóa đơn',
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'ID của phòng',
    required: false
  })
  roomId?: string;

  @ApiProperty({
    description: 'Tháng lập hóa đơn',
    example: '2023-04',
    required: false
  })
  month?: string;

  @ApiProperty({
    description: 'Các khoản phí',
    type: [FeeSwaggerDto],
    required: false
  })
  fees?: FeeSwaggerDto[];

  @ApiProperty({
    description: 'Tổng tiền',
    example: 5000000,
    required: false
  })
  total?: number;

  @ApiProperty({
    description: 'Ngày hết hạn thanh toán',
    example: '2023-04-15',
    required: false
  })
  dueDate?: string;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: true,
    required: false
  })
  isPaid?: boolean;
}

export class FindAllInvoicesByFilterSwaggerDto implements Partial<Rental.FindAllInvoicesByFilterDto> {
  @ApiProperty({
    description: 'Trang hiện tại',
    example: 1,
    required: true
  })
  page: number;

  @ApiProperty({
    description: 'Số lượng hóa đơn mỗi trang',
    example: 10,
    required: true
  })
  limit: number;

  @ApiProperty({
    description: 'Trạng thái hóa đơn',
    example: 'paid',
    required: false,
    enum: ['paid', 'unpaid']
  })
  status?: string;

  @ApiProperty({
    description: 'ID phòng',
    required: false
  })
  roomId?: string;

  @ApiProperty({
    description: 'Tháng lập hóa đơn',
    example: '2023-04',
    required: false
  })
  month?: string;
}

export class InvoiceSwaggerDto implements Rental.Invoice {
  @ApiProperty({
    description: 'ID của hóa đơn'
  })
  id: string;

  @ApiProperty({
    description: 'ID của phòng'
  })
  roomId: string;

  @ApiProperty({
    description: 'Tháng lập hóa đơn',
    example: '2023-04'
  })
  month: string;

  @ApiProperty({
    description: 'Các khoản phí',
    type: [FeeSwaggerDto]
  })
  fees: FeeSwaggerDto[];

  @ApiProperty({
    description: 'Tổng tiền',
    example: 5000000
  })
  total: number;

  @ApiProperty({
    description: 'Ngày hết hạn thanh toán',
    example: '2023-04-15'
  })
  dueDate: string;

  @ApiProperty({
    description: 'Trạng thái thanh toán',
    example: false
  })
  isPaid: boolean;

  @ApiProperty({
    description: 'Ngày thanh toán',
    format: 'date-time',
    required: false
  })
  paidAt: string;

  @ApiProperty({
    description: 'Thời gian tạo',
    format: 'date-time'
  })
  createdAt: string;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    format: 'date-time'
  })
  updatedAt: string;
}

export class InvoicesSwaggerDto implements Rental.Invoices {
  @ApiProperty({
    description: 'Danh sách hóa đơn',
    type: [InvoiceSwaggerDto]
  })
  invoices: InvoiceSwaggerDto[];

  @ApiProperty({
    description: 'Tổng số hóa đơn'
  })
  total: number;
}

// Readings DTOs
export class FindLatestReadingsSwaggerDto {
  @ApiProperty({
    description: 'ID của phòng cần tìm số đọc điện nước mới nhất',
    required: true
  })
  roomId: string;
}

export class ReadingsResponseSwaggerDto {
  @ApiProperty({
    description: 'Đối tượng chứa các số đọc mới nhất của phòng',
    example: {
      'Điện': 100,
      'Nước': 15
    }
  })
  readings: { [key: string]: number };
}

// Service DTOs
export class ServiceSwaggerDto implements Rental.ServiceResponse {
  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'ELECTRICITY_PRICE'
  })
  name: string;

  @ApiProperty({
    description: 'Giá trị dịch vụ',
    example: '3500'
  })
  value: string;

  @ApiProperty({
    description: 'Mô tả dịch vụ',
    example: 'Giá điện (VND/kWh)'
  })
  description: string;

  @ApiProperty({
    description: 'Loại dịch vụ',
    example: 'CONFIG'
  })
  type: string;

  @ApiProperty({
    description: 'Đơn vị của dịch vụ',
    example: 'VND/kWh'
  })
  unit: string;
}

export class GetServiceSwaggerDto implements Rental.GetServiceRequest {
  @ApiProperty({
    description: 'Tên dịch vụ cần lấy thông tin',
    example: 'ELECTRICITY_PRICE',
    required: true
  })
  name: string;
}

export class SaveServiceSwaggerDto implements Rental.SaveServiceRequest {
  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'ELECTRICITY_PRICE',
    required: true
  })
  name: string;

  @ApiProperty({
    description: 'Giá trị dịch vụ',
    example: '3500',
    required: true
  })
  value: string;

  @ApiProperty({
    description: 'Mô tả dịch vụ',
    example: 'Giá điện (VND/kWh)',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Loại dịch vụ',
    example: 'CONFIG',
    required: false
  })
  type?: string;

  @ApiProperty({
    description: 'Đơn vị của dịch vụ',
    example: 'VND/kWh',
    required: false
  })
  unit?: string;
}

export class AllServicesSwaggerDto implements Rental.AllServicesResponse {
  @ApiProperty({
    description: 'Danh sách dịch vụ',
    type: [ServiceSwaggerDto]
  })
  services: ServiceSwaggerDto[];
}

export class RemoveServiceSwaggerDto implements Rental.GetServiceRequest {
  @ApiProperty({
    description: 'Tên dịch vụ cần xóa',
    example: 'ELECTRICITY_PRICE',
    required: true
  })
  name: string;
}

export class InvoiceGenerationResponseSwaggerDto implements Rental.InvoiceGenerationResponse {
  @ApiProperty({
    description: 'Trạng thái thành công',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Thông báo kết quả',
    example: 'Đã xử lý hóa đơn cho 5 phòng'
  })
  message: string;
}

// RoomService DTOs
export class RoomServiceSwaggerDto implements Rental.RoomServiceResponse {
  @ApiProperty({
    description: 'ID của dịch vụ phòng',
  })
  id: string;

  @ApiProperty({
    description: 'ID của phòng',
  })
  roomId: string;

  @ApiProperty({
    description: 'Thông tin dịch vụ',
    type: ServiceSwaggerDto,
  })
  service: ServiceSwaggerDto;

  @ApiProperty({
    description: 'Số lượng/khối lượng',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    description: 'Giá tùy chỉnh (nếu có)',
    example: 50000,
  })
  customPrice: number;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Thời gian tạo',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    format: 'date-time',
  })
  updatedAt: string;
}

export class AddRoomServiceSwaggerDto implements Rental.AddRoomServiceRequest {
  @ApiProperty({
    description: 'ID của phòng',
    required: true,
  })
  roomId: string;

  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'ELECTRICITY',
    required: true,
  })
  serviceName: string;

  @ApiProperty({
    description: 'Số lượng/khối lượng',
    example: 1,
    required: false,
  })
  quantity: number;

  @ApiProperty({
    description: 'Phí',
    example: 50000,
    required: false,
  })
  customPrice?: number;
}

export class GetRoomServicesSwaggerDto implements Rental.GetRoomServicesRequest {
  @ApiProperty({
    description: 'ID của phòng',
    required: true,
  })
  roomId: string;
}

export class RemoveRoomServiceSwaggerDto implements Rental.RemoveRoomServiceRequest {
  @ApiProperty({
    description: 'ID của phòng',
    required: true,
  })
  roomId: string;

  @ApiProperty({
    description: 'Tên dịch vụ cần gỡ bỏ',
    example: 'ELECTRICITY',
    required: true,
  })
  serviceName: string;
}

export class RoomServicesResponseSwaggerDto implements Rental.RoomServicesResponse {
  @ApiProperty({
    description: 'Danh sách dịch vụ phòng',
    type: [RoomServiceSwaggerDto],
  })
  services: RoomServiceSwaggerDto[];
}

// ***** Định nghĩa các DTO cho assets *****
export class CreateAssetSwaggerDto implements Rental.CreateAssetDto {
  @ApiProperty({ description: 'Tên tài sản', example: 'Tủ lạnh' })
  name: string;

  @ApiProperty({ description: 'Giá trị tài sản', example: 3000000 })
  value: number;

  @ApiProperty({ description: 'Đơn vị tính', example: 'chiếc', required: false })
  unit?: string;
}

export class UpdateAssetSwaggerDto implements Rental.UpdateAssetDto {
  @ApiProperty({ description: 'Giá trị tài sản', example: 3000000 })
  value: number;

  @ApiProperty({ description: 'Tên tài sản', example: 'Bàn'})
  name: string;

  @ApiProperty({ description: 'Đơn vị tính', example: 'chiếc', required: false })
  unit?: string;
}

export class AssetSwaggerDto implements Rental.Asset {
  @ApiProperty({ description: 'Tên tài sản', example: 'Tủ lạnh' })
  name: string;

  @ApiProperty({ description: 'Giá trị tài sản', example: 3000000 })
  value: number;

  @ApiProperty({ description: 'Đơn vị tính', example: 'cái' })
  unit: string;

  @ApiProperty({ description: 'Ngày tạo', example: '2025-04-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật', example: '2025-04-15T10:30:00.000Z' })
  updatedAt: string;
}

export class AssetsResponseSwaggerDto implements Rental.AssetsResponse {
  @ApiProperty({ description: 'Danh sách tài sản', type: [AssetSwaggerDto] })
  assets: AssetSwaggerDto[];

  @ApiProperty({ description: 'Tổng số tài sản', example: 10 })
  total: number;
}

// ***** Định nghĩa các DTO cho room assets *****
export class AddRoomAssetSwaggerDto implements Rental.AddRoomAssetRequest {
  @ApiProperty({ description: 'ID phòng', example: '64f7f3e659b16d0964e96db9' })
  roomId: string;

  @ApiProperty({ description: 'Tên tài sản', example: 'Tủ lạnh' })
  assetName: string;

  @ApiProperty({ description: 'Số lượng', example: 1 })
  quantity: number;

  @ApiProperty({ description: 'Giá tùy chỉnh (nếu có)', example: 3500000, required: false })
  customPrice?: number;
}

export class UpdateRoomAssetSwaggerDto implements Rental.UpdateRoomAssetRequest {
  @ApiProperty({ description: 'ID phòng', example: '64f7f3e659b16d0964e96db9' })
  roomId: string;

  @ApiProperty({ description: 'Tên tài sản', example: 'Tủ lạnh' })
  assetName: string;

  @ApiProperty({ description: 'Giá trị tài sản', example: 5000000 })
  value: number;

  @ApiProperty({ description: 'Số lượng', example: 1, required: false })
  quantity: number;

  @ApiProperty({ description: 'Giá tùy chỉnh', example: 3500000, required: false })
  customPrice?: number;

  @ApiProperty({ description: 'Trạng thái hoạt động', example: true, required: false })
  isActive?: boolean;
}

export class RemoveRoomAssetSwaggerDto implements Rental.RemoveRoomAssetRequest {
  @ApiProperty({ description: 'ID phòng', example: '64f7f3e659b16d0964e96db9' })
  roomId: string;

  @ApiProperty({ description: 'Tên tài sản', example: 'Tủ lạnh' })
  assetName: string;
}

export class RoomAssetResponseSwaggerDto implements Rental.RoomAssetResponse {
  @ApiProperty({ description: 'ID tài sản phòng', example: '64f7f3e659b16d0964e96db9' })
  id: string;

  @ApiProperty({ description: 'ID phòng', example: '64f7f3e659b16d0964e96db9' })
  roomId: string;

  @ApiProperty({ description: 'Tên tài sản', example: 'Tủ lạnh' })
  assetName: string;

  @ApiProperty({ description: 'Số lượng', example: 1 })
  quantity: number;

  @ApiProperty({ description: 'Giá tùy chỉnh', example: 3500000 })
  customPrice: number;

  @ApiProperty({ description: 'Trạng thái hoạt động', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Ngày tạo', example: '2025-04-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật', example: '2025-04-15T10:30:00.000Z' })
  updatedAt: string;
}

export class RoomAssetsResponseSwaggerDto implements Rental.RoomAssetsResponse {
  @ApiProperty({ description: 'Danh sách tài sản của phòng', type: [RoomAssetResponseSwaggerDto] })
  assets: RoomAssetResponseSwaggerDto[];

  @ApiProperty({ description: 'Tổng số tài sản', example: 5 })
  total: number;
}

// ***** Định nghĩa các DTO cho transactions *****
export class CreateTransactionSwaggerDto implements Rental.CreateTransactionDto {
  @ApiProperty({ description: 'Loại giao dịch (thu/chi)', example: 'income', enum: ['income', 'expense'] })
  category: 'income' | 'expense';

  @ApiProperty({ description: 'Kiểu giao dịch', example: 'Tiền thuê phòng' })
  type: string;

  @ApiProperty({ description: 'Số tiền', example: 1000000 })
  amount: number;

  @ApiProperty({ description: 'Mô tả', example: 'Tiền thuê phòng tháng 4/2025', required: false })
  description?: string;

  @ApiProperty({ description: 'Liên quan đến (ID hóa đơn)', example: '64f7f3e659b16d0964e96db9', required: false })
  relatedTo?: string;

  @ApiProperty({ description: 'Người tạo (ID người dùng)', example: '64f7f3e659b16d0964e96db9', required: false })
  createdBy?: string;
}

export class UpdateTransactionSwaggerDto implements Partial<Rental.UpdateTransactionDto> {
  @ApiProperty({ description: 'ID giao dịch', example: '64f7f3e659b16d0964e96db9', required: false })
  id: string;
  
  @ApiProperty({ description: 'Loại giao dịch (thu/chi)', example: 'income', enum: ['income', 'expense'], required: false })
  category: 'income' | 'expense';

  @ApiProperty({ description: 'Kiểu giao dịch', example: 'Tiền thuê phòng', required: false })
  type: string;

  @ApiProperty({ description: 'Số tiền', example: 1000000, required: false })
  amount: number;

  @ApiProperty({ description: 'Mô tả', example: 'Tiền thuê phòng tháng 4/2025', required: false })
  description: string;

  @ApiProperty({ description: 'Liên quan đến (ID hóa đơn)', example: '64f7f3e659b16d0964e96db9', required: false })
  relatedTo: string;

  @ApiProperty({ description: 'Người tạo (ID người dùng)', example: '64f7f3e659b16d0964e96db9', required: false })
  createdBy: string;
}

export class TransactionSwaggerDto implements Rental.Transaction {
  @ApiProperty({ description: 'ID giao dịch', example: '64f7f3e659b16d0964e96db9' })
  id: string;
  
  @ApiProperty({ description: 'Loại giao dịch (thu/chi)', example: 'income', enum: ['income', 'expense'] })
  category: 'income' | 'expense';

  @ApiProperty({ description: 'Kiểu giao dịch', example: 'Tiền thuê phòng' })
  type: string;

  @ApiProperty({ description: 'Số tiền', example: 1000000 })
  amount: number;

  @ApiProperty({ description: 'Mô tả', example: 'Tiền thuê phòng tháng 4/2025' })
  description: string;

  @ApiProperty({ description: 'Liên quan đến (ID hóa đơn)', example: '64f7f3e659b16d0964e96db9' })
  relatedTo: string;

  @ApiProperty({ description: 'Người tạo (ID người dùng)', example: '64f7f3e659b16d0964e96db9' })
  createdBy: string;

  @ApiProperty({ description: 'Ngày tạo', example: '2025-04-15T10:30:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật', example: '2025-04-15T10:30:00.000Z' })
  updatedAt: string;
}

export class TransactionsResponseSwaggerDto implements Rental.Transactions {
  @ApiProperty({ description: 'Danh sách giao dịch', type: [TransactionSwaggerDto] })
  transactions: TransactionSwaggerDto[];

  @ApiProperty({ description: 'Tổng số giao dịch', example: 20 })
  total: number;
}