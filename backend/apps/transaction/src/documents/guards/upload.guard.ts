import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class UploadGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.query.token;
    try {
      const payload = verify(token, process.env.JWT_SECRET) as JwtPayload; // Add type assertion

      if (payload.taskId) {
        request.taskId = payload.taskId;
      } else {
        request.transactionId = payload.transactionId;
      }
      // Add taskId to the request object
      return true;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
