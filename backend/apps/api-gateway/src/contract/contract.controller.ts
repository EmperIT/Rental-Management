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
  CreateStayRecordSwaggerDto,
  UpdateStayRecordSwaggerDto,
  ExtendStayRecordSwaggerDto,
  ChangeStayRecordStatusSwaggerDto,
  StayRecordSwaggerDto,
  StayRecordsSwaggerDto,
  StayRecordPaginationSwaggerDto,
} from '../../dto/contract.dto';
import { Contract } from '@app/commonn';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('contract')
@Controller('contract')
@UseGuards(AuthGuard('jwt'))
@Roles('admin') // Chỉ cho phép admin truy cập toàn bộ contract controller
@ApiBearerAuth()
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('contracts')
  @ApiOperation({ summary: 'Tạo hợp đồng mới' })
  @ApiBody({ type: CreateContractSwaggerDto })
  @ApiResponse({ status: 201, description: 'Tạo hợp đồng thành công', type: ContractSwaggerDto })
  createContract(@Body() createContractDto: Contract.CreateContractDto) {
    return this.contractService.createContract(createContractDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('contracts')
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 0 })
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách hợp đồng', type: ContractsSwaggerDto })
  findAllContract(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 0,
    @Query('roomId') roomId?: string,
    @Query('tenantId') tenantId?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.contractService.findAllContracts(page, limit, roomId, tenantId, isActive).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('contracts/:id')
  @ApiOperation({ summary: 'Lấy thông tin hợp đồng theo ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Chi tiết hợp đồng', type: ContractSwaggerDto })
  findOneContract(@Param('id') id: string) {
    return this.contractService.findOneContract(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Patch('contracts/:id')
  @ApiOperation({ summary: 'Cập nhật hợp đồng' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateContractSwaggerDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: ContractSwaggerDto })
  updateContract(@Param('id') id: string, @Body() updateContractDto: Contract.UpdateContractDto) {
    return this.contractService.updateContract(id, updateContractDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete('contracts/:id')
  @ApiOperation({ summary: 'Xóa hợp đồng' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Đã xóa hợp đồng', type: ContractSwaggerDto })
  removeContract(@Param('id') id: string) {
    return this.contractService.removeContract(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Post('stay-records')
  @ApiOperation({ summary: 'Tạo bản ghi tạm trú mới' })
  @ApiBody({ type: CreateStayRecordSwaggerDto })
  @ApiResponse({ status: 201, description: 'Tạo bản ghi tạm trú thành công', type: StayRecordSwaggerDto })
  createStayRecord(@Body() createStayRecordDto: CreateStayRecordSwaggerDto) {
    return this.contractService.createStayRecord(createStayRecordDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('stay-records')
  @ApiOperation({ summary: 'Lấy danh sách bản ghi tạm trú với bộ lọc' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'expired', 'inactive'] })
  @ApiQuery({ name: 'startDateFrom', required: false })
  @ApiQuery({ name: 'startDateTo', required: false })
  @ApiQuery({ name: 'endDateFrom', required: false })
  @ApiQuery({ name: 'endDateTo', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách bản ghi tạm trú', type: StayRecordsSwaggerDto })
  findAllStayRecord(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: string,
    @Query('startDateFrom') startDateFrom?: string,
    @Query('startDateTo') startDateTo?: string,
    @Query('endDateFrom') endDateFrom?: string,
    @Query('endDateTo') endDateTo?: string,
  ) {
    const paginationDto: StayRecordPaginationSwaggerDto = {
      page,
      limit,
      tenantId,
      status,
      startDateFrom,
      startDateTo,
      endDateFrom,
      endDateTo,
    };
    
    return this.contractService.findAllStayRecords(paginationDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('stay-records/:id')
  @ApiOperation({ summary: 'Lấy chi tiết bản ghi tạm trú theo ID' })
  @ApiParam({ name: 'id', description: 'ID bản ghi tạm trú' })
  @ApiResponse({ status: 200, description: 'Chi tiết bản ghi tạm trú', type: StayRecordSwaggerDto })
  findOneStayRecord(@Param('id') id: string) {
    return this.contractService.findOneStayRecord(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Patch('stay-records/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin bản ghi tạm trú' })
  @ApiParam({ name: 'id', description: 'ID bản ghi tạm trú' })
  @ApiBody({ type: UpdateStayRecordSwaggerDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thông tin tạm trú thành công', type: StayRecordSwaggerDto })
  updateStayRecord(@Param('id') id: string, @Body() updateStayRecordDto: UpdateStayRecordSwaggerDto) {
    return this.contractService.updateStayRecord(id, updateStayRecordDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete('stay-records/:id')
  @ApiOperation({ summary: 'Xóa bản ghi tạm trú' })
  @ApiParam({ name: 'id', description: 'ID bản ghi tạm trú' })
  @ApiResponse({ status: 200, description: 'Xóa bản ghi tạm trú thành công', type: StayRecordSwaggerDto })
  removeStayRecord(@Param('id') id: string) {
    return this.contractService.removeStayRecord(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }
}
