import { test as base, expect } from '@playwright/test';
import { E2EController, UserController, AuthController, RoomController, PlayerController, ExchangeController } from './controllers';

// Define the test fixture types
type Fixtures = {
  clearDb: void;
  userController: UserController;
  authController: AuthController;
  roomController: RoomController;
  playerController: PlayerController;
  exchangeController: ExchangeController;
  e2eController: E2EController;
};

// Define a test fixture that includes our controllers
export const test = base.extend<Fixtures>({
  // Before each test, clear the database
  clearDb: [async ({ request }, use) => {
    const e2eController = new E2EController(request);
    await e2eController.clearDatabase();
    await use();
  }, { auto: false }], // auto: true means this will run for every test automatically

  // Provide controllers as fixtures
  userController: async ({ request }, use) => {
    await use(new UserController(request));
  },

  authController: async ({ request }, use) => {
    await use(new AuthController(request));
  },

  roomController: async ({ request }, use) => {
    await use(new RoomController(request));
  },

  playerController: async ({ request }, use) => {
    await use(new PlayerController(request));
  },

  exchangeController: async ({ request }, use) => {
    await use(new ExchangeController(request));
  },

  e2eController: async ({ request }, use) => {
    await use(new E2EController(request));
  }
});

// Re-export expect for convenience
export { expect };
