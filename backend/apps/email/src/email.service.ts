import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RpcException } from '@nestjs/microservices';
import { Email } from '@app/commonn';

// Định nghĩa các interface cần thiết cho việc gửi email
interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

interface EmailAttachment {
  filename: string;
  content?: any;
  path?: string;
  contentType?: string;
}

// Interface cho context của template
interface InvoiceEmailContext {
  tenantName: string;
  roomNumber: string;
  month: string;
  dueDate: string;
  total: number;
  fees: {
    type: string;
    amount: number;
    description?: string;
  }[];
  paymentLink?: string;
}

interface VerificationEmailContext {
  username: string;
  verificationLink: string;
  expiresIn: string;
}

interface PasswordResetEmailContext {
  username: string;
  resetLink: string;
  expiresIn: string;
}

interface NotificationEmailContext {
  username: string;
  message: string;
  actionLink?: string;
  actionText?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService
  ) {
    // Khởi tạo transporter cho nodemailer
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      const useSmtp = this.configService.get<string>('EMAIL_USE_SMTP') === 'true' || false;
      // Thêm log để debug cấu hình SMTP - chuyển từ debug sang log để hiển thị rõ ràng hơn
      this.logger.log(`Email config - USE_SMTP: ${useSmtp}`);
      this.logger.log(`Email config - HOST: ${this.configService.get<string>('EMAIL_HOST')}`);
      this.logger.log(`Email config - PORT: ${this.configService.get<number>('EMAIL_PORT')}`);
      
      if (useSmtp === true) {
        this.logger.log('Hello SMTP server...', useSmtp.valueOf());
        // Sử dụng SMTP server thật
        const host = this.configService.get<string>('EMAIL_HOST');
        const port = this.configService.get<number>('EMAIL_PORT');
        const secure = this.configService.get<boolean>('EMAIL_SECURE') || false;
        const user = this.configService.get<string>('EMAIL_USER');
        const requireTLS = this.configService.get<boolean>('EMAIL_REQUIRE_TLS') || true;
        this.logger.log(`Connecting to SMTP server: ${host}:${port} (secure: ${secure})`);
        
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: false, // Thay đổi secure thành false để không sử dụng SSL/TLS từ đầu
          auth: {
            user,
            pass: this.configService.get<string>('EMAIL_PASSWORD'),
          },
          // Các tùy chọn bảo mật TLS
          tls: {
            // Không xác minh chứng chỉ SSL
            rejectUnauthorized: false,
            // Cố gắng nâng cấp kết nối lên TLS sau khi kết nối nếu có thể
            secureProtocol: "TLSv1_2_method"
          },
          // Thêm timeout dài hơn để xử lý kết nối chậm
          connectionTimeout: 20000, // 20 giây
          greetingTimeout: 20000,
          socketTimeout: 25000,
        });
        
        try {
          // Kiểm tra kết nối trước khi sử dụng
          this.logger.log('Verifying SMTP connection...');
          await this.transporter.verify();
          this.logger.log('SMTP connection verified successfully');
        } catch (error) {
          // Log lỗi nhưng không throw exception để tránh crash service
          this.logger.warn(`SMTP verification failed: ${error.message}. Email service may not work correctly.`);
          this.logger.warn('Will attempt to send emails anyway when needed.');
        }
      } else {
        // Sử dụng nodemailer ethereal (for development/testing)
        this.logger.log('Using Ethereal test account for emails...');
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.logger.log(
          `Using Ethereal test account: ${testAccount.user}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to initialize email transporter: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: 'Failed to initialize email service',
      });
    }
  }

  // Phương thức chung để gửi email
  private async sendEmail(options: EmailOptions): Promise<Email.EmailResponse> {
    try {
      const from = `"${
        this.configService.get<string>('EMAIL_FROM_NAME') ||
        'Hệ thống quản lý nhà trọ'
      }" <${
        this.configService.get<string>('EMAIL_FROM_ADDRESS') ||
        'noreply@rental-management.com'
      }>`;

      const mailOptions: nodemailer.SendMailOptions = {
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${options.to}. Message ID: ${info.messageId}`);
      this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

      return {
        success: true,
        messageId: info.messageId || '',
        previewUrl: nodemailer.getTestMessageUrl(info) || '',
      };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new RpcException({
        statusCode: 500,
        message: `Failed to send email: ${error.message}`,
      });
    }
  }

  // Phương thức để tải template và điền dữ liệu
  private async compileTemplate<T>(
    templateName: string,
    context: T,
  ): Promise<string> {
    try {
      // Sử dụng đường dẫn tương đối từ thư mục email service
      const templatesPath = process.env.TEMPLATES_PATH || join(
        __dirname,
        '../email/templates',
      );
      
      const templatePath = join(
        templatesPath,
        `${templateName}.hbs`,
      );
      
      this.logger.log(`Loading template from: ${templatePath}`);
      const templateSource = readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      this.logger.error(
        `Failed to compile template ${templateName}: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        statusCode: 500,
        message: `Template error: ${error.message}`,
      });
    }
  }

  // Phương thức để tạo link QR từ VietQR
  private generateVietQRLink(
    bankId: string,
    accountNo: string,
    template: string = 'compact2',
    amount?: number,
    description?: string,
    accountName?: string,
  ): string {
    // Xây dựng URL theo cú pháp của VietQR
    let qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png`;
    // Thêm các tham số tùy chọn nếu có
    const params = new URLSearchParams();
    
    if (amount) {
      params.append('amount', amount.toString());
    }
    
    if (description) {
      params.append('addInfo', description);
    }
    
    if (accountName) {
      params.append('accountName', accountName);
    }
    
    // Thêm query parameters vào URL nếu có
    const queryString = params.toString();
    if (queryString) {
      qrUrl += `?${queryString}`;
    }
    
    this.logger.log(`Generated VietQR link: ${qrUrl}`);
    return qrUrl;
  }

  // Phương thức để tạo mã QR từ VietQR API
  private async generateQRCode(
    invoiceData: {
      total: number;
      roomNumber: string;
      month: string;
      tenantName: string;
    },
  ): Promise<string> {
    try {
      // Lấy thông tin tài khoản ngân hàng từ biến môi trường
      const bankId = this.configService.get<string>('BANK_ID') || 'vietinbank';
      const accountNo = this.configService.get<string>('BANK_ACCOUNT_NO') || '113366668888';
      const accountName = this.configService.get<string>('BANK_ACCOUNT_NAME') || 'NGUYEN VAN A';
      
      // Xây dựng nội dung thanh toán
      const description = `Tien phong ${invoiceData.roomNumber} thang ${invoiceData.month} - ${invoiceData.tenantName}`;
      
      // Sử dụng phương thức tạo link VietQR
      return this.generateVietQRLink(
        bankId,
        accountNo,
        'compact2',
        invoiceData.total,
        description,
        accountName
      );
    } catch (error) {
      this.logger.error('Error generating QR code:', error);
      return '';
    }
  }

  // gRPC method implementations
  // Gửi email cho hóa đơn
  async sendInvoiceEmail(
    request: Email.SendInvoiceEmailDto,
  ): Promise<Email.EmailResponse> {
    try {
      // Generate QR code from payment link if provided
      let qrCodeImageUrl = '';
      try {
        qrCodeImageUrl = await this.generateQRCode({
          total: request.total,
          roomNumber: request.roomNumber,
          month: request.month,
          tenantName: request.tenantName,
        });
      } catch (error) {
        this.logger.warn('Failed to generate QR code:', error.message);
      }
      
      const context: InvoiceEmailContext = {
        tenantName: request.tenantName,
        roomNumber: request.roomNumber,
        month: request.month,
        dueDate: request.dueDate,
        total: request.total,
        fees: request.fees.map(fee => ({
          type: fee.type,
          amount: fee.amount,
          description: fee.description,
        })),
        paymentLink: qrCodeImageUrl,
      };

      const html = await this.compileTemplate<InvoiceEmailContext>(
        'invoice',
        context,
      );

      return this.sendEmail({
        to: request.to,
        subject: `Hóa đơn tiền phòng ${request.roomNumber} - Tháng ${request.month}`,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send invoice email: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        statusCode: 500,
        message: `Failed to send invoice email: ${error.message}`,
      });
    }
  }

  // Gửi email xác thực tài khoản
  async sendVerificationEmail(
    request: Email.SendVerificationEmailDto,
  ): Promise<Email.EmailResponse> {
    try {
      const context: VerificationEmailContext = {
        username: request.username,
        verificationLink: request.verificationLink,
        expiresIn: request.expiresIn,
      };

      const html = await this.compileTemplate<VerificationEmailContext>(
        'verification',
        context,
      );

      return this.sendEmail({
        to: request.to,
        subject: 'Xác thực tài khoản của bạn',
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send verification email: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Failed to send verification email',
      });
    }
  }

  // Gửi email đặt lại mật khẩu
  async sendPasswordResetEmail(
    request: Email.SendPasswordResetEmailDto,
  ): Promise<Email.EmailResponse> {
    try {
      const context: PasswordResetEmailContext = {
        username: request.username,
        resetLink: request.resetLink,
        expiresIn: request.expiresIn,
      };

      const html = await this.compileTemplate<PasswordResetEmailContext>(
        'reset-password',
        context,
      );

      return this.sendEmail({
        to: request.to,
        subject: 'Đặt lại mật khẩu của bạn',
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Failed to send password reset email',
      });
    }
  }

  // Gửi email thông báo chung
  async sendNotificationEmail(
    request: Email.SendNotificationEmailDto,
  ): Promise<Email.EmailResponse> {
    try {
      const context: NotificationEmailContext = {
        username: request.username,
        message: request.message,
        actionLink: request.actionLink,
        actionText: request.actionText,
      };

      const html = await this.compileTemplate<NotificationEmailContext>(
        'notification',
        context,
      );

      return this.sendEmail({
        to: request.to,
        subject: 'Thông báo từ Hệ thống quản lý nhà trọ',
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send notification email: ${error.message}`,
        error.stack,
      );
      throw new RpcException({
        statusCode: error.statusCode || 500,
        message: error.message || 'Failed to send notification email',
      });
    }
  }
}