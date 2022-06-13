import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { HomesService } from 'src/homes/homes.service';
import { homesProviders } from 'src/homes/homes.providers';
import { CommonModule } from 'src/common/common.module';
import { HomeMembersModule } from 'src/home-members/home-members.module';
import { HomeTasksModule } from 'src/home-tasks/home-tasks.module';

@Module({
  imports: [DatabaseModule, CommonModule, HomeMembersModule, HomeTasksModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders, HomesService, ...homesProviders],
  exports: [UsersService],
})
export class UsersModule {}
