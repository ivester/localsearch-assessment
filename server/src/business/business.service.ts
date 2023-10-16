import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  Business,
  BusinessRaw,
  Contact,
  Day,
  OpeningHoursRaw,
  openingHour,
} from './business.interface';

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

  async loadAll(): Promise<BusinessRaw[]> {
    const response = await Promise.all([
      // From what I can see, there is no search endpoint on the fake API or "get all businesses"
      // Checking https://storage.googleapis.com/coding-session-rest-api/ shows only two businesses,
      // therefore I am manually loading these two businesses with two separate get requests
      this.load('GXvPAor1ifNfpF0U5PTG0w'),
      this.load('ohGSnJtMIC5nPfYRi_HTAg'),
    ]);

    return response.map((res) => res);
  }

  async load(id: string): Promise<BusinessRaw> {
    const url = `https://storage.googleapis.com/coding-session-rest-api/${id}`;
    const { data } = await this.httpService.axiosRef.get<BusinessRaw>(url);

    return data;
  }

  processBusiness(business: BusinessRaw): Business {
    const url = this.getContact(business, 'url');
    const phone = this.getContact(business, 'phone');

    return {
      id: business.local_entry_id,
      name: business.displayed_what,
      where: business.displayed_where,
      openingHours: this.processOpeningHours(business.opening_hours),
      url: url?.url,
      urlFormatted: url?.formatted_service_code,
      phone: phone?.phone_number,
      phoneFormatted: phone?.formatted_service_code,
    };
  }

  getContact(business: BusinessRaw, contactType: string): Contact | undefined {
    return business.addresses[0].contacts.find(
      (contact) => contact.contact_type === contactType,
    );
  }

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

  async findAll(search: string): Promise<Business[]> {
    const businessesRaw = await this.loadAll();
    const businesses = businessesRaw.map((business) =>
      this.processBusiness(business),
    );
    if (!search) return businesses;

    return businesses.filter(
      (business) =>
        business.name.toLowerCase().indexOf(search) > -1 ||
        business.where.toLowerCase().indexOf(search) > -1,
    );
  }

  async get(id: string): Promise<Business> {
    // TODO error handling if id did not return any data
    const businessRaw = await this.load(id);
    const businesses = this.processBusiness(businessRaw);

    return businesses;
  }
}
