import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CaseOfficerModule } from './case_officer/case_officer.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [CaseOfficerModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


