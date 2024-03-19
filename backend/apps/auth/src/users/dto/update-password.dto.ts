import { IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'The old password.', example: 'OldPassword123!' })
  @IsStrongPassword()
  oldPassword: string;

  @ApiProperty({ description: 'The new password.', example: 'NewPassword123!' })
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({ description: 'The confirmed new password.', example: 'NewPassword123!' })
  @IsStrongPassword()
  confirmedNewPassword: string;
}