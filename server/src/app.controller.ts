import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // TODO add query params to search by name or address
  // TODO use Business[] interface
  async getAllBusiness(): Promise<any> {
    const { data } = await this.appService.findAll();
    return data;
  }
}
