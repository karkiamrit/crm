import { Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { User } from '@app/common';
import { Otp } from './entities/otp.entity';

@Injectable()
export class OtpService {
  constructor(private readonly otpRepository: OtpRepository) {}

  async create(user: User): Promise<Otp> {
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 15 * 60000);
    const otp = new Otp({
      code: otpCode,
      user: user,
      expiresAt: expiresAt,
    });
    this.otpRepository.create(otp);
    return otp;
  }

  async getOne(otpCode: string, user: User): Promise<Otp> {
    return await this.otpRepository.findOne({ code: otpCode, user: user });
  }

  async update(otp: Otp, id: number): Promise<Otp> {
    return await this.otpRepository.findOneAndUpdate({ id }, otp);
  }
}
