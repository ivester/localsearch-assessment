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
    const module: TestingModule = await Test.createTestingModule({
      imports: [BusinessModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    businessService = module.get<BusinessService>(BusinessService);
  });

  describe('getAllBusinesses', () => {
    it('should be called with no query and return a promise with empty array', () => {
      const mockPromise = Promise.resolve([]);
      const findAllSpy = jest
        .spyOn(businessService, 'findAll')
        .mockImplementation((): Promise<Business[]> => mockPromise);

      const actualResult = appController.getAllBusinesses();

      expect(actualResult).resolves.toEqual([]);
      expect(findAllSpy).toHaveBeenCalledWith(undefined);
    });

    it('should be called with a query and return a promise with business collection', () => {
      const expectedQuery = 'query';
      const expectedResult = [
        { id: '1', name: 'Business 1', where: 'Address 1' },
        { id: '2', name: 'Business 2', where: 'Address 2' },
      ];
      const mockPromise = Promise.resolve(expectedResult);
      const findAllSpy = jest
        .spyOn(businessService, 'findAll')
        .mockImplementation((): Promise<Business[]> => mockPromise);

      const actualResult = appController.getAllBusinesses(expectedQuery);

      expect(actualResult).resolves.toEqual(expectedResult);
      expect(findAllSpy).toHaveBeenCalledWith(expectedQuery);
    });

    it('should throw an error', () => {
      const mockPromise = Promise.reject('error message');
      const findAllSpy = jest
        .spyOn(businessService, 'findAll')
        .mockImplementation((): Promise<Business[]> => mockPromise);

      expect(appController.getAllBusinesses()).rejects.toEqual('error message');
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('getBusiness', () => {
    it('should return a business', () => {
      const expectedResult = {
        id: '1',
        name: 'Business 1',
        where: 'Address 1',
      };
      const getSpy = jest
        .spyOn(businessService, 'get')
        .mockImplementation(
          (): Promise<Business> => Promise.resolve(expectedResult),
        );

      expect(appController.getBusiness('1')).resolves.toEqual(expectedResult);
      expect(getSpy).toHaveBeenCalledWith('1');
    });

    it('should throw an error due to fake API error', () => {
      const getSpy = jest
        .spyOn(businessService, 'get')
        .mockImplementation(
          (): Promise<Business> => Promise.reject('error message'),
        );

      expect(appController.getBusiness('1')).rejects.toEqual('error message');
      expect(getSpy).toHaveBeenCalledWith('1');
    });
  });
});
