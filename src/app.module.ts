import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VolunteerModule } from './volunteer/volunteer.module';


@Module({
  imports: [VolunteerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
