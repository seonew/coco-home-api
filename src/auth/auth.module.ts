import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { HomesModule } from 'src/homes/homes.module';
import { HomeMembersModule } from 'src/home-members/home-members.module';
import { HomeTasksModule } from 'src/home-tasks/home-tasks.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    UsersModule,
    HomesModule,
    HomeMembersModule,
    HomeTasksModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
