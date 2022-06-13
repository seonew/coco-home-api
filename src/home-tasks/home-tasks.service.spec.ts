import { Test, TestingModule } from '@nestjs/testing';
import { HomeTasksService } from './home-tasks.service';

describe('HomeTasksService', () => {
  let service: HomeTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeTasksService],
    }).compile();

    service = module.get<HomeTasksService>(HomeTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
