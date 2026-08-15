import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CaseOfficerController } from './case_officer.controller';
import { CaseOfficerService } from './case_officer.service';
import { CaseOfficerEntity } from './case_officer.entity';
import { CaseReportEntity } from './case_report.entity';
import { Admin } from '../admin/admin.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CaseOfficerEntity,
      CaseReportEntity,
      Admin,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'case_officer_jwt_secret_key_2026'),
        signOptions: {
          expiresIn: configService.get<any>('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('MAIL_PORT', 465),
          ignoreTLS: true,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
      }),
    }),
  ],
  controllers: [CaseOfficerController],
  providers: [CaseOfficerService, JwtAuthGuard],
  exports: [CaseOfficerService, JwtAuthGuard, JwtModule],
  providers: [CaseOfficerService],
  exports: [CaseOfficerService],
})
export class CaseOfficerModule {}
