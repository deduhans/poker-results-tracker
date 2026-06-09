import { test } from '@playwright/test';
import { WelcomePage } from '../../pages/WelcomePage';

test.describe('Welcome Page', () => {
  test('should display heading and auth buttons', async ({ page }) => {
    const welcomePage = new WelcomePage(page);
    await welcomePage.goto();
    await welcomePage.assertWelcomePageLoaded();
  });
});
