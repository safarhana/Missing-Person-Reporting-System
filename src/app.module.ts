import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from './admin/admin.module';
import { VolunteerModule } from './volunteer/volunteer.module';
import { CaseOfficerModule } from './case_officer/case_officer.module';
import { MprModule } from './missing_person_reporter/mpr.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysql',
      database: 'missing_person_reporting_system',
      autoLoadEntities: true,
      synchronize: true,
    }),

   
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: 'remondwasi24@gmail.com', 
          pass: 'mimg qaij gpnh pxph',   
        },
      },
      defaults: {
        from: '"Missing Person System" <no-reply@mprsystem.com>',
      },
    }),

    VolunteerModule,
    CaseOfficerModule,
    AdminModule,
    MprModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}