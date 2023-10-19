import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { BusinessModule } from './business/business.module';
import { AppService } from './app.service';
import { BusinessService } from './business/business.service';
import { Business } from './business/business.interface';

describe('AppController', () => {
  let appController: AppController;
  let businessService: BusinessService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [BusinessModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    businessService = app.get<BusinessService>(BusinessService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllBusinesses', () => {
    it('should return Promise with empty Array', () => {
      const expectedResult = new Promise<Business[]>((resolve) => resolve([]));
      const findAllSpy = jest
        .spyOn(businessService, 'findAll')
        .mockImplementation((): Promise<Business[]> => expectedResult);

      const actualResult = appController.getAllBusinesses();

      expect(actualResult).toBe(expectedResult);
      expect(findAllSpy).toHaveBeenCalledWith(undefined);
    });
  });
});
