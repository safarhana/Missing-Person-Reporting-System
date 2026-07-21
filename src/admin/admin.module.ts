import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],

  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}