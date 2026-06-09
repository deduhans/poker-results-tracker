import { Page, Locator, expect } from '@playwright/test';

export class WelcomePage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async navigateToLogin() {
    await this.loginButton.click();
  }

  async navigateToSignUp() {
    await this.signUpButton.click();
  }

  async assertWelcomePageLoaded() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
  }
}
