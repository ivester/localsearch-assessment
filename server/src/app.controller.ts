import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { Business } from './business/business.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('businesses')
  async getAllBusinesses(
    @Query('search') search?: string,
  ): Promise<Business[]> {
    return this.appService.findAll(search);
  }

  @Get('business/:id')
  async getBusiness(
    @Param('id') id: string,
  ): Promise<Business | NotFoundException> {
    return this.appService.get(id);
  }
}
