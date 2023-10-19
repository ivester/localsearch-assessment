import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService, FAKE_API_URL } from './business.service';
import {
  AddressRaw,
  Business,
  BusinessRaw,
  ContactRaw,
  OpeningHoursRaw,
  openingHour,
} from './business.interface';

// --- Input Data Mocks ---

const businessOneRaw: BusinessRaw = {
  local_entry_id: 'GXvPAor1ifNfpF0U5PTG0w',
  displayed_what: 'Business name 1',
  displayed_where: 'Address 1',
};

const businessTwoRaw: BusinessRaw = {
  local_entry_id: 'ohGSnJtMIC5nPfYRi_HTAg',
  displayed_what: 'Business name 2',
  displayed_where: 'Address 2',
};

const contactUrlRaw: ContactRaw = {
  contact_type: 'url',
  formatted_service_code: 'formatted url 1',
  url: 'url 1',
};
const contactPhoneRaw: ContactRaw = {
  contact_type: 'phone',
  formatted_service_code: 'formatted phone number 1',
  phone_number: 'phone number 1',
};

const addressesOneRaw: AddressRaw[] = [
  { contacts: [contactUrlRaw, contactPhoneRaw] },
];

// --- Output Data Mocks ---

const openingHoursAllClosed: openingHour[] = [
  { day: 'monday', hours: [], id: 0 },
  { day: 'tuesday', hours: [], id: 1 },
  { day: 'wednesday', hours: [], id: 2 },
  { day: 'thursday', hours: [], id: 3 },
  { day: 'friday', hours: [], id: 4 },
  { day: 'saturday', hours: [], id: 5 },
  { day: 'sunday', hours: [], id: 6 },
];

const businessOne: Business = {
  id: businessOneRaw.local_entry_id,
  name: businessOneRaw.displayed_what,
  where: businessOneRaw.displayed_where,
  openingHours: openingHoursAllClosed,
};

const businessOneAddresses: Partial<Business> = {
  url: contactUrlRaw.url,
  urlFormatted: contactUrlRaw.formatted_service_code,
  phone: contactPhoneRaw.phone_number,
  phoneFormatted: contactPhoneRaw.formatted_service_code,
};

// --- Tests ---

describe('BusinessService', () => {
  let businessService: BusinessService;
  let httpService: DeepMocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();

    businessService = module.get<BusinessService>(BusinessService);
    httpService = module.get(HttpService);
  });

  describe('loadAll', () => {
    it('should return promise with collection of 2 businesses', () => {
      const loadSpy = jest
        .spyOn(businessService, 'load')
        .mockImplementation((id: string): Promise<BusinessRaw> => {
          if (id === businessOneRaw.local_entry_id)
            return Promise.resolve(businessOneRaw);
          if (id === businessTwoRaw.local_entry_id)
            return Promise.resolve(businessTwoRaw);
        });

      expect(businessService.loadAll()).resolves.toEqual([
        businessOneRaw,
        businessTwoRaw,
      ]);
      expect(loadSpy).toHaveBeenNthCalledWith(1, businessOneRaw.local_entry_id);
      expect(loadSpy).toHaveBeenNthCalledWith(2, businessTwoRaw.local_entry_id);
    });

    it('should throw an error', () => {
      const errorMessage = 'businessService.load error';
      const loadSpy = jest
        .spyOn(businessService, 'load')
        .mockImplementationOnce(
          (): Promise<BusinessRaw> => Promise.reject(errorMessage),
        );

      expect(businessService.loadAll()).rejects.toBe(errorMessage);
      expect(loadSpy).toHaveBeenNthCalledWith(1, businessOneRaw.local_entry_id);
      expect(loadSpy).toHaveBeenNthCalledWith(2, businessTwoRaw.local_entry_id);
    });
  });

  describe('load', () => {
    it('should return promise with business', () => {
      httpService.axiosRef.mockResolvedValueOnce({
        data: businessOneRaw,
        status: 200,
      });
      const getSpy = jest.spyOn(httpService, 'axiosRef');

      const result = businessService.load(businessOneRaw.local_entry_id);

      expect(result).resolves.toEqual(businessOneRaw);
      expect(getSpy).toHaveBeenCalledWith({
        url: `${FAKE_API_URL}GXvPAor1ifNfpF0U5PTG0w`,
        method: 'GET',
      });
    });

    it('should throw an error', () => {
      httpService.axiosRef.mockRejectedValueOnce('fake API error message');

      const result = businessService.load(businessOneRaw.local_entry_id);
      expect(result).rejects.toBe('fake API error message');
    });
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
          .spyOn(businessService, 'loadAll')
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
          .spyOn(businessService, 'loadAll')
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
        .spyOn(businessService, 'load')
        .mockImplementation(
          (): Promise<BusinessRaw> => Promise.resolve(businessOneRaw),
        );

      expect(businessService.get('id')).resolves.toEqual(businessOne);
      expect(loadSpy).toHaveBeenCalledWith('id');
    });
    it('should throw an error due to api error', () => {
      const errorMessage = 'error message';
      const loadSpy = jest
        .spyOn(businessService, 'load')
        .mockImplementationOnce(
          (): Promise<BusinessRaw> => Promise.reject(errorMessage),
        );

      expect(businessService.get('id')).rejects.toBe(errorMessage);
      expect(loadSpy).toHaveBeenCalledWith('id');
    });
  });
});
