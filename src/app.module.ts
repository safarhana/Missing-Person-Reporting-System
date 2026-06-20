import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaseOfficerModule } from './case_officer/case_officer.module';

@Module({
  imports: [CaseOfficerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
