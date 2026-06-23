import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MprModule } from './missing_person_reporter/mpr.module';

@Module({
  imports: [MprModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}