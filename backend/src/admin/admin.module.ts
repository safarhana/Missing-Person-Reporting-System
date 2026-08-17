import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Admin } from './admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import { VolunteerEntity } from '../volunteer/volunteer.entity';
import { CaseOfficerEntity } from '../case_officer/case_officer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      VolunteerEntity,
      CaseOfficerEntity,
    ]),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          ignoreTLS: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
      }),
    }),
  ],

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}