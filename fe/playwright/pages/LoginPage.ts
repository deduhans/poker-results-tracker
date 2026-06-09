import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('[data-cy=login-form]');
    this.usernameInput = page.locator('[data-cy=username] input');
    this.passwordInput = page.locator('[data-cy=password] input');
    this.loginButton = page.locator('[data-cy=login-button]');
    this.registerButton = page.locator('[data-cy=register-button]');
    this.errorAlert = page.locator('[data-cy=login-error]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async navigateToRegister() {
    await this.registerButton.click();
  }

  async assertLoginPageLoaded() {
    await expect(this.form).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async assertLoginError(message: string) {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText(message);
  }
}
