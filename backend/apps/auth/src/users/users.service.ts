import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserAdminDto, CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import {
  ExtendedFindOptions,
  ORGANIZATION_SERVICE,
  Role,
  User,
} from '@app/common';
import { Status } from '@app/common';
import { UpdateUserDto, UpdateUserDtoAdmin } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RolesRepository } from './roles.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
interface Organization {
  id: number;
  email: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    @Inject(ORGANIZATION_SERVICE)
    private readonly organizationsService: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.validateCreateUser(createUserDto);
    if (existingUser) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }
    const organizationId = createUserDto.organizationId;

    const organization = await firstValueFrom(
      this.organizationsService.send<Organization>('get_organization_by_id', {
        organizationId,
      }),
    );
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    const user = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
    user.status = Status.Live;
    user.isVerified = true; // remove in production
    let savedRole: Role;
    try {
      savedRole = await this.rolesRepository.findOne({ name: 'Admin' });
    } catch (error) {
      console.error('Error occurred while fetching role:', error);
    }
    if (!savedRole) {
      const role = new Role({ name: 'Admin' });
      try {
        savedRole = await this.rolesRepository.create(role);
      } catch (error) {
        console.error('Error occurred while creating role:', error);
      }
    }
    user.roles = [savedRole];

    let createdUser: User;
    try {
      createdUser = await this.usersRepository.create(user);
    } catch (error) {
      console.error('Error occurred while creating user:', error);
    }
    return createdUser;
  }

  async adminCreate(createUserAdminDto: CreateUserAdminDto) {
    const existingUser = await this.validateCreateUser(createUserAdminDto);
    if (existingUser) {
      throw new UnprocessableEntityException(
        'User with this email already exists',
      );
    }
    const organizationId = createUserAdminDto.organizationId;
    const organization = await firstValueFrom(
      this.organizationsService.send<Organization>('get_organization_by_id', {
        organizationId,
      }),
    );
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const user = new User({
      email: createUserAdminDto.email,
      password: await bcrypt.hash(createUserAdminDto.password, 10),
      organizationId: createUserAdminDto.organizationId,
      status: createUserAdminDto.status || Status.Live,
      isVerified: true,
    });

    const roles = [];
    for (const roleDto of createUserAdminDto.roles || []) {
      let savedRole: Role;
      try {
        savedRole = await this.rolesRepository.findOne({ name: roleDto.name });
      } catch (error) {
        console.error('Error occurred while fetching role:', error);
      }
      if (!savedRole) {
        const role = new Role({ name: roleDto.name });
        try {
          savedRole = await this.rolesRepository.create(role);
        } catch (error) {
          console.error('Error occurred while creating role:', error);
        }
      }
      roles.push(savedRole);
    }

    user.roles = roles;

    let createdUser: User;
    try {
      createdUser = await this.usersRepository.create(user);
    } catch (error) {
      console.error('Error occurred while creating user:', error);
    }

    return createdUser;
  }

  private async validateCreateUser(
    createUserDto: CreateUserDto | CreateUserAdminDto,
  ): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      console.error('Error occurred while validating user:', err);
      return null;
    }
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
    return this.usersRepository.findOneAndUpdate(
      { where: { id: id } },
      updateUserDto,
    );
  }

  async userUpdateAdmin(id: number, updateUserDtoAdmin: UpdateUserDtoAdmin) {
    const user = await this.usersRepository.findOne({ id: id });
    console.log(updateUserDtoAdmin);
    if (updateUserDtoAdmin.roles) {
      const roles = updateUserDtoAdmin.roles.map(
        (roleDto) => new Role(roleDto),
      );
      user.roles = roles;
      delete updateUserDtoAdmin.roles;
    }

    Object.assign(user, updateUserDtoAdmin);

    return this.usersRepository.findOneAndUpdate({ where: { id: id } }, user);
  }

  async updateUserRole(id: number, role: string) {
    let updatedRole: Role;
    try {
      updatedRole = await this.rolesRepository.findOne({ name: role });
    } catch (error) {
      const myrole = new Role({ name: role });
      updatedRole = await this.rolesRepository.create(myrole);
    }

    const user = await this.usersRepository.findOne({ id: id });
    console.log(updatedRole);
    console.log(user.roles);
    user.roles = user.roles.concat(updatedRole);

    return this.usersRepository.create(user);
  }

  async delete(id: number) {
    return this.usersRepository.findOneAndDelete({ id });
  }

  async findAll(options: ExtendedFindOptions<User>) {
    return this.usersRepository.findAll({ ...options, relations: ['roles'] });
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
      { where: { id: id } },
      { password: password },
    );
  }
}
