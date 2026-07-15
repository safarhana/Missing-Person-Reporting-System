import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { CaseOfficerModule } from './case_officer/case_officer.module';
import { MprModule } from './missing_person_reporter/mpr.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234', 
      database: 'volunteer_db', 

      autoLoadEntities: true,
      synchronize: true,
    }),
    VolunteerModule,
    CaseOfficerModule,
    AdminModule,
    MprModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


