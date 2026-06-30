import { Module } from '@nestjs/common';
import { CaseOfficerController } from './case_officer.controller';
import { CaseOfficerService } from './case_officer.service';

@Module({
  controllers: [CaseOfficerController],
  providers: [CaseOfficerService],
})
export class CaseOfficerModule {}
