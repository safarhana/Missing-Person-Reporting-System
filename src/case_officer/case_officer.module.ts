import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { CaseOfficerController } from './case_officer.controller';
import { CaseOfficerService } from './case_officer.service';
import { CaseOfficerEntity } from './case_officer.entity';
import { CaseReportEntity } from './case_report.entity';
import { Admin } from '../admin/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CaseOfficerEntity,
      CaseReportEntity,
      Admin,
    ]),
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
  providers: [CaseOfficerService],
  exports: [CaseOfficerService],
})
export class CaseOfficerModule {}
