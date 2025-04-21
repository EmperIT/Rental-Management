import { Body, Controller, Post, UseGuards, HttpException } from '@nestjs/common';
import { EmailService } from './email.service';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import {
  EmailResponse,
  SendInvoiceEmailDto,
  SendVerificationEmailDto,
  SendPasswordResetEmailDto,
  SendNotificationEmailDto,
} from '../../dto/email.dto';
import { catchError } from 'rxjs/operators';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email')

export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('invoice')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gửi email hóa đơn' })
  @ApiBody({ type: SendInvoiceEmailDto })
  @ApiResponse({
    status: 201,
    description: 'Email hóa đơn đã được gửi thành công',
    type: EmailResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Lỗi server khi gửi email' })
  sendInvoiceEmail(
    @Body() dto: SendInvoiceEmailDto,
  ): Observable<EmailResponse> {
    return this.emailService.sendInvoiceEmail(dto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, 500);
      }),
    );
  }

  @ApiOperation({ summary: 'Gửi email xác minh tài khoản' })
  @ApiBody({ type: SendVerificationEmailDto })
  @ApiResponse({
    status: 201,
    description: 'Email xác minh đã được gửi thành công',
    type: EmailResponse,
  })
  @ApiResponse({ status: 500, description: 'Lỗi server khi gửi email' })
  @Post('verification')
  sendVerificationEmail(
    @Body() dto: SendVerificationEmailDto,
  ): Observable<EmailResponse> {
    return this.emailService.sendVerificationEmail(dto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, 500);
      }),
    );
  }

  @ApiOperation({ summary: 'Gửi email đặt lại mật khẩu' })
  @ApiBody({ type: SendPasswordResetEmailDto })
  @ApiResponse({
    status: 201,
    description: 'Email đặt lại mật khẩu đã được gửi thành công',
    type: EmailResponse,
  })
  @ApiResponse({ status: 500, description: 'Lỗi server khi gửi email' })
  @Post('reset-password')
  sendPasswordResetEmail(
    @Body() dto: SendPasswordResetEmailDto,
  ): Observable<EmailResponse> {
    return this.emailService.sendPasswordResetEmail(dto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, 500);
      }),
    );
  }

  @ApiOperation({ summary: 'Gửi email thông báo' })
  @ApiBody({ type: SendNotificationEmailDto })
  @ApiResponse({
    status: 201,
    description: 'Email thông báo đã được gửi thành công',
    type: EmailResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Lỗi server khi gửi email' })
  @Post('notification')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  sendNotificationEmail(
    @Body() dto: SendNotificationEmailDto,
  ): Observable<EmailResponse> {
    return this.emailService.sendNotificationEmail(dto).pipe(
      catchError((val) => {
        throw new HttpException(val.message, 500);
      }),
    );
  }
}