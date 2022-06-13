import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DatabaseModule } from 'src/database/database.module';
import { homeTasksProviders } from './home-tasks.providers';
import { HomeTasksService } from './home-tasks.service';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [],
  providers: [HomeTasksService, ...homeTasksProviders],
  exports: [HomeTasksService],
})
export class HomeTasksModule {}
