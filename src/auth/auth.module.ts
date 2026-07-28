import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { Admin } from '../admin/admin.entity';
import { VolunteerEntity } from '../volunteer/volunteer.entity';

@Module({
  imports: [
  
    PassportModule.register({
  defaultStrategy: 'jwt',
}),
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: {
        expiresIn: '1h',
      },
    }),

    TypeOrmModule.forFeature([Admin, VolunteerEntity]),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [
    JwtModule,
    AuthService,
  ],
})
export class AuthModule {}