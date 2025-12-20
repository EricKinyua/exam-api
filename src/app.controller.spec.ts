import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Health Check Test', () => {
    it('Should return a health check object', async () => {
      expect(await appController.healthCheck()).toEqual(
        expect.objectContaining({ status: 'up' }),
      );
    });
  });
});
