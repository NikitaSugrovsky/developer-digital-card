import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GraphQL /graphql (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns profile with nested relations', async () => {
    const query = `
      query {
        profile {
          name
          description
          githubUrl
          linkedinUrl
          skills { name category level }
          experience { company position startDate endDate }
          projects { name technologies }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.profile.name).toBe('Никита');
    expect(res.body.data.profile.skills.length).toBe(10);
    expect(res.body.data.profile.experience.length).toBe(1);
    expect(res.body.data.profile.projects.length).toBe(2);
  });

  it('returns NOT_FOUND for unknown profileById', async () => {
    const query = `query { profileById(id: "nonexistent") { name } }`;
    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].extensions.code).toBe('NOT_FOUND');
    expect(res.body.data).toBeNull();
  });
});