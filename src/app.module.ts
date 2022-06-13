import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HomesModule } from './homes/homes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { HomeMembersModule } from './home-members/home-members.module';
import { HomeTasksModule } from './home-tasks/home-tasks.module';
import { RefrigeratorFoodsModule } from './refrigerator-foods/refrigerator-foods.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HomesModule,
    HomeMembersModule,
    HomeTasksModule,
    UsersModule,
    RefrigeratorFoodsModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
