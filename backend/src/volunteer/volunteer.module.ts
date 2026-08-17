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
     
  ],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}