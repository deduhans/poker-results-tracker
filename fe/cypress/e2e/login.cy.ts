/// <reference types="cypress" />
import { validUser, newUser } from '../fixtures/users.json'

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.dataCy('username').should('be.visible');
    cy.dataCy('password').should('be.visible');
    cy.dataCy('login-button').should('be.visible');
  });

  it('should validate form inputs', () => {
    cy.dataCy('login-button').should('be.disabled');

    cy.dataCyInput('username').type('a');
    cy.dataCy('username').getErrorMessage().should('have.text', 'Username must be at least 3 characters');

    cy.dataCyInput('username').clear({ force: true });
    cy.dataCyInput('username').type('validuser');
    cy.dataCyInput('password').type('short');
    cy.dataCy('password').getErrorMessage().should('have.text', 'Password must be at least 8 characters');

    cy.dataCy('login-button').should('be.disabled');
  });

  it('should handle login failure for non-existent user', () => {
    cy.dataCyInput('username').type(newUser.username);
    cy.dataCyInput('password').type(newUser.password);

    cy.dataCy('login-button').should('not.be.disabled');
    cy.dataCy('login-button').click();

    cy.dataCy('login-error').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should login successfully with valid credentials', () => {
    cy.createUser(validUser);

    cy.dataCyInput('username').type(validUser.username);
    cy.dataCyInput('password').type(validUser.password);

    cy.dataCy('login-button').should('not.be.disabled');
    cy.dataCy('login-button').click();

    cy.url().should('not.include', '/login');
  });
});
