import { test, expect } from '../../test-setup';
import { LoginPage } from '../../pages/LoginPage';
import { UserFactory } from '../api/test-data/user-data';
import { HomePage } from '../../pages/HomePage';

test.describe('Login Page', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
    await loginPage.assertLoginPageLoaded();
  });

  test('should login successfully with valid credentials', async ({ userController }) => {
    const userData = UserFactory.createValid();
    await userController.createUser(userData);

    await loginPage.login(userData.username, userData.password);

    await homePage.assertHomePageLoaded();
  });

  test('should show error message with invalid password', async ({ userController }) => {
    const userData = UserFactory.createValid();
    await userController.createUser(userData);

    await loginPage.login(userData.username, 'wrongpassword123');

    await loginPage.assertLoginError('Invalid username or password. Please try again.');
  });

  test('should show error message with invalid username', async ({ userController }) => {
    const userData = UserFactory.createValid();
    await userController.createUser(userData);

    await loginPage.login('wrongusername', userData.password);

    await loginPage.assertLoginError('User not found');
  });

  test('should navigate to register page when register button is clicked', async ({ page }) => {
    await loginPage.navigateToRegister();

    await expect(page).toHaveURL(/.*\/register/);
  });

  test('should toggle password visibility', async ({ page }) => {
    await loginPage.passwordInput.fill('password123');

    const eyeIcon = page.locator('[data-cy=password] .v-input__append');
    await eyeIcon.click();

    await page.waitForFunction(() => {
      const input = document.querySelector('[data-cy=password] input');
      return input && input.getAttribute('type') === 'text';
    });

    await eyeIcon.click();

    await page.waitForFunction(() => {
      const input = document.querySelector('[data-cy=password] input');
      return input && input.getAttribute('type') === 'password';
    });
  });
});
