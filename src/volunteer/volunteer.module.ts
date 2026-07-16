import { Module } from '@nestjs/common';
import { VolunteerController } from './volunteer.controller';
import { VolunteerService } from './volunteer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteerEntity } from './volunteer.entity';

@Module({

  imports: [TypeOrmModule.forFeature([VolunteerEntity]),],
  controllers: [VolunteerController],
  providers: [VolunteerService],
})
export class VolunteerModule {}