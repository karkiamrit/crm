import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationsDto } from './dto/create-organization.dto';
import { UpdateOrganizationsDto } from './dto/update-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsRepository } from './organization.repository';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ExtendedFindOptions, User } from '@app/common';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
    @Inject(AUTH_SERVICE)
    private readonly usersService: ClientProxy,
  ) {}

  async create(createOrganizationsDto: CreateOrganizationsDto) {
    const organization = new Organization(createOrganizationsDto);
    console.log(organization);
    return await this.organizationsRepository.create(organization);
  }

  async update(id: number, updateOrganizationsDto: UpdateOrganizationsDto) {
    return this.organizationsRepository.findOneAndUpdate(
      { id },
      updateOrganizationsDto,
    );
  }

  async delete(id: number) {
    return this.organizationsRepository.findOneAndDelete({ id });
  }

  async findAll(
    options: ExtendedFindOptions<Organization>,
  ): Promise<Organization[]> {
    return this.organizationsRepository.findAll(options);
  }

  async getOne(id: number) {
    return this.organizationsRepository.findOne({ id });
  }

  async getUsersByOrganizationId(
    organizationId: number,
    options: ExtendedFindOptions<User>,
  ): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.usersService
        .send<User[]>('get_all_users_by_organization_id', { where: { organizationId }, options })
        .subscribe({
          next: (users) => resolve(users),
          error: (error) => reject(error),
        });
    });
  }

  async updateLogo(
    organizationId: number,
    filePath: string,
  ): Promise<Organization> {
    // const organization = await this.organizationsRepository.findOne({id: organizationId});
    console.log('filePath', filePath);
    const organization = await this.organizationsRepository.findOneAndUpdate(
      { id: organizationId },
      { logo: filePath },
    );
    console.log(organization);
    return organization;
  }
}
