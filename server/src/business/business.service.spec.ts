import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import {
  BusinessRaw,
  openingHour,
  OpeningHoursRaw,
} from './business.interface';
import {
  addressesOneRaw,
  businessOne,
  businessOneAddresses,
  businessOneRaw,
  businessTwoRaw,
  contactPhoneRaw,
  contactUrlRaw,
  openingHoursAllClosed,
} from './../../test/mocks';
import { FakeApiService } from '../fake-api/fake-api.service';
import { FakeApiModule } from '../fake-api/fake-api.module';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BusinessService', () => {
  let fakeApiService: FakeApiService;
  let businessService: BusinessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FakeApiModule],
      providers: [BusinessService],
    }).compile();

    fakeApiService = module.get<FakeApiService>(FakeApiService);
    businessService = module.get<BusinessService>(BusinessService);
  });

  describe('processBusiness', () => {
    it('should return a minimal business object', () => {
      const result = businessService.processBusiness(businessOneRaw);

      expect(result).toEqual(businessOne);
    });

    it('should return a business object with all the possible props', () => {
      const result = businessService.processBusiness({
        ...businessOneRaw,
        addresses: addressesOneRaw,
      });

      expect(result).toEqual({ ...businessOne, ...businessOneAddresses });
    });
  });

  describe('getContact', () => {
    it('should return undefined', () => {
      const businessOneRawAdressesEmpty: BusinessRaw = {
        ...businessOneRaw,
        addresses: [],
      };
      const businessOneAddressesNoUrl: BusinessRaw = {
        ...businessOneRaw,
        addresses: [{ contacts: [contactPhoneRaw] }],
      };

      expect(businessService.getContact(businessOneRaw, 'url')).toBeUndefined();
      expect(
        businessService.getContact(businessOneRawAdressesEmpty, 'url'),
      ).toBeUndefined();
      expect(
        businessService.getContact(businessOneAddressesNoUrl, 'url'),
      ).toBeUndefined();
    });

    it('should return the contact', () => {
      expect(
        businessService.getContact(
          { ...businessOneRaw, addresses: addressesOneRaw },
          'url',
        ),
      ).toEqual(contactUrlRaw);
    });
  });

  describe('processOpeningHours', () => {
    it('should return "Monday-Sunday: closed"', () => {
      expect(businessService.processOpeningHours(undefined)).toEqual(
        openingHoursAllClosed,
      );
    });

    it(`
      should return:
      * Monday: Closed
      * Tuesday - Friday: 11:30 - 15:00, 18:30 - 00:00
      * Saturday: 18:00 - 00:00
      * Sunday: 11:30 - 15:00
    `, () => {
      const openingHoursRaw: OpeningHoursRaw = {
        days: {
          tuesday: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          wednesday: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          thursday: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          friday: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          saturday: [{ start: '18:00', end: '00:00' }],
          sunday: [{ start: '11:30', end: '15:00' }],
        },
      };
      const openingHours: openingHour[] = [
        { day: 'monday', hours: [], id: 0 },
        {
          day: 'tuesday',
          hours: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          id: 1,
        },
        {
          day: 'wednesday',
          hours: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          id: 2,
        },
        {
          day: 'thursday',
          hours: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          id: 3,
        },
        {
          day: 'friday',
          hours: [
            { start: '11:30', end: '15:00' },
            { start: '18:30', end: '00:00' },
          ],
          id: 4,
        },
        { day: 'saturday', hours: [{ start: '18:00', end: '00:00' }], id: 5 },
        { day: 'sunday', hours: [{ start: '11:30', end: '15:00' }], id: 6 },
      ];

      expect(businessService.processOpeningHours(openingHoursRaw)).toEqual(
        openingHours,
      );
    });

    it(`
    should return:
    * Monday - Friday: 11:30 - 14:00, 18:30 - 22:00
    * Saturday - Sunday: Closed
  `, () => {
      const openingHoursRaw: OpeningHoursRaw = {
        days: {
          monday: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          tuesday: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          wednesday: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          thursday: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          friday: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
        },
      };
      const openingHours: openingHour[] = [
        {
          day: 'monday',
          hours: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          id: 0,
        },
        {
          day: 'tuesday',
          hours: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          id: 1,
        },
        {
          day: 'wednesday',
          hours: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          id: 2,
        },
        {
          day: 'thursday',
          hours: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          id: 3,
        },
        {
          day: 'friday',
          hours: [
            { start: '11:30', end: '14:00' },
            { start: '18:30', end: '22:00' },
          ],
          id: 4,
        },
        { day: 'saturday', hours: [], id: 5 },
        { day: 'sunday', hours: [], id: 6 },
      ];

      expect(businessService.processOpeningHours(openingHoursRaw)).toEqual(
        openingHours,
      );
    });
  });

  describe('findAll', () => {
    describe('with valid return value from loadAll', () => {
      let loadAllSpy: jest.SpyInstance;

      beforeEach(() => {
        loadAllSpy = jest
          .spyOn(fakeApiService, 'loadAll')
          .mockResolvedValue([businessOneRaw, businessTwoRaw]);
      });

      describe('should return all businesses', () => {
        it('when search query undefined', async () => {
          const result = await businessService.findAll();

          expect(result.length).toEqual(2);
          expect(result[0].id).toEqual(businessOneRaw.local_entry_id);
          expect(result[1].id).toEqual(businessTwoRaw.local_entry_id);
          expect(loadAllSpy).toHaveBeenCalledTimes(1);
        });

        it('when search query empty string', async () => {
          const result = await businessService.findAll('');

          expect(result.length).toEqual(2);
          expect(result[0].id).toEqual(businessOneRaw.local_entry_id);
          expect(result[1].id).toEqual(businessTwoRaw.local_entry_id);
        });

        it('when search query matches all business names', async () => {
          const result = await businessService.findAll('Business name');

          expect(result.length).toEqual(2);
          expect(result[0].id).toEqual(businessOneRaw.local_entry_id);
          expect(result[1].id).toEqual(businessTwoRaw.local_entry_id);
        });

        it('when search query matches all addresses', async () => {
          const result = await businessService.findAll('Address');

          expect(result.length).toEqual(2);
          expect(result[0].id).toEqual(businessOneRaw.local_entry_id);
          expect(result[1].id).toEqual(businessTwoRaw.local_entry_id);
        });
      });

      describe('should return one business', () => {
        it('when query matches business one', async () => {
          const result = await businessService.findAll('1');

          expect(result.length).toEqual(1);
          expect(result[0].id).toEqual(businessOneRaw.local_entry_id);
        });

        it('when query matches business two', async () => {
          const result = await businessService.findAll('2');

          expect(result.length).toEqual(1);
          expect(result[0].id).toEqual(businessTwoRaw.local_entry_id);
        });
      });

      describe('should return no business', () => {
        it('when query matches no business', async () => {
          const result = await businessService.findAll('3');

          expect(result.length).toEqual(0);
        });
      });
    });

    describe('with error from loadAll', () => {
      it('should throw an error', () => {
        const errorMessage = 'businessService.loadAll error';
        const loadAllSpy = jest
          .spyOn(fakeApiService, 'loadAll')
          .mockImplementationOnce(
            (): Promise<BusinessRaw[]> => Promise.reject(errorMessage),
          );

        expect(businessService.findAll()).rejects.toBe(errorMessage);
        expect(loadAllSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('get', () => {
    it('should return a business', () => {
      const loadSpy = jest
        .spyOn(fakeApiService, 'load')
        .mockImplementation(
          (): Promise<BusinessRaw> => Promise.resolve(businessOneRaw),
        );

      expect(businessService.get('id')).resolves.toEqual(businessOne);
      expect(loadSpy).toHaveBeenCalledWith('id');
    });

    it('should throw an error if business id does not exist', () => {
      class ApiError extends Error {
        response: { status: number };
        constructor(message: string, status: number) {
          super(message);
          this.response = { status };
        }
      }

      const businessId = '1';
      const errorMessage = `business with id ${businessId} not found`;
      const error = new ApiError(errorMessage, 404);
      const loadSpy = jest
        .spyOn(fakeApiService, 'load')
        .mockImplementationOnce(
          (): Promise<BusinessRaw> => Promise.reject(error),
        );

      expect(businessService.get(businessId)).rejects.toEqual(
        new NotFoundException(errorMessage),
      );
      expect(loadSpy).toHaveBeenCalledWith(businessId);
    });

    it('should throw an error if something else went wrong', () => {
      const errorMessage = 'error message';
      const loadSpy = jest
        .spyOn(fakeApiService, 'load')
        .mockImplementationOnce(
          (): Promise<BusinessRaw> => Promise.reject(errorMessage),
        );

      expect(businessService.get('1')).rejects.toEqual(
        new BadRequestException(errorMessage),
      );
      expect(loadSpy).toHaveBeenCalledWith('1');
    });
  });
});
