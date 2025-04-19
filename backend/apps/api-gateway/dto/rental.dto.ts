import { ApiProperty } from '@nestjs/swagger';
import { Rental } from '@app/commonn';

// Room DTOs
export class CreateRoomSwaggerDto implements Rental.CreateRoomDto {
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
    description: 'Địa chỉ phòng',
    example: "Số 123, Đường ABC, Quận XYZ, TP. HCM",
    required: true
  })
  address: string;

  @ApiProperty({
    description: 'Trạng thái phòng trống',
    example: 'true',
    required: true
  })
  isEmpty: boolean;
}

export class UpdateRoomSwaggerDto implements Rental.UpdateRoomDto {
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
    description: 'Địa chỉ phòng',
    example: "Số 123, Đường ABC, Quận XYZ, TP. HCM",
    required: false
  })
  address: string;

  @ApiProperty({
    description: 'Trạng thái phòng trống',
    example: 'false',
    required: false
  })
  isEmpty: boolean;
}

export class FindAllRoomsSwaggerDto implements Rental.FindAllRoomsDto {
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
    description: 'Địa chỉ phòng',
    example: 'Số 123, Đường ABC, Quận XYZ, TP. HCM'
  })
  address: string;

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
    description: 'Ngày bắt đầu thuê',
    example: '2023-04-01',
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