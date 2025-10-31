import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module.js';

describe('Authentication E2E', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sign Up', () => {
    it('should create a new user', () => {
      const signUpMutation = `
        mutation {
          signUp(input: {
            name: "Test User"
            email: "test${Date.now()}@example.com"
            password: "password123"
            telephones: [
              { number: "987654321", area_code: "11" }
            ]
          }) {
            id
            created_at
            modified_at
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signUpMutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.signUp).toHaveProperty('id');
          expect(res.body.data.signUp).toHaveProperty('created_at');
          expect(res.body.data.signUp).toHaveProperty('modified_at');
          userId = res.body.data.signUp.id;
        });
    });

    it('should fail with duplicate email', () => {
      const email = `duplicate${Date.now()}@example.com`;

      const signUpMutation = `
        mutation {
          signUp(input: {
            name: "Duplicate User"
            email: "${email}"
            password: "password123"
            telephones: [
              { number: "987654321", area_code: "11" }
            ]
          }) {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signUpMutation })
        .expect(200)
        .then(() => {
          return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: signUpMutation })
            .expect((res) => {
              expect(res.body.errors).toBeDefined();
              expect(res.body.errors[0].message).toContain('Email already exists');
            });
        });
    });
  });

  describe('Sign In', () => {
    const testEmail = `signin${Date.now()}@example.com`;
    const testPassword = 'password123';

    beforeAll(() => {
      const signUpMutation = `
        mutation {
          signUp(input: {
            name: "Sign In Test User"
            email: "${testEmail}"
            password: "${testPassword}"
            telephones: [
              { number: "987654321", area_code: "11" }
            ]
          }) {
            id
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signUpMutation });
    });

    it('should return token with valid credentials', () => {
      const signInMutation = `
        mutation {
          signIn(input: {
            email: "${testEmail}"
            password: "${testPassword}"
          }) {
            token
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signInMutation })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.signIn).toHaveProperty('token');
          expect(typeof res.body.data.signIn.token).toBe('string');
          authToken = res.body.data.signIn.token;
        });
    });

    it('should fail with invalid credentials', () => {
      const signInMutation = `
        mutation {
          signIn(input: {
            email: "${testEmail}"
            password: "wrongpassword"
          }) {
            token
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signInMutation })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('Invalid credentials');
        });
    });
  });

  describe('Get User (Protected)', () => {
    it('should fail without token', () => {
      const getUserQuery = `
        query {
          getUser {
            id
            email
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: getUserQuery })
        .expect((res) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toContain('Unauthorized');
        });
    });

    it('should return user data with valid token', () => {
      const testEmail = `getuser${Date.now()}@example.com`;
      const testPassword = 'password123';
      let token: string;

      const signUpMutation = `
        mutation {
          signUp(input: {
            name: "Get User Test"
            email: "${testEmail}"
            password: "${testPassword}"
            telephones: [
              { number: "987654321", area_code: "11" }
            ]
          }) {
            id
          }
        }
      `;

      const signInMutation = `
        mutation {
          signIn(input: {
            email: "${testEmail}"
            password: "${testPassword}"
          }) {
            token
          }
        }
      `;

      const getUserQuery = `
        query {
          getUser {
            id
            name
            email
            telephones {
              number
              area_code
            }
            created_at
            modified_at
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signUpMutation })
        .then(() => {
          return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: signInMutation });
        })
        .then((res) => {
          token = res.body.data.signIn.token;
          return request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: getUserQuery })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.getUser).toHaveProperty('id');
              expect(res.body.data.getUser).toHaveProperty('email', testEmail);
              expect(res.body.data.getUser.telephones).toHaveLength(1);
            });
        });
    });
  });

  describe('List Users (Protected)', () => {
    it('should return paginated users with valid token', () => {
      const testEmail = `listusers${Date.now()}@example.com`;
      const testPassword = 'password123';
      let token: string;

      const signUpMutation = `
        mutation {
          signUp(input: {
            name: "List Users Test"
            email: "${testEmail}"
            password: "${testPassword}"
            telephones: [
              { number: "987654321", area_code: "11" }
            ]
          }) {
            id
          }
        }
      `;

      const signInMutation = `
        mutation {
          signIn(input: {
            email: "${testEmail}"
            password: "${testPassword}"
          }) {
            token
          }
        }
      `;

      const listUsersQuery = `
        query {
          listUsers(page: 1, pageSize: 10) {
            users {
              id
              name
              email
            }
            total
            page
            pageSize
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query: signUpMutation })
        .then(() => {
          return request(app.getHttpServer())
            .post('/graphql')
            .send({ query: signInMutation });
        })
        .then((res) => {
          token = res.body.data.signIn.token;
          return request(app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: listUsersQuery })
            .expect(200)
            .expect((res) => {
              expect(res.body.data.listUsers).toHaveProperty('users');
              expect(res.body.data.listUsers).toHaveProperty('total');
              expect(res.body.data.listUsers).toHaveProperty('page', 1);
              expect(res.body.data.listUsers).toHaveProperty('pageSize', 10);
              expect(Array.isArray(res.body.data.listUsers.users)).toBe(true);
            });
        });
    });
  });
});

