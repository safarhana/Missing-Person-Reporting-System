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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'mysql'),
        database: configService.get<string>('DB_DATABASE', 'missing_person_reporting_system'),
        autoLoadEntities: true,
        synchronize: true,
      }),
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