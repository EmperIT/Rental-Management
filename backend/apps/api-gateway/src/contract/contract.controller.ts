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
  @ApiOperation({ summary: 'Tạo hợp đồng mới' })
  @ApiBody({ type: CreateContractSwaggerDto })
  @ApiResponse({ status: 201, description: 'Tạo hợp đồng thành công', type: ContractSwaggerDto })
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
  @ApiOperation({ summary: 'Lấy danh sách hợp đồng' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 0 })
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiResponse({ status: 200, description: 'Danh sách hợp đồng', type: ContractsSwaggerDto })
  findAll(
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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hợp đồng theo ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Chi tiết hợp đồng', type: ContractSwaggerDto })
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
  @ApiOperation({ summary: 'Cập nhật hợp đồng' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateContractSwaggerDto })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: ContractSwaggerDto })
  update(@Param('id') id: string, @Body() updateContractDto: Contract.UpdateContractDto) {
    return this.contractService.updateContract(id, updateContractDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa hợp đồng' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, description: 'Đã xóa hợp đồng', type: ContractSwaggerDto })
  remove(@Param('id') id: string) {
    return this.contractService.removeContract(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }
}
