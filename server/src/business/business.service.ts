import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Business, BusinessRaw } from './business.interface';

@Injectable()
export class BusinessService {
  constructor(private readonly httpService: HttpService) {}

  // TODO split into more methods or even services
  // TODO make data returned to frontend to be useful for FE
  async loadAll(): Promise<BusinessRaw[]> {
    const url = 'https://storage.googleapis.com/coding-session-rest-api/';
    const response = await Promise.all([
      this.httpService.axiosRef.get(url + 'GXvPAor1ifNfpF0U5PTG0w'),
      this.httpService.axiosRef.get(url + 'ohGSnJtMIC5nPfYRi_HTAg'),
    ]);
    return response.map((res) => res.data);
  }

  processData(businesses: BusinessRaw[]): Business[] {
    return businesses.map((business) => ({
      id: business.local_entry_id,
      name: business.displayed_what,
      where: business.displayed_where,
    }));
  }

  async findAll(search: string): Promise<Business[]> {
    const businessesRaw = await this.loadAll();
    const businesses = this.processData(businessesRaw);
    if (!search) return businesses;
    return businesses.filter(
      (business) =>
        business.name.toLowerCase().indexOf(search) > -1 ||
        business.where.toLowerCase().indexOf(search) > -1,
    );
  }
}
