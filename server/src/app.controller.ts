import { Controller, Get, Param, Query } from '@nestjs/common';
import { Business } from './business/business.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('business/:id')
  getBusiness(@Param('id') id: string): Promise<Business> {
    return this.appService.get(id);
    // TODO error handling - not found 404 - Or something else went wrong
  }

  @Get('businesses')
  getAllBusinesses(@Query('search') search?: string): Promise<Business[]> {
    return this.appService.findAll(search);
    // TODO error handling - something else went wrong
  }
}
