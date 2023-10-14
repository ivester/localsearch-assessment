import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { BusinessService } from './business/business.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [BusinessService],
})
export class AppModule {}
