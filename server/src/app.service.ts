import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Business } from './interfaces/business';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  // TODO split into more methods or even services
  // TODO make data returned to frontend to be useful for FE
  async findAll(search: string): Promise<Business[]> {
    const url = 'https://storage.googleapis.com/coding-session-rest-api/';
    const response = await Promise.all([
      this.httpService.axiosRef.get(url + 'GXvPAor1ifNfpF0U5PTG0w'),
      this.httpService.axiosRef.get(url + 'ohGSnJtMIC5nPfYRi_HTAg'),
    ]);
    const businesses = response.map((res) => res.data);
    if (!search) return businesses;
    return businesses.filter(
      (business) => business.displayed_what.toLowerCase().indexOf(search) > -1,
    );
  }
}
