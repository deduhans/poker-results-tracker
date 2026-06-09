import { test, expect } from '../../test-setup';
import { UserFactory } from './test-data/user-data';
import { AuthFactory } from './test-data/auth-data';
import { Auth } from '../../../src/types/auth/Auth';
import { User } from '../../../src/types/user/User';

test.describe('Auth API', () => {
  let testUser: User;
  let authData: Auth;

  test.beforeEach(async ({ userController }) => {
    const userData = UserFactory.createValid();

    const response = await userController.createUser(userData);
    expect(response.status).toBe(201);
    testUser = response.body;
    testUser.password = userData.password;

    authData = AuthFactory.createFromUser(testUser);
  });

  test('should login with valid credentials', async ({ authController }) => {
    const response = await authController.login(authData);

    expect(response.status).toBe(201);
    expect(response.body.userId).toBe(testUser.id);
    expect(response.body.username).toBe(testUser.username);
  });

  test('should get session status after login', async ({ authController }) => {
    await authController.login(authData);

    const response = await authController.getSessionStatus();

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(testUser.id);
    expect(response.body.username).toBe(testUser.username);
  });

  test('should logout successfully', async ({ authController }) => {
    await authController.login(authData);

    const logoutResponse = await authController.logout();
    expect(logoutResponse.status).toBe(200);

    const sessionResponse = await authController.getSessionStatus();
    expect(sessionResponse.status).not.toBe(200);
  });

  test('should not login with wrong password', async ({ authController }) => {
    const wrongPasswordAuth = AuthFactory.createInvalid(testUser, 'wrongPassword');

    const response = await authController.login(wrongPasswordAuth);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  test('should not login with non-existent user', async ({ authController }) => {
    const nonExistentAuth = AuthFactory.createInvalid(testUser, 'nonExistentUser');

    const response = await authController.login(nonExistentAuth);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});
