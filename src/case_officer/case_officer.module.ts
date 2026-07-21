import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseOfficerController } from './case_officer.controller';
import { CaseOfficerService } from './case_officer.service';
import { CaseOfficerEntity } from './case_officer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaseOfficerEntity])],
  controllers: [CaseOfficerController],
  providers: [CaseOfficerService],
})
export class CaseOfficerModule {}
