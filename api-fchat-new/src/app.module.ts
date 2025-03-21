import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const NODE_ENV = process.env.NODE_ENV || 'dev';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env${NODE_ENV}`,
      validationSchema: Joi.object({
        LOCAL_PORT: Joi.number().default(3000),
        DOCKER_PORT: Joi.number().default(3000),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_LOCAL_PORT: Joi.number().default(5432),
        DB_DOCKER_PORT: Joi.number().default(5432),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_DOCKER_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: NODE_ENV === 'dev',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
