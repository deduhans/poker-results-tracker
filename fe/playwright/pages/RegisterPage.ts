import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly form: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly backToLoginButton: Locator;
  readonly errorAlert: Locator;
  readonly usernameAlert: Locator;
  readonly passwordAlert: Locator;
  readonly confirmPasswordAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('[data-cy=register-form]');
    this.usernameInput = page.locator('[data-cy=username] input');
    this.passwordInput = page.locator('[data-cy=password] input');
    this.confirmPasswordInput = page.locator('[data-cy=confirm-password] input');
    this.registerButton = page.locator('[data-cy=register-button]');
    this.backToLoginButton = page.locator('[data-cy=back-to-login-button]');
    this.errorAlert = page.locator('[data-cy=register-error]');
    this.usernameAlert = page.locator('[data-cy=username] [role=alert]');
    this.passwordAlert = page.locator('[data-cy=password] [role=alert]');
    this.confirmPasswordAlert = page.locator('[data-cy=confirm-password] [role=alert]');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async register(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.registerButton.click();
  }

  async navigateToLogin() {
    await this.backToLoginButton.click();
  }

  async assertRegisterPageLoaded() {
    await expect(this.form).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  async assertRegistrationError(message: string) {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText(message);
  }

  async assertUsernameError(message: string) {
    await expect(this.usernameAlert).toBeVisible();
    await expect(this.usernameAlert).toHaveText(message);
  }

  async assertPasswordError(message: string) {
    await expect(this.passwordAlert).toBeVisible();
    await expect(this.passwordAlert).toHaveText(message);
  }

  async assertConfirmPasswordError(message: string) {
    await expect(this.confirmPasswordAlert).toBeVisible();
    await expect(this.confirmPasswordAlert).toHaveText(message);
  }
}
