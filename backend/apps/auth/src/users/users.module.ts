import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, Role, User } from '@app/common';
import { UsersRepository } from './users.repository';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RolesRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
