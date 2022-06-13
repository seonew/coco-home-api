import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RefrigeratorFoodsController } from './refrigerator-foods.controller';
import { RefrigeratorFoodsService } from './refrigerator-foods.service';
import { refrigeratorFoodsProviders } from './refrigerator-foods.providers';
import { HomesService } from 'src/homes/homes.service';
import { homesProviders } from 'src/homes/homes.providers';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { HomeTasksModule } from 'src/home-tasks/home-tasks.module';
import { HomeMembersModule } from 'src/home-members/home-members.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    UsersModule,
    HomeMembersModule,
    HomeTasksModule,
  ],
  controllers: [RefrigeratorFoodsController],
  providers: [
    RefrigeratorFoodsService,
    ...refrigeratorFoodsProviders,
    HomesService,
    ...homesProviders,
  ],
  exports: [RefrigeratorFoodsService],
})
export class RefrigeratorFoodsModule {}
