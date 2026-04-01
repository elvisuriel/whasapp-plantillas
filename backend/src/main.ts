import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  app.enableCors();

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('WhatsApp Backend API')
    .setDescription('API para gestión de plantillas, listas, envíos y más')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Servidor NestJS escuchando en el puerto ${port}`);
  console.log(`Swagger disponible en http://localhost:${port}/api`);
}
bootstrap();
