import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { FAKE_API_URL, FakeApiService } from './fake-api.service';
import { businessOneRaw, businessTwoRaw } from '../../test/mocks';
import { BusinessRaw } from 'src/business/business.interface';

describe('FakeApiService', () => {
  let fakeApiService: FakeApiService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FakeApiService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    fakeApiService = module.get<FakeApiService>(FakeApiService);
    httpService = module.get(HttpService);
  });

  describe('load', () => {
    it('should return promise with business', () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: businessOneRaw,
        status: 200,
      });
      const getSpy = jest.spyOn(httpService, 'axiosRef');

      const result = fakeApiService.load(businessOneRaw.local_entry_id);

      expect(result).resolves.toEqual(businessOneRaw);
      expect(getSpy).toHaveBeenCalledWith({
        url: `${FAKE_API_URL}GXvPAor1ifNfpF0U5PTG0w`,
        method: 'GET',
      });
    });

    it('should throw an error', () => {
      httpService.axiosRef.mockRejectedValueOnce('fake API error message');

      const result = fakeApiService.load(businessOneRaw.local_entry_id);
      expect(result).rejects.toBe('fake API error message');
    });
  });

  describe('loadAll', () => {
    it('should return promise with collection of 2 businesses', () => {
      const loadSpy = jest
        .spyOn(fakeApiService, 'load')
        .mockImplementation((id: string): Promise<BusinessRaw> => {
          if (id === businessOneRaw.local_entry_id)
            return Promise.resolve(businessOneRaw);
          if (id === businessTwoRaw.local_entry_id)
            return Promise.resolve(businessTwoRaw);
        });

      expect(fakeApiService.loadAll()).resolves.toEqual([
        businessOneRaw,
        businessTwoRaw,
      ]);
      expect(loadSpy).toHaveBeenNthCalledWith(1, businessOneRaw.local_entry_id);
      expect(loadSpy).toHaveBeenNthCalledWith(2, businessTwoRaw.local_entry_id);
    });

    it('should throw an error', () => {
      const errorMessage = 'error message';
      jest
        .spyOn(fakeApiService, 'load')
        .mockImplementationOnce(
          (): Promise<BusinessRaw> => Promise.reject(errorMessage),
        );

      expect(fakeApiService.loadAll()).rejects.toBe(errorMessage);
    });
  });
});
