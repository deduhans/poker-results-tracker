import { test, expect } from '../../test-setup';
import { RegisterPage } from '../../pages/RegisterPage';
import { UserFactory } from '../api/test-data/user-data';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Register Page', () => {
  let registerPage: RegisterPage;
  let homepage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    homepage = new HomePage(page);
    loginPage = new LoginPage(page);
    await registerPage.goto();
    await registerPage.assertRegisterPageLoaded();
  });

  test('should register successfully with valid data', async ({ }) => {
    const userData = UserFactory.createValid();

    await registerPage.register(userData.username, userData.password);

    await homepage.assertHomePageLoaded();
  });

  test('should not register with existing username', async ({ userController }) => {
    const userData = UserFactory.createValid();
    await userController.createUser(userData);

    await registerPage.register(userData.username, userData.password);

    await registerPage.assertRegistrationError('Username is already taken');
  });

  test('should show error message with invalid data', async ({ }) => {
    const userData = UserFactory.createInvalid('passwordWithoutNumbers');

    await registerPage.usernameInput.fill(userData.username);
    await registerPage.passwordInput.fill(userData.password);
    await registerPage.confirmPasswordInput.fill(userData.password);

    await registerPage.assertPasswordError('Password must contain at least one number');
  });

  test('should show error message with invalid username', async ({ }) => {
    const userData = UserFactory.createInvalid('tooShortPassword');

    await registerPage.usernameInput.fill(userData.username);
    await registerPage.passwordInput.fill(userData.password);
    await registerPage.confirmPasswordInput.fill(userData.password);

    await registerPage.assertPasswordError('Password must be at least 8 characters');
  });

  test('should show error message with invalid password', async ({ }) => {
    const userData = UserFactory.createInvalid('tooShortUsername');

    await registerPage.usernameInput.fill(userData.username);
    await registerPage.passwordInput.fill(userData.password);
    await registerPage.confirmPasswordInput.fill(userData.password);

    await registerPage.assertUsernameError('Username must be at least 3 characters');
  });

  test('should navigate to login page when back to login button is clicked', async ({ }) => {
    await registerPage.navigateToLogin();

    await loginPage.assertLoginPageLoaded();
  });
});
