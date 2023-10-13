import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Business } from './interfaces/business';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('businesses')
  getAllBusiness(@Query('search') search): Promise<Business[]> {
    return this.appService.findAll(search);
  }
}
