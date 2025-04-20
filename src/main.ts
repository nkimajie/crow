import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Config.getValue('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Event Management API')
    .setDescription('API for managing event categories in a tree structure')
    .setVersion('1.0')
    .addTag('categories')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`running on port ${port}`);
}
bootstrap();
