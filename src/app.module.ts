import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';

import { VolunteerModule } from './volunteer/volunteer.module';
import { CaseOfficerModule } from './case_officer/case_officer.module';
import { MprModule } from './missing_person_reporter/mpr.module';

@Module({
  imports: [
    VolunteerModule,
    CaseOfficerModule,
    AdminModule,
    MprModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


