import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { E2EService } from '@app/e2e/e2e.service';
import { TestHelper } from './helpers/test-helper';
import { userData } from './fixtures/test-data';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let e2eService: E2EService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await TestHelper.setupTestApp(moduleFixture);
    e2eService = moduleFixture.get(E2EService);
  });

  afterAll(async () => {
    await e2eService.clearDatabase();
    await app.close();
  });

  beforeEach(async () => {
    await e2eService.clearDatabase();

    // Create a test user
    await request(app.getHttpServer()).post('/users').send({
      username: userData.username,
      password: userData.password,
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        username: userData.username,
        password: userData.password,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('username');
      expect(response.body.username).toBe(userData.username);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        username: userData.username,
        password: userData.invalidPassword,
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 with non-existent user', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        username: userData.nonExistentUsername,
        password: userData.password,
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid input format', async () => {
      const response = await request(app.getHttpServer()).post('/auth/login').send({
        username: 'te',
        password: userData.password,
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/sessionStatus', () => {
    it('should return user data when authenticated', async () => {
      const { accessToken } = await TestHelper.createTestUser(app);

      const response = await request(app.getHttpServer())
        .get('/auth/sessionStatus')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('username');
      expect(response.body.username).toBe(userData.username);
    });

    it('should return 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer()).get('/auth/sessionStatus');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /auth/logout', () => {
    it('should return 200 when logged in', async () => {
      const { accessToken } = await TestHelper.createTestUser(app);

      const logoutResponse = await request(app.getHttpServer())
        .get('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(logoutResponse.status).toBe(200);
    });

    it('should return 200 even if not logged in', async () => {
      const response = await request(app.getHttpServer()).get('/auth/logout');

      expect(response.status).toBe(200);
    });
  });

  describe('Authentication flow', () => {
    it('should accept token across multiple requests', async () => {
      const { accessToken } = await TestHelper.createTestUser(app);

      const sessionResponse1 = await request(app.getHttpServer())
        .get('/auth/sessionStatus')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(sessionResponse1.status).toBe(200);

      const sessionResponse2 = await request(app.getHttpServer())
        .get('/auth/sessionStatus')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(sessionResponse2.status).toBe(200);
    });
  });
});
