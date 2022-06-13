import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DatabaseModule } from 'src/database/database.module';
import { homeMembersProviders } from './home-members.providers';
import { HomeMembersService } from './home-members.service';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [],
  providers: [HomeMembersService, ...homeMembersProviders],
  exports: [HomeMembersService],
})
export class HomeMembersModule {}
