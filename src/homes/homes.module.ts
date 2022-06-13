import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HomesController } from './homes.controller';
import { HomesService } from './homes.service';
import { homesProviders } from './homes.providers';
import { HomeMembersModule } from 'src/home-members/home-members.module';
import { HomeTasksModule } from 'src/home-tasks/home-tasks.module';
import { UsersModule } from 'src/users/users.module';
import { RefrigeratorFoodsModule } from 'src/refrigerator-foods/refrigerator-foods.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    DatabaseModule,
    HomeMembersModule,
    HomeTasksModule,
    UsersModule,
    RefrigeratorFoodsModule,
    CommonModule,
  ],
  controllers: [HomesController],
  providers: [HomesService, ...homesProviders],
  exports: [HomesService],
})
export class HomesModule {}
