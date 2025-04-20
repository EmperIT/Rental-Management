import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { AuthGuard } from '@nestjs/passport';
import { catchError } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateContractSwaggerDto,
  UpdateContractSwaggerDto,
  ContractSwaggerDto,
  ContractsSwaggerDto,
} from '../../dto/contract.dto';
import { Contract } from '@app/commonn';

@ApiTags('contract')
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo hợp đồng mới', description: 'Yêu cầu xác thực JWT' })
  @ApiBody({ type: CreateContractSwaggerDto })
  @ApiResponse({ status: 201, description: 'Hợp đồng đã được tạo thành công', type: ContractSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  create(@Body() createContractDto: Contract.CreateContractDto) {
    return this.contractService.createContract(createContractDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng', description: 'Yêu cầu xác thực JWT' })
  @ApiQuery({ name: 'roomId', description: 'ID phòng', required: false })
  @ApiQuery({ name: 'tenantId', description: 'ID người thuê', required: false })
  @ApiQuery({ name: 'status', description: 'Trạng thái hợp đồng (active/ended)', required: false })
  @ApiQuery({ name: 'page', description: 'Số trang', type: Number, example: 0, required: false })
  @ApiQuery({ name: 'limit', description: 'Số lượng kết quả trên mỗi trang', type: Number, example: 0, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách hợp đồng', type: ContractsSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  findAll(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 0,
    @Query('roomId') roomId?: string,
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: string,
  ) {
    return this.contractService.findAllContracts(page, limit).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hợp đồng theo ID', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng' })
  @ApiResponse({ status: 200, description: 'Thông tin hợp đồng', type: ContractSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hợp đồng' })
  findOne(@Param('id') id: string) {
    return this.contractService.findOneContract(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật hợp đồng', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng' })
  @ApiBody({ type: UpdateContractSwaggerDto })
  @ApiResponse({ status: 200, description: 'Hợp đồng đã được cập nhật', type: ContractSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hợp đồng' })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: Contract.UpdateContractDto,
  ) {
    return this.contractService.updateContract(id, updateContractDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa hợp đồng', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của hợp đồng' })
  @ApiResponse({ status: 200, description: 'Hợp đồng đã được xóa', type: ContractSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hợp đồng' })
  remove(@Param('id') id: string) {
    return this.contractService.removeContract(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }
}
