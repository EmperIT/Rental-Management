import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, Observable, throwError } from 'rxjs';
import { Email } from '@app/commonn';
import { EMAIL_SERVICE } from './constants';

@Injectable()
export class EmailService implements OnModuleInit {
  private emailClient: Email.EmailServiceClient;

  constructor(@Inject(EMAIL_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.emailClient = this.client.getService<Email.EmailServiceClient>(
        Email.EMAIL_SERVICE_NAME,
    );
  }

  sendInvoiceEmail(
    dto: Email.SendInvoiceEmailDto,
  ): Observable<Email.EmailResponse> {
    return this.emailClient.sendInvoiceEmail(dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  sendVerificationEmail(
    dto: Email.SendVerificationEmailDto,
  ): Observable<Email.EmailResponse> {
    return this.emailClient.sendVerificationEmail(dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  sendPasswordResetEmail(
    dto: Email.SendPasswordResetEmailDto,
  ): Observable<Email.EmailResponse> {
    return this.emailClient.sendPasswordResetEmail(dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  sendNotificationEmail(
    dto: Email.SendNotificationEmailDto,
  ): Observable<Email.EmailResponse> {
    return this.emailClient.sendNotificationEmail(dto).pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}