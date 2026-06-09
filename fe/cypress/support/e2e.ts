import './commands';
import E2EController from '../../src/network/lib/e2e';

const e2eController = new E2EController();

beforeEach(async () => {
  await e2eController.trancate();
});

Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});