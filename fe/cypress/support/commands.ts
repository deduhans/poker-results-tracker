/// <reference types="cypress" />

import type { CreateUser } from "../../src/types/user/CreateUser";
import type { User } from "../../src/types/user/User";
import type { Auth } from "../../src/types/auth/Auth";
import type { CreateRoom } from "../../src/types/room/CreateRoom";
import type { Room } from "../../src/types/room/Room";
import type { CreatePlayer } from "../../src/types/player/CreatePlayer";
import type { CreateExchange } from "../../src/types/payment/CreateExchange";
import type { Exchange } from "../../src/types/payment/Exchange";
import type { Player } from "../../src/types/player/Player";

Cypress.Commands.add('dataCy', (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('dataCyInput', (value: string) => {
  return cy.dataCy(value).find('input');
});

Cypress.Commands.add('getErrorMessage', { prevSubject: true }, (subject) => {
  return cy.wrap(subject)
    .find('.v-messages__message');
});

Cypress.Commands.add('createUser', (user: CreateUser) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/users`,
    body: user
  }).then((response) => {
    let newUser: User = response.body;
    newUser.password = user.password;
    return newUser;
  });
});

Cypress.Commands.add('login', { prevSubject: true }, (user: User) => {
  cy.visit('/');

  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      username: user.username,
      password: user.password
    } as Auth,
    followRedirect: true
  }).then(() => {
    cy.window().then((win) => {
      win.sessionStorage.setItem('auth_session', JSON.stringify({
        isAuthenticated: true,
        sessionExpiry: Date.now() + (12 * 60 * 60 * 1000) // 12 hours from now
      }));

      win.localStorage.setItem('user', JSON.stringify({
        userId: user.id,
        name: user.username
      }));
    });
  });
});

Cypress.Commands.add('createRoom', (room: CreateRoom) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/rooms`,
    body: room
  }).then((response) => {
    let newRoom: Room = response.body;
    return newRoom;
  });
});

Cypress.Commands.add('createPlayer', (player: CreatePlayer) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/players`,
    body: player
  }).then((response) => {
    let newPlayer: Player = response.body;
    return newPlayer;
  });
});

Cypress.Commands.add('createPayment', (payment: CreateExchange) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/payments`,
    body: payment
  }).then((response) => {
    let newPayment: Exchange = response.body;
    return newPayment;
  });
});

Cypress.Commands.add('closeRoom', (room: Room) => {
  const closeRoom = [{
    id: room.players[0].id,
    income: 0
  }];

  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/rooms/close/${room.id}`,
    body: closeRoom
  });
});



declare global {
  namespace Cypress {
    interface Chainable {
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      dataCyInput(value: string): Chainable<JQuery<HTMLInputElement>>;
      createUser(value: CreateUser): Chainable<User>
      login(user?: User): Chainable<void>
      getErrorMessage(): Chainable<any>
      createRoom(value: CreateRoom): Chainable<any>
      createPlayer(value: CreatePlayer): Chainable<any>
      createPayment(value: CreateExchange): Chainable<any>
      closeRoom(value: Room): Chainable<any>
    }
  }
}

export { }