import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { ExtendedFindOptions, Role, User } from '@app/common';
import { Status } from '@app/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUser(createUserDto);
    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
    });
    user.status = Status.Live;
    return this.usersRepository.create(user);
  }

  private async validateCreateUser(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException('User already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (passwordIsValid === false) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isVerified === false) {
      throw new UnauthorizedException('Please verify before logging in');
    }
    return user;
  }

  async getOne(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.findOneAndUpdate({ id }, updateUserDto);
  }

  async delete(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<User>): Promise<User[]> {
    return this.usersRepository.findAll(options);
  }

  async changePassword(updatePasswordDto: UpdatePasswordDto, user: User) {
    const { oldPassword, newPassword, confirmedNewPassword } =
      updatePasswordDto;
    if (newPassword !== confirmedNewPassword) {
      throw new UnprocessableEntityException('Passwords do not match');
    }
    const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
    if (passwordIsValid === false) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const password = await bcrypt.hash(newPassword, 10);

    const id = user.id;
    return this.usersRepository.findOneAndUpdate(
      { id },
      { password: password },
    );
  }
}
