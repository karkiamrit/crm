import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;
          if (request?.cookies?.Authentication) {
            token = request?.cookies?.Authentication;
          } else if (request?.Authentication) {
            token = request?.Authentication;
          } else {
            token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          }

          console.log(`Accessing token from request: ${token}`);
          return token;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    const user = this.usersService.getOne({ id: userId });
    return user;
  }
}
