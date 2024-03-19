import { Body, Controller, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, User } from '@app/common';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({
    description: 'Payload ( Replace existing string with desired value )',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        email: {
          example:'johndoe@gmail.com'
        },
        password: {
          example: '3857572676wwE#'
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Returns a JWT.', type: String })
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(user, response);
    response.send(jwt);
  }

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for email verification' })
  @ApiBody({
    description: 'email',
    type: 'object',
    schema: { type: 'object', properties: { email: { example:'johndoe@gmail.com' } } },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns true if the OTP was sent.',
    type: Boolean,
  })
  async requestOtpVerify(@Body('email') email: string): Promise<boolean> {
    return this.authService.requestOtpVerify(email);
  }


  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({
    description: 'Payload ( Replace existing string with desired value )',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'token',
        },
        otpCode: {
          type: 'string',
          description: 'password',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns true if the OTP was verified.',
    type: Boolean,
  })
  async verifyOtp(
    @Body('otpCode') otpCode: string,
    @Body('email') email: string,
  ): Promise<boolean> {
    return this.authService.verifyOtp(otpCode, email);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset ' })
  @ApiBody({
    description: 'email',
    type: 'object',
    schema: { type: 'object', properties: { email: { example: 'johndoe@gmail.com' } } },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns true if the reset link is sent.',
    type: Boolean,
  })
  async forgotPassword(@Body('email') email: string): Promise<boolean> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    description: 'Payload ( Replace existing string with desired value )',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'token',
        },
        password: {
          type: 'string',
          description: 'password',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Returns true if the reset was successful.',
    type: Boolean,
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 201, description: 'Returns Logged out message and clears cookie', type: String })
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    return 'Logged out';
  }
}
