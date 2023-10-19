import { Injectable } from '@nestjs/common';
import { BusinessService } from './business/business.service';
import { Business } from './business/business.interface';

@Injectable()
export class AppService {
  constructor(private readonly businessService: BusinessService) {}

  get(id: string): Promise<Business> {
    return this.businessService.get(id);
  }

  findAll(search?: string): Promise<Business[]> {
    return this.businessService.findAll(search);
  }
}
