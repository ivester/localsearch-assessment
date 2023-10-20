import { Module } from '@nestjs/common';
import { FakeApiService } from './fake-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FakeApiService],
  exports: [FakeApiService],
})
export class FakeApiModule {}
