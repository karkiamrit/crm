import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      });
  }
}

// @Catch(BadRequestException)
// export class BadRequestExceptionFilter implements ExceptionFilter {
//   catch(exception: BadRequestException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     console.log(exception.getResponse()); // Log the validation errors

//     response.status(status).json({
//       statusCode: status,
//       timestamp: new Date().toISOString(),
//       path: request.url,
//       message: exception.message,
//     });
//   }
// }
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as Record<string, any>; // Add type assertion

    console.log(exceptionResponse); // Log the validation errors

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof exceptionResponse === 'object' ? exceptionResponse.message : exceptionResponse, // Use validation errors as message if it exists
    });
  }
}