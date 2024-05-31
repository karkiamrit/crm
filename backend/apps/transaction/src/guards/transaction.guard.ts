import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class TransactionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.query.token;
        try {
            const payload = verify(token, process.env.JWT_SECRET) as JwtPayload; // Add type assertion
            request.transactionId = payload.transactionId; // Add transactionId to the request object
            return true;
        } catch (e) {
            return false;
        }
    }
}