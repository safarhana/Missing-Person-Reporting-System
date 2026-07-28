import { Module } from '@nestjs/common';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerEntity } from './volunteer.entity';
import { Admin } from '../admin/admin.entity';
import { Mpr } from '../missing_person_reporter/mpr.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({

  imports: [TypeOrmModule.forFeature([VolunteerEntity, Admin, Mpr]),
   MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        //service: 'gmail',
        auth: {
          user: 'tahmidturag95@gmail.com',
          pass: 'aogx eclj dikg egts',
        },
      },
    }),

],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}