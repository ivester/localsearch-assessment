import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FakeApiService } from '../src/fake-api/fake-api.service';
import { BusinessRaw } from 'src/business/business.interface';
import {
  businessOne,
  businessOneRaw,
  businessTwo,
  businessTwoRaw,
} from './mocks';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // faking the fake API to avoid and external requests
      .overrideProvider(FakeApiService)
      .useValue({
        loadAll: (): Promise<BusinessRaw[]> =>
          Promise.resolve([businessOneRaw, businessTwoRaw]),
        load: (): Promise<BusinessRaw> => Promise.resolve(businessOneRaw),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/businesses', () => {
    it('/businesses (GET)', () => {
      return request(app.getHttpServer())
        .get('/businesses')
        .expect(200)
        .expect([businessOne, businessTwo]);
    });

    describe('/businesses/?query', () => {
      describe('match by business name', () => {
        it('/businesses/?search=Business%20name (GET)', () => {
          return request(app.getHttpServer())
            .get('/businesses/?search=Business%20name')
            .expect(200)
            .expect([businessOne, businessTwo]);
        });

        it('/businesses/?search=Business%20name%201 (GET)', () => {
          return request(app.getHttpServer())
            .get('/businesses/?search=Business%20name%201')
            .expect(200)
            .expect([businessOne]);
        });

        it('/businesses/?search=Business%20name%202 (GET)', () => {
          return request(app.getHttpServer())
            .get('/businesses/?search=Business%20name%202')
            .expect(200)
            .expect([businessTwo]);
        });
      });

      describe('match by address', () => {
        it('/businesses/?search=address (GET)', () => {
          return request(app.getHttpServer())
            .get('/businesses/?search=address')
            .expect(200)
            .expect([businessOne, businessTwo]);
        });

        it('/businesses/?search=address%201 (GET)', () => {
          return request(app.getHttpServer())
            .get('/businesses/?search=address%201')
            .expect(200)
            .expect([businessOne]);
        });

        it('/businesses/?search=address%202 (GET)', () => {
          return request(app.getHttpServer())
            .get('/businesses/?search=address%202')
            .expect(200)
            .expect([businessTwo]);
        });
      });
    });
  });

  describe('/business', () => {
    it('/business (GET)', () => {
      return request(app.getHttpServer()).get('/business').expect(404).expect({
        message: 'Cannot GET /business',
        error: 'Not Found',
        statusCode: 404,
      });
    });

    describe('/business/:id', () => {
      it('/business/id (GET)', () => {
        return request(app.getHttpServer())
          .get('/business/id')
          .expect(200)
          .expect(businessOne);
      });
    });
  });
});
