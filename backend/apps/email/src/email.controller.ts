import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { Email } from '@app/commonn';

@Controller()
@Email.EmailServiceControllerMethods()
export class EmailController implements Email.EmailServiceController {
  constructor(private readonly emailService: EmailService) {}

  sendInvoiceEmail(request: Email.SendInvoiceEmailDto): Promise<Email.EmailResponse> {
    return this.emailService.sendInvoiceEmail(request);
  }

  sendVerificationEmail(request: Email.SendVerificationEmailDto): Promise<Email.EmailResponse> {
    return this.emailService.sendVerificationEmail(request);
  }

  sendPasswordResetEmail(request: Email.SendPasswordResetEmailDto): Promise<Email.EmailResponse> {
    return this.emailService.sendPasswordResetEmail(request);
  }

  sendNotificationEmail(request: Email.SendNotificationEmailDto): Promise<Email.EmailResponse> {
    return this.emailService.sendNotificationEmail(request);
  }
}
