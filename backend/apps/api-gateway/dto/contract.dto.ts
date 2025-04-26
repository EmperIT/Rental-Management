import { ApiProperty } from '@nestjs/swagger';
import { Contract } from '@app/commonn';

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