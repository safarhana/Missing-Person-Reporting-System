import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from './admin/admin.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { CaseOfficerModule } from './case_officer/case_officer.module';
import { MprModule } from './missing_person_reporter/mpr.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'mysql'),
        database: configService.get<string>('DB_DATABASE', 'missing_person_reporting_system'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('MAIL_PORT', 465),
          secure: configService.get<boolean>('MAIL_SECURE', true),
          auth: {
            user: configService.get<string>('MAIL_USER', 'remondwasi24@gmail.com'),
            pass: configService.get<string>('MAIL_PASS', 'mimg qaij gpnh pxph'),
          },
        },
        defaults: {
          from: configService.get<string>('MAIL_FROM', '"Missing Person System" <no-reply@mprsystem.com>'),
        },
      }),
    }),

    VolunteerModule,
    CaseOfficerModule,
    AdminModule,
    MprModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }