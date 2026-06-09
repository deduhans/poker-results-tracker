import { newUser } from '../fixtures/users.json'

describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.dataCy('username').should('be.visible');
    cy.dataCy('password').should('be.visible');
    cy.dataCy('confirm-password').should('be.visible');
    cy.dataCy('register-button').should('be.visible');
  });

  it('should validate form inputs', () => {
    cy.dataCy('register-button').should('be.disabled');

    cy.dataCyInput('username').type('a');
    cy.dataCy('username').getErrorMessage().should('have.text', 'Username must be at least 3 characters');

    cy.dataCyInput('username').clear({ force: true });
    cy.dataCyInput('username').type('validuser');
    cy.dataCyInput('password').type('short');
    cy.dataCy('password').getErrorMessage().should('have.text', 'Password must be at least 8 characters');

    cy.dataCyInput('password').clear({ force: true });
    cy.dataCyInput('password').type('Password123');
    cy.dataCyInput('confirm-password').type('DifferentPassword123');
    cy.dataCy('confirm-password').getErrorMessage().should('have.text', 'Passwords must match');

    cy.dataCy('register-button').should('be.disabled');
  });

  it('should register a new user successfully', () => {
    cy.dataCyInput('username').type(newUser.username);
    cy.dataCyInput('password').type(newUser.password);
    cy.dataCyInput('confirm-password').type(newUser.password);

    cy.dataCy('register-button').should('not.be.disabled');
    cy.dataCy('register-button').click();

    cy.url().should('include', '/home');
  });

  it('should handle duplicate username', () => {
    cy.createUser(newUser);

    cy.visit('/register');
    cy.dataCyInput('username').type(newUser.username);
    cy.dataCyInput('password').type(newUser.password);
    cy.dataCyInput('confirm-password').type(newUser.password);

    cy.dataCy('register-button').should('not.be.disabled');
    cy.dataCy('register-button').click();

    cy.dataCy('register-error').should('be.visible');
  });
});
