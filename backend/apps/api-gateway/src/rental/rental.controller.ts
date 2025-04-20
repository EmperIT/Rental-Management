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
import { RentalService } from './rental.service';
import { Rental } from '@app/commonn';
import { AuthGuard } from '@nestjs/passport';
import { catchError } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  CreateRoomSwaggerDto,
  UpdateRoomSwaggerDto,
  RoomSwaggerDto,
  RoomsSwaggerDto,
  CreateTenantSwaggerDto,
  UpdateTenantSwaggerDto,
  TenantSwaggerDto,
  TenantsSwaggerDto,
  CreateInvoiceSwaggerDto,
  UpdateInvoiceSwaggerDto,
  InvoiceSwaggerDto,
  InvoicesSwaggerDto,
} from '../../dto/rental.dto';

@ApiTags('rental')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  /* Room Endpoints */
  @Post('rooms')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo phòng mới', description: 'Yêu cầu xác thực JWT' })
  @ApiBody({ type: CreateRoomSwaggerDto })
  @ApiResponse({ status: 201, description: 'Phòng đã được tạo thành công', type: RoomSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  createRoom(@Body() createRoomDto: Rental.CreateRoomDto) {
    return this.rentalService.createRoom(createRoomDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('rooms')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách phòng', description: 'Yêu cầu xác thực JWT' })
  @ApiQuery({ name: 'page', description: 'Số trang', type: Number, example: 0, required: false })
  @ApiQuery({ name: 'limit', description: 'Số lượng kết quả trên mỗi trang', type: Number, example: 0, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách phòng', type: RoomsSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  findAllRooms(
    @Query('page') page: number = 0, 
    @Query('limit') limit: number = 0
  ) {
    return this.rentalService.findAllRooms(page, limit).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('rooms/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin phòng theo ID', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của phòng' })
  @ApiResponse({ status: 200, description: 'Thông tin phòng', type: RoomSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  findOneRoom(@Param('id') id: string) {
    return this.rentalService.findOneRoom(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Patch('rooms/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin phòng', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của phòng' })
  @ApiBody({ type: UpdateRoomSwaggerDto })
  @ApiResponse({ status: 200, description: 'Phòng đã được cập nhật', type: RoomSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  updateRoom(
    @Param('id') id: string, 
    @Body() updateRoomDto: Rental.UpdateRoomDto
  ) {
    return this.rentalService.updateRoom(id, updateRoomDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete('rooms/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa phòng', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của phòng' })
  @ApiResponse({ status: 200, description: 'Phòng đã được xóa', type: RoomSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  removeRoom(@Param('id') id: string) {
    return this.rentalService.removeRoom(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  /* Tenant Endpoints */
  @Post('tenants')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo người thuê mới', description: 'Yêu cầu xác thực JWT' })
  @ApiBody({ type: CreateTenantSwaggerDto })
  @ApiResponse({ status: 201, description: 'Người thuê đã được tạo thành công', type: TenantSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  createTenant(@Body() createTenantDto: Rental.CreateTenantDto) {
    return this.rentalService.createTenant(createTenantDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('tenants')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách người thuê theo bộ lọc', description: 'Yêu cầu xác thực JWT' })
  @ApiQuery({ name: 'roomId', description: 'ID phòng thuê', required: false })
  @ApiQuery({ name: 'isLeadRoom', description: 'Là người đại diện phòng', type: Boolean, required: false })
  @ApiQuery({ name: 'page', description: 'Số trang', type: Number, example: 0, required: false })
  @ApiQuery({ name: 'limit', description: 'Số lượng kết quả trên mỗi trang', type: Number, example: 0, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách người thuê', type: TenantsSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  findAllTenantsByFilter(
    @Query('roomId') roomId?: string,
    @Query('isLeadRoom') isLeadRoom?: boolean,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 0,
  ) {
    return this.rentalService.findAllTenantsByFilter(roomId, isLeadRoom, page, limit).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('tenants/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin người thuê theo ID', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của người thuê' })
  @ApiResponse({ status: 200, description: 'Thông tin người thuê', type: TenantSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người thuê' })
  findOneTenant(@Param('id') id: string) {
    return this.rentalService.findOneTenant(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Patch('tenants/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin người thuê', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của người thuê' })
  @ApiBody({ type: UpdateTenantSwaggerDto })
  @ApiResponse({ status: 200, description: 'Người thuê đã được cập nhật', type: TenantSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người thuê' })
  updateTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: Rental.UpdateTenantDto
  ) {
    return this.rentalService.updateTenant(id, updateTenantDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete('tenants/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa người thuê', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của người thuê' })
  @ApiResponse({ status: 200, description: 'Người thuê đã được xóa', type: TenantSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người thuê' })
  removeTenant(@Param('id') id: string) {
    return this.rentalService.removeTenant(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  /* Invoice Endpoints */
  @Post('invoices')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo hóa đơn mới', description: 'Yêu cầu xác thực JWT' })
  @ApiBody({ type: CreateInvoiceSwaggerDto })
  @ApiResponse({ status: 201, description: 'Hóa đơn đã được tạo thành công', type: InvoiceSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  createInvoice(@Body() createInvoiceDto: Rental.CreateInvoiceDto) {
    return this.rentalService.createInvoice(createInvoiceDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('invoices')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách hóa đơn theo bộ lọc', description: 'Yêu cầu xác thực JWT' })
  @ApiQuery({ name: 'status', description: 'Trạng thái hóa đơn (paid/unpaid)', required: false })
  @ApiQuery({ name: 'roomId', description: 'ID phòng', required: false })
  @ApiQuery({ name: 'month', description: 'Tháng lập hóa đơn (YYYY-MM)', required: false })
  @ApiQuery({ name: 'page', description: 'Số trang', type: Number, example: 0, required: false })
  @ApiQuery({ name: 'limit', description: 'Số lượng kết quả trên mỗi trang', type: Number, example: 0, required: false })
  @ApiResponse({ status: 200, description: 'Danh sách hóa đơn', type: InvoicesSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  findAllInvoicesByFilter(
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 0,
    @Query('status') isPaid?: boolean,
    @Query('roomId') roomId?: string,
    @Query('month') month?: string,
  ) {
    return this.rentalService.findAllInvoicesByFilter(page, limit, isPaid, roomId, month).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Get('invoices/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin hóa đơn theo ID', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn' })
  @ApiResponse({ status: 200, description: 'Thông tin hóa đơn', type: InvoiceSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hóa đơn' })
  findOneInvoice(@Param('id') id: string) {
    return this.rentalService.findOneInvoice(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Patch('invoices/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin hóa đơn', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn' })
  @ApiBody({ type: UpdateInvoiceSwaggerDto })
  @ApiResponse({ status: 200, description: 'Hóa đơn đã được cập nhật', type: InvoiceSwaggerDto })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hóa đơn' })
  updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: Rental.UpdateInvoiceDto
  ) {
    return this.rentalService.updateInvoice(id, updateInvoiceDto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }

  @Delete('invoices/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa hóa đơn', description: 'Yêu cầu xác thực JWT' })
  @ApiParam({ name: 'id', description: 'ID của hóa đơn' })
  @ApiResponse({ status: 200, description: 'Hóa đơn đã được xóa', type: InvoiceSwaggerDto })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hóa đơn' })
  removeInvoice(@Param('id') id: string) {
    return this.rentalService.removeInvoice(id).pipe(
      catchError((val) => {
        throw new HttpException(val.message, val.statusCode || 400);
      }),
    );
  }
}