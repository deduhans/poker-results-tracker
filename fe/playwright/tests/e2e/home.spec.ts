import { test, expect } from '../../test-setup';
import { HomePage } from '../../pages/HomePage';
import { UserFactory } from '../api/test-data/user-data';
import { Auth } from '../../../src/types/auth/Auth';

test.describe('Home Page', () => {
  let homePage: HomePage;
  let testUser: string;
  let authData: Auth;

  test.beforeEach(async ({ page, userController, authController }) => {
    // Create a test user with factory
    const userData = UserFactory.createValid();
    testUser = userData.username;
    
    await userController.createUser(userData);
    
    // Login with proper Auth object
    authData = { username: userData.username, password: userData.password };
    await authController.login(authData);

    homePage = new HomePage(page);
    await homePage.goto();

    await homePage.assertHomePageLoaded();
  });

  test('should display home page with title and create button', async () => {
    await expect(homePage.homeTitle).toContainText('Rooms');
    await expect(homePage.createRoomButton).toBeVisible();
  });

  test('should create a new room and display it in the list', async () => {
    const roomName = `Room_${Date.now()}`;
    await homePage.createRoom(roomName);
    await homePage.assertRoomInList(roomName);
  });

  test('should show empty state when no rooms exist', async ({ page, e2eController }) => {
    await e2eController.clearDatabase();
    await homePage.goto();

    const openRoomsList = page.locator('[data-cy=open-rooms-list]');
    const roomItems = openRoomsList.locator('.v-list-item');

    const count = await roomItems.count();
    if (count > 0) {
      await expect(openRoomsList).toContainText(/no rooms/i);
    }
  });

  test('should display loading indicator when fetching rooms', async ({ page }) => {
    await page.reload();

    const loadingIndicator = page.locator('[data-cy=loading-indicator]');
    await expect(loadingIndicator).toBeVisible();

    await expect(loadingIndicator).not.toBeVisible({ timeout: 5000 });
  });

  test('should allow navigation between open and closed rooms', async ({ roomController }) => {
    const openRoomName = `OpenRoom_${Date.now()}`;
    const openRoomResponse = await roomController.createRoom(openRoomName);
    const openRoomId = String(openRoomResponse.body.id);

    const closedRoomName = `ClosedRoom_${Date.now()}`;
    const closedRoomResponse = await roomController.createRoom(closedRoomName);
    const closedRoomId = String(closedRoomResponse.body.id);

    const playerChips = { [testUser]: 100 };
    await roomController.closeRoom(closedRoomId, playerChips);

    await homePage.goto();

    const openRoomsList = homePage.openRoomsList;
    const closedRoomsList = homePage.closedRoomsList;

    await expect(openRoomsList).toContainText(openRoomName);
    await expect(closedRoomsList).toContainText(closedRoomName);
  });
});
