import { NestFactory } from '@nestjs/core';
import { AgentsModule } from './agents.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  BadRequestExceptionFilter,
  HttpExceptionFilter,
} from '@app/common/exception/exception.filter';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AgentsModule);

  app.use(json());

  const config = new DocumentBuilder()
    .setTitle('Agent')
    .setDescription(
      'The Agent API is a microservice for agent crud. It is used to manage agent.',
    )
    .setVersion('1.0')
    .addTag('agent')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(
    '/uploads',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      next();
    },
    express.static('/usr/src/app/uploads'),
  );

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
