import { NOTIFICATIONS_SERVICE, User } from '@app/common';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersRepository } from './users/users.repository';
import { OtpService } from './otp/otp.service';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly otpService: OtpService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return token;
  }

  async requestOtpVerify(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const otp = await this.otpService.create(user);
    this.notificationsService
      .send('send_otp', { email, otpCode: otp.code })
      .subscribe();
    return true;
  }

  async verifyOtp(otpCode: string, email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const otp = await this.otpService.getOne(otpCode, user);
    if (!otp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (otp.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }
    if (otp.is_used) {
      throw new BadRequestException('OTP already used');
    }
    otp.is_used = true;
    await this.otpService.update(otp, otp.id);

    user.isVerified = true;
    await this.usersRepository.findOneAndUpdate(
      { id: user.id },
      { isVerified: true },
    );
    return true;
  }

  private generateResetPasswordToken(user: User): string {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const resetPasswordToken = this.generateResetPasswordToken(user);
    const resetPasswordUrl = `${this.configService.get('FULL_WEB_URL')}/reset-password/${resetPasswordToken}`;
    this.notificationsService
      .send('send_reset_password', { email, resetPasswordUrl })
      .subscribe();
    return true;
  }

  async resetPassword(token: string, password: string): Promise<boolean> {
    const payload = this.jwtService.verify(token);
    const user = await this.usersRepository.findOne({ id: payload.userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = user.id;
    await this.usersRepository.findOneAndUpdate(
      { id },
      { password: hashedPassword },
    );
    return true;
  }
}
