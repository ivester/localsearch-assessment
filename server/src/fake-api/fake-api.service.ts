import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BusinessRaw } from '../business/business.interface';

export const FAKE_API_URL =
  'https://storage.googleapis.com/coding-session-rest-api/';

@Injectable()
export class FakeApiService {
  constructor(private readonly httpService: HttpService) {}

  // load a single business by business id from fake API
  async load(id: string): Promise<BusinessRaw> {
    const { data } = await this.httpService.axiosRef<BusinessRaw>({
      url: `${FAKE_API_URL}${id}`,
      method: `GET`,
    });

    return data;
  }

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
}
