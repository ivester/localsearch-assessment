import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Business,
  BusinessRaw,
  ContactRaw,
  ContactType,
  Day,
  OpeningHoursRaw,
  openingHour,
} from './business.interface';
import { FakeApiService } from '../fake-api/fake-api.service';

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
  constructor(private readonly fakeApiService: FakeApiService) {}

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
    const businessesRaw = await this.fakeApiService.loadAll();
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
  async get(id: string): Promise<Business | NotFoundException> {
    try {
      const businessRaw = await this.fakeApiService.load(id);
      const businesses = this.processBusiness(businessRaw);
      return businesses;
    } catch (error: any) {
      if (error?.response?.status === 404)
        throw new NotFoundException(`business with id ${id} not found`);
      throw new BadRequestException(error);
    }
  }
}
