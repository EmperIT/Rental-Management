// filepath: c:\Users\truon\Documents\KTHDV\Rental-Management\backend\apps\api-gateway\dto\email.dto.ts
import { ApiProperty } from '@nestjs/swagger';

// Common response for all email operations
export class EmailResponse {
  @ApiProperty({
    description: 'Trạng thái gửi email',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'ID của email đã gửi',
    example: '<random-message-id@example.com>'
  })
  messageId: string;

  @ApiProperty({
    description: 'URL xem trước email (nếu hỗ trợ)',
    example: 'https://ethereal.email/message/preview/xyz123'
  })
  previewUrl: string;
}

// Fee DTO for invoice email
export class FeeDto {
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
    description: 'Mô tả khoản phí',
    example: 'Tiền điện tháng 4'
  })
  description: string;
}

// Invoice Email DTO
export class SendInvoiceEmailDto {
  @ApiProperty({
    description: 'Email người nhận',
    example: 'tenant@example.com',
    required: true
  })
  to: string;

  @ApiProperty({
    description: 'Tên người thuê',
    example: 'Nguyễn Văn A',
    required: true
  })
  tenantName: string;

  @ApiProperty({
    description: 'Số phòng',
    example: 'A101',
    required: true
  })
  roomNumber: string;

  @ApiProperty({
    description: 'Tháng lập hóa đơn',
    example: 'Tháng 4/2025',
    required: true
  })
  month: string;

  @ApiProperty({
    description: 'Ngày hết hạn thanh toán',
    example: '15/04/2025',
    required: true
  })
  dueDate: string;

  @ApiProperty({
    description: 'Tổng tiền',
    example: 5000000,
    required: true
  })
  total: number;

  @ApiProperty({
    description: 'Các khoản phí',
    type: [FeeDto],
    required: true
  })
  fees: FeeDto[];
}

// Verification Email DTO
export class SendVerificationEmailDto {
  @ApiProperty({
    description: 'Email người nhận',
    example: 'user@example.com',
    required: true
  })
  to: string;

  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'Liên kết xác minh tài khoản',
    example: 'https://example.com/verify?token=abc123',
    required: true
  })
  verificationLink: string;

  @ApiProperty({
    description: 'Thời gian hết hạn',
    example: '24 giờ',
    required: true
  })
  expiresIn: string;
}

// Password Reset Email DTO
export class SendPasswordResetEmailDto {
  @ApiProperty({
    description: 'Email người nhận',
    example: 'user@example.com',
    required: true
  })
  to: string;

  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'Liên kết đặt lại mật khẩu',
    example: 'https://example.com/reset-password?token=abc123',
    required: true
  })
  resetLink: string;

  @ApiProperty({
    description: 'Thời gian hết hạn',
    example: '1 giờ',
    required: true
  })
  expiresIn: string;
}

// Notification Email DTO
export class SendNotificationEmailDto {
  @ApiProperty({
    description: 'Email người nhận',
    example: 'user@example.com',
    required: true
  })
  to: string;

  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'Nội dung thông báo',
    example: 'Có thông báo mới về hóa đơn của bạn',
    required: true
  })
  message: string;

  @ApiProperty({
    description: 'Liên kết hành động',
    example: 'https://example.com/notifications/123',
    required: true
  })
  actionLink: string;

  @ApiProperty({
    description: 'Văn bản nút hành động',
    example: 'Xem chi tiết',
    required: true
  })
  actionText: string;
}