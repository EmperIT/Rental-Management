import { ApiProperty } from '@nestjs/swagger';
import { Contract } from '@app/commonn';

// Contract DTOs

// CreateContract DTO
export class CreateContractSwaggerDto implements Contract.CreateContractDto {
  @ApiProperty({ description: 'ID phòng', required: true })
  roomId: string;

  @ApiProperty({ description: 'ID người thuê', required: true })
  tenantId: string;

  @ApiProperty({ description: 'Nội dung hợp đồng', required: true })
  content: string;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2023-04-01', required: true })
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc', example: '2024-04-01', required: true })
  endDate: string;
}

// UpdateContract DTO
export class UpdateContractSwaggerDto implements Partial<Contract.UpdateContractDto> {
  @ApiProperty({ description: 'ID hợp đồng', required: true })
  contractId: string;

  @ApiProperty({ description: 'Trạng thái hiệu lực', required: false })
  isActive?: boolean;

  @ApiProperty({ description: 'ID phòng', required: false })
  roomId?: string;

  @ApiProperty({ description: 'ID người thuê', required: false })
  tenantId?: string;

  @ApiProperty({ description: 'Nội dung hợp đồng', required: false })
  content?: string;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2023-04-01', required: false })
  startDate?: string;

  @ApiProperty({ description: 'Ngày kết thúc', example: '2024-04-01', required: false })
  endDate?: string;
}

// FindOneContract DTO
export class FindOneContractSwaggerDto implements Contract.FindOneContractDto {
  @ApiProperty({ description: 'ID hợp đồng', required: true })
  contractId: string;
}

// Pagination DTO
export class PaginationSwaggerDto implements Contract.PaginationDto {
  @ApiProperty({ description: 'Trang hiện tại', example: 1, required: true })
  page: number;

  @ApiProperty({ description: 'Số lượng mỗi trang', example: 10, required: true })
  limit: number;
}

// Contract DTO
export class ContractSwaggerDto implements Contract.Contract {
  @ApiProperty({ description: 'ID hợp đồng' })
  contractId: string;

  @ApiProperty({ description: 'Trạng thái hiệu lực' })
  isActive: boolean;

  @ApiProperty({ description: 'ID phòng' })
  roomId: string;

  @ApiProperty({ description: 'ID người thuê' })
  tenantId: string;

  @ApiProperty({ description: 'Nội dung hợp đồng' })
  content: string;

  @ApiProperty({ description: 'Ngày tạo', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật', format: 'date-time' })
  updatedAt: string;

  @ApiProperty({ description: 'Ngày bắt đầu' })
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc' })
  endDate: string;
}

// Contracts DTO
export class ContractsSwaggerDto implements Contract.Contracts {
  @ApiProperty({ description: 'Danh sách hợp đồng', type: [ContractSwaggerDto] })
  contracts: ContractSwaggerDto[];

  @ApiProperty({ description: 'Tổng số hợp đồng' })
  total: number;
}

// StayRecord DTOs

// CreateStayRecord DTO
export class CreateStayRecordSwaggerDto {
  @ApiProperty({ description: 'ID người thuê', required: true })
  tenantId: string;

  @ApiProperty({ description: 'Ngày bắt đầu tạm trú', example: '2025-04-01', required: true })
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc tạm trú', example: '2025-10-01', required: true })
  endDate: string;

  @ApiProperty({ description: 'Ghi chú về tạm trú', required: false })
  content: string;

  @ApiProperty({ description: 'ID người tạo bản ghi', required: false })
  createdBy: string;
}

// StayRecordPagination DTO
export class StayRecordPaginationSwaggerDto {
  @ApiProperty({ description: 'Trang hiện tại', example: 1, required: true })
  page: number;

  @ApiProperty({ description: 'Số lượng mỗi trang', example: 10, required: true })
  limit: number;

  @ApiProperty({ description: 'ID người thuê', required: false })
  tenantId?: string;

  @ApiProperty({ description: 'Trạng thái tạm trú (active, expired, inactive)', required: false, enum: ['active', 'expired', 'inactive'] })
  status?: string;

  @ApiProperty({ description: 'Ngày bắt đầu từ', required: false, example: '2025-01-01' })
  startDateFrom?: string;

  @ApiProperty({ description: 'Ngày bắt đầu đến', required: false, example: '2025-12-31' })
  startDateTo?: string;

  @ApiProperty({ description: 'Ngày kết thúc từ', required: false, example: '2025-01-01' })
  endDateFrom?: string;

  @ApiProperty({ description: 'Ngày kết thúc đến', required: false, example: '2025-12-31' })
  endDateTo?: string;
}

// FindOneStayRecord DTO
export class FindOneStayRecordSwaggerDto {
  @ApiProperty({ description: 'ID bản ghi tạm trú', required: true })
  stayId: string;
}

// UpdateStayRecord DTO
export class UpdateStayRecordSwaggerDto {
  @ApiProperty({ description: 'ID bản ghi tạm trú', required: true })
  stayId: string;

  @ApiProperty({ description: 'ID người thuê', required: false })
  tenantId?: string;

  @ApiProperty({ description: 'Ngày bắt đầu tạm trú', example: '2025-04-01', required: false })
  startDate?: string;

  @ApiProperty({ description: 'Ngày kết thúc tạm trú', example: '2025-10-01', required: false })
  endDate?: string;

  @ApiProperty({ description: 'Trạng thái tạm trú', required: false, enum: ['active', 'expired', 'inactive'] })
  status?: string;

  @ApiProperty({ description: 'Ghi chú về tạm trú', required: false })
  content?: string;
}

// ExtendStayRecord DTO
export class ExtendStayRecordSwaggerDto {
  @ApiProperty({ description: 'ID bản ghi tạm trú', required: true })
  stayId: string;

  @ApiProperty({ description: 'Ngày kết thúc mới', example: '2025-12-31', required: true })
  newEndDate: string;

  @ApiProperty({ description: 'ID người cập nhật', required: false })
  updatedBy: string;
}

// ChangeStayRecordStatus DTO
export class ChangeStayRecordStatusSwaggerDto {
  @ApiProperty({ description: 'ID bản ghi tạm trú', required: true })
  stayId: string;

  @ApiProperty({ description: 'Trạng thái mới', required: true, enum: ['active', 'expired', 'inactive'] })
  status: string;

  @ApiProperty({ description: 'ID người cập nhật', required: false })
  updatedBy: string;
}

// StayRecord response DTO
export class StayRecordSwaggerDto {
  @ApiProperty({ description: 'ID bản ghi tạm trú' })
  stayId: string;

  @ApiProperty({ description: 'ID người thuê' })
  tenantId: string;

  @ApiProperty({ description: 'Ngày bắt đầu tạm trú', format: 'date-time' })
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc tạm trú', format: 'date-time' })
  endDate: string;

  @ApiProperty({ description: 'Trạng thái tạm trú', enum: ['active', 'expired', 'inactive'] })
  status: string;

  @ApiProperty({ description: 'Ghi chú về tạm trú' })
  content: string;

  @ApiProperty({ description: 'ID người tạo bản ghi' })
  createdBy: string;

  @ApiProperty({ description: 'Ngày tạo', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật', format: 'date-time' })
  updatedAt: string;
}

// StayRecords response DTO
export class StayRecordsSwaggerDto {
  @ApiProperty({ description: 'Danh sách bản ghi tạm trú', type: [StayRecordSwaggerDto] })
  records: StayRecordSwaggerDto[];

  @ApiProperty({ description: 'Tổng số bản ghi tạm trú' })
  total: number;
}