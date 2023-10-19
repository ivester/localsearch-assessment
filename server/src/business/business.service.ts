import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  Business,
  BusinessRaw,
  ContactRaw,
  ContactType,
  Day,
  OpeningHoursRaw,
  openingHour,
} from './business.interface';

export const FAKE_API_URL =
  'https://storage.googleapis.com/coding-session-rest-api/';

const weekDays: Day[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

@Injectable()
export class BusinessService {
  constructor(private readonly httpService: HttpService) {}

  // load all businesses from fake API
  async loadAll(): Promise<BusinessRaw[]> {
    const response = await Promise.all([
      // From what I can see, there is no search endpoint on the fake API or "get all businesses"
      // Checking https://storage.googleapis.com/coding-session-rest-api/ shows only two businesses,
      // therefore I am manually loading these two businesses with two separate get requests
      this.load('GXvPAor1ifNfpF0U5PTG0w'),
      this.load('ohGSnJtMIC5nPfYRi_HTAg'),
    ]);

    return response;
  }

  // load a single business by business id from fake API
  async load(id: string): Promise<BusinessRaw> {
    const { data } = await this.httpService.axiosRef<BusinessRaw>({
      url: `${FAKE_API_URL}${id}`,
      method: `GET`,
    });

    return data;
  }

  // process data returned from fake API to be used by the frontend
  processBusiness(business: BusinessRaw): Business {
    const url = this.getContact(business, 'url');
    const phone = this.getContact(business, 'phone');

    return {
      id: business.local_entry_id,
      name: business.displayed_what,
      where: business.displayed_where,
      openingHours: this.processOpeningHours(business?.opening_hours),
      url: url?.url,
      urlFormatted: url?.formatted_service_code,
      phone: phone?.phone_number,
      phoneFormatted: phone?.formatted_service_code,
    };
  }

  // helper function to get a specific contact by type
  // from the business data returned from the fake API
  getContact(
    business: BusinessRaw,
    contactType: ContactType,
  ): ContactRaw | undefined {
    return business.addresses?.[0]?.contacts.find(
      (contact) => contact.contact_type === contactType,
    );
  }

  // Process opening hours from the business data returned by the fake API
  // and create a data structure which is easier to use by the frontend.
  // Also make sure every day is present, even if there are no opening hours
  // for that day in the data returned from the fake API
  processOpeningHours(
    openingHours: OpeningHoursRaw | undefined,
  ): openingHour[] {
    return weekDays.map(
      (day, index): openingHour => ({
        id: index,
        day,
        hours:
          openingHours?.days[day]?.map((hour) => ({
            start: hour.start,
            end: hour.end,
          })) || [],
      }),
    );
  }

  // Get all businesses which match the search query
  // and transform the data structure to make it easy to use by the frontend.
  // Return all the businesses if no search query is provided.
  async findAll(search?: string): Promise<Business[]> {
    const businessesRaw = await this.loadAll();
    const businesses = businessesRaw.map((business) =>
      this.processBusiness(business),
    );
    if (!search) return businesses;

    return businesses.filter(
      (business) =>
        business.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        business.where.toLowerCase().indexOf(search.toLowerCase()) > -1,
    );
  }

  // get a single business by id and transform the data structure
  // to make it easy to use by the frontend
  async get(id: string): Promise<Business> {
    const businessRaw = await this.load(id);
    const businesses = this.processBusiness(businessRaw);

    return businesses;
  }
}
