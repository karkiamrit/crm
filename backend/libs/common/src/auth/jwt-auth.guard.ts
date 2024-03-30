import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, of, catchError, map, tap } from 'rxjs'; // Added 'of' import
import { AUTH_SERVICE } from '../constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@app/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let jwt: string;
    if (context.switchToHttp().getRequest().cookies?.Authentication) {
      jwt = context.switchToHttp().getRequest().cookies?.Authentication;
    } else {
      const authHeader = context.switchToHttp().getRequest()
        .headers?.authorization;
      if (!authHeader) {
        return false;
      }
      jwt = authHeader.split(' ')[1];
      console.log(jwt);
    }
    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          if (roles) {
            if (res.roles?.map((role) => role.name).includes('Admin')) {
              context.switchToHttp().getRequest().user = res;
              return;
            }
            for (const role of roles) {
              if (!res.roles?.map((role) => role.name).includes(role)) {
                // Corrected map function
                this.logger.error("The user doesn't have valid roles");
                throw new UnauthorizedException();
              }
            }
          }
          // if (roles) {
          //   const userRoles = res.roles?.map((role) => role.name);
          //   const hasRole = roles.some((role) => userRoles.includes(role));
          //   if (!hasRole) {
          //     this.logger.error("The user doesn't have valid roles");
          //     throw new UnauthorizedException();
          //   }
          // } // if or wanted in role
          context.switchToHttp().getRequest().user = res;
        }),
        //tap helps to execute side effects on the incoming response
        map(() => true), // returns true on success
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
