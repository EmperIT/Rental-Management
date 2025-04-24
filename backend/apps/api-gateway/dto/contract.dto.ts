import { ApiProperty } from '@nestjs/swagger';
import { Contract } from '@app/commonn';

// CreateContract DTO
export class CreateContractSwaggerDto implements Contract.CreateContractDto {
  @ApiProperty({ description: 'ID phòng', required: true })
  roomId: string;

  @ApiProperty({ description: 'Nội dung hợp đồng', required: true })
  content: string;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2023-04-01', required: true })
  startDate: string;

  @ApiProperty({ description: 'Ngày kết thúc', example: '2024-04-01', required: true })
  endDate: string;

  @ApiProperty({ description: 'Tiền cọc', example: 5000000, required: true })
  deposit: number;

  @ApiProperty({ description: 'Giá thuê hàng tháng', example: 3500000, required: true })
  rentAmount: number;

  @ApiProperty({ description: 'ID mẫu hợp đồng', required: false })
  templateId: string;
}

// UpdateContract DTO
export class UpdateContractSwaggerDto implements Partial<Contract.UpdateContractDto> {
  @ApiProperty({ description: 'ID hợp đồng', required: true })
  contractId: string;

  @ApiProperty({ description: 'Trạng thái hiệu lực', required: false })
  isActive?: boolean;

  @ApiProperty({ description: 'ID phòng', required: false })
  roomId?: string;

  @ApiProperty({ description: 'Nội dung hợp đồng', required: false })
  content?: string;

  @ApiProperty({ description: 'Ngày bắt đầu', example: '2023-04-01', required: false })
  startDate?: string;

  @ApiProperty({ description: 'Ngày kết thúc', example: '2024-04-01', required: false })
  endDate?: string;

  @ApiProperty({ description: 'Tiền cọc', example: 5000000, required: false })
  deposit?: number;

  @ApiProperty({ description: 'Giá thuê hàng tháng', example: 3500000, required: false })
  rentAmount?: number;

  @ApiProperty({ description: 'ID mẫu hợp đồng', required: false })
  templateId?: string;
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

  @ApiProperty({ description: 'Tiền cọc', example: 5000000 })
  deposit: number;

  @ApiProperty({ description: 'Giá thuê hàng tháng', example: 3500000 })
  rentAmount: number;

  @ApiProperty({ description: 'ID mẫu hợp đồng' })
  templateId: string;
}

// Contracts DTO
export class ContractsSwaggerDto implements Contract.Contracts {
  @ApiProperty({ description: 'Danh sách hợp đồng', type: [ContractSwaggerDto] })
  contracts: ContractSwaggerDto[];

  @ApiProperty({ description: 'Tổng số hợp đồng' })
  total: number;
}

// CreateContractTemplate DTO
export class CreateContractTemplateSwaggerDto implements Contract.CreateContractTemplateDto {
  @ApiProperty({ description: 'Tên mẫu hợp đồng', required: true })
  name: string;

  @ApiProperty({ description: 'Mô tả mẫu hợp đồng', required: true })
  description: string;

  @ApiProperty({ description: 'Nội dung mẫu hợp đồng', required: true })
  content: string;
}

// UpdateContractTemplate DTO
export class UpdateContractTemplateSwaggerDto implements Partial<Contract.UpdateContractTemplateDto> {
  @ApiProperty({ description: 'ID mẫu hợp đồng', required: true })
  templateId: string;

  @ApiProperty({ description: 'Tên mẫu hợp đồng', required: false })
  name?: string;

  @ApiProperty({ description: 'Mô tả mẫu hợp đồng', required: false })
  description?: string;

  @ApiProperty({ description: 'Nội dung mẫu hợp đồng', required: false })
  content?: string;
}

// ContractTemplate DTO
export class ContractTemplateSwaggerDto implements Contract.ContractTemplate {
  @ApiProperty({ description: 'ID mẫu hợp đồng' })
  templateId: string;

  @ApiProperty({ description: 'Tên mẫu hợp đồng' })
  name: string;

  @ApiProperty({ description: 'Mô tả mẫu hợp đồng' })
  description: string;

  @ApiProperty({ description: 'Nội dung mẫu hợp đồng' })
  content: string;

  @ApiProperty({ description: 'Ngày tạo', format: 'date-time' })
  createdAt: string;

  @ApiProperty({ description: 'Ngày cập nhật', format: 'date-time' })
  updatedAt: string;
}

// ContractTemplates DTO
export class ContractTemplatesSwaggerDto implements Contract.ContractTemplates {
  @ApiProperty({ description: 'Danh sách mẫu hợp đồng', type: [ContractTemplateSwaggerDto] })
  contractTemplates: ContractTemplateSwaggerDto[];

  @ApiProperty({ description: 'Tổng số mẫu hợp đồng' })
  total: number;
}