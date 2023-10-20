import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { FakeApiModule } from '../fake-api/fake-api.module';

@Module({
  imports: [FakeApiModule],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
