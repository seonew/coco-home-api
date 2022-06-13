import { Test, TestingModule } from '@nestjs/testing';
import { HomesController } from './homes.controller';

describe('HomesController', () => {
  let controller: HomesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomesController],
    }).compile();

    controller = module.get<HomesController>(HomesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
