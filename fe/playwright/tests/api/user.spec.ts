import { test, expect } from '../../test-setup';
import { UserFactory } from './test-data/user-data';

test.describe('User API', () => {
  test('should create a new user successfully', async ({ userController }) => {
    const testUser = UserFactory.createValid();

    const response = await userController.createUser(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(testUser.username);
    expect(response.body).not.toHaveProperty('password');
  });

  test('should not create a user with duplicate username', async ({ userController }) => {
    const testUser = UserFactory.createValid();
    const firstResponse = await userController.createUser(testUser);
    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await userController.createUser(testUser);
    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body).toHaveProperty('message');
    expect(duplicateResponse.body.message).toContain('Username is already taken');
  });

  test('should not create a user with empty username', async ({ userController }) => {
    const emptyUsernameUser = UserFactory.createInvalid('emptyUsername');
    const emptyUsernameResponse = await userController.createUser(emptyUsernameUser);
    expect(emptyUsernameResponse.status).toBe(400);
    expect(emptyUsernameResponse.body).toHaveProperty('message');
    expect(emptyUsernameResponse.body.message).toContain('Username is required');
  });

  test('should not create a user with empty password', async ({ userController }) => {
    const emptyPasswordUser = UserFactory.createInvalid('emptyPassword');
    const emptyPasswordResponse = await userController.createUser(emptyPasswordUser);
    expect(emptyPasswordResponse.status).toBe(400);
    expect(emptyPasswordResponse.body).toHaveProperty('message');
    expect(emptyPasswordResponse.body.message).toContain('Password is required');
  });

  test('should not create a user with too short username', async ({ userController }) => {
    const shortUsernameUser = UserFactory.createInvalid('tooShortUsername');
    const shortUsernameResponse = await userController.createUser(shortUsernameUser);
    expect(shortUsernameResponse.status).toBe(400);
    expect(shortUsernameResponse.body).toHaveProperty('message');
    expect(shortUsernameResponse.body.message).toContain('Username must be at least 3 characters long');
  });

  test('should not create a user with password without numbers', async ({ userController }) => {
    const passwordWithoutNumbersUser = UserFactory.createInvalid('passwordWithoutNumbers');
    const response = await userController.createUser(passwordWithoutNumbersUser);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Password must contain at least one number');
  });

  test('should not create a user with too short password', async ({ userController }) => {
    const shortPasswordUser = UserFactory.createInvalid('tooShortPassword');
    const shortPasswordResponse = await userController.createUser(shortPasswordUser);
    expect(shortPasswordResponse.status).toBe(400);
    expect(shortPasswordResponse.body).toHaveProperty('message');
    expect(shortPasswordResponse.body.message).toContain('Password must be at least 8 characters long');
  });
});
