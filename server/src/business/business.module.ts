import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
