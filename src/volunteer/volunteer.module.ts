import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerEntity } from './volunteer.entity';
import { Admin } from '../admin/admin.entity';
import { Mpr } from '../missing_person_reporter/mpr.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({

  imports: [
    TypeOrmModule.forFeature([VolunteerEntity, Admin, Mpr]),
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
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}