import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly homeTitle: Locator;
  readonly createRoomButton: Locator;
  readonly errorAlert: Locator;
  readonly loadingIndicator: Locator;
  readonly openRoomsList: Locator;
  readonly closedRoomsList: Locator;
  
  // Room creation dialog elements
  readonly roomNameInput: Locator;
  readonly confirmCreateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeTitle = page.locator('[data-cy=home-title]');
    this.createRoomButton = page.locator('[data-cy=create-room-button]');
    this.errorAlert = page.locator('[data-cy=error-alert]');
    this.loadingIndicator = page.locator('[data-cy=loading-indicator]');
    this.openRoomsList = page.locator('[data-cy=open-rooms-list]');
    this.closedRoomsList = page.locator('[data-cy=closed-rooms-list]');
    
    // These selectors will need to be adjusted based on your NewRoom component
    this.roomNameInput = page.getByLabel('Room Name');
    this.confirmCreateButton = page.getByRole('button', { name: /create/i });
  }

  async goto() {
    await this.page.goto('/home');
  }

  async createRoom(roomName: string) {
    await this.createRoomButton.click();
    await this.roomNameInput.fill(roomName);
    await this.confirmCreateButton.click();
  }

  async assertHomePageLoaded() {
    await expect(this.homeTitle).toBeVisible();
    await expect(this.createRoomButton).toBeVisible();
  }

  async assertRoomInList(roomName: string) {
    // Wait for any loading to complete
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    
    // Check for room in open rooms list
    const roomElement = this.openRoomsList.getByText(roomName);
    await expect(roomElement).toBeVisible();
  }
}
