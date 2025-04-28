import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '../filter/grpc-exception.filter';
import { NotFoundFilter } from '../filter/not-found.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const gateway = configService.get<number>('GATEWAY') || 3000;
  
  // Enable CORS - Cập nhật để chấp nhận tất cả các origin trong môi trường Docker
  app.enableCors({
    origin: true, // Cho phép tất cả các origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Rental Management API')
    .setDescription('API documentation for Rental Management Subsystem')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('Running API-Gateway on port: ', gateway);
  console.log('API-Gateway URL: ', `http://localhost:${gateway}/api`);
  app.useGlobalFilters(new HttpExceptionFilter(), new NotFoundFilter());
  await app.listen(gateway);
}
bootstrap();
