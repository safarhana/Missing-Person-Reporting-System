import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // ExtractJwt.fromAuthHeaderAsBearerToken(),

        (request: any) => {
          return request?.cookies?.access_token;
        },
      ]),

      ignoreExpiration: false,

      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'mySecretKey',
      ),
    });
  }

  async validate(payload: any) {
    console.log('JWT PAYLOAD:', payload);

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}

