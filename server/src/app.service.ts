import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  // TODO make business interface --> Business[]
  async findAll(): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(
      'https://storage.googleapis.com/coding-session-rest-api/GXvPAor1ifNfpF0U5PTG0w',
    );
  }
}
