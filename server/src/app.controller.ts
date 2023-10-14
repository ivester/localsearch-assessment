import { Controller, Get, Query } from '@nestjs/common';
import { Business } from './business/business.interface';
import { BusinessService } from './business/business.service';

@Controller()
export class AppController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('businesses')
  getAllBusiness(@Query('search') search): Promise<Business[]> {
    return this.businessService.findAll(search);
  }
}
