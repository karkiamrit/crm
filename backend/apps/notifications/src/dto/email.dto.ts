import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class otpEmailDto {
  @ApiProperty({ description: 'The email to send the OTP to.', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The OTP code.', example: '123456' })
  @IsString()
  otpCode: string;
}

export class resetPasswordEmailDto {
  @ApiProperty({ description: 'The email to send the reset password link to.', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The reset password URL.', example: 'localhost:3000/reset-password?myresetpassurl' })
  @IsString()
  resetPasswordUrl: string;
}