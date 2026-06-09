import { getUser, getRoom } from '../support/helper';
import type { User } from '../../src/types/user/User';
import type { CreateRoom } from '../../src/types/room/CreateRoom';
import type { Room } from '../../src/types/room/Room';
import type { CreateUser } from '../../src/types/user/CreateUser';

describe('Home Page', () => {
    let createUser: CreateUser;
    let createRoom: CreateRoom;
    let user: User;

    beforeEach(() => {
        createUser = getUser();
        cy.createUser(createUser).then((createdUser: User) => {
            user = createdUser;
            createRoom = getRoom(user.id);
        }).login();

        cy.visit('/home').url().should('include', '/home');
    });

    it('should display the home page with correct elements', () => {
        cy.dataCy('home-title').should('be.visible').and('contain', 'Rooms');
        cy.dataCy('create-room-button').should('be.visible');
        cy.dataCy('open-rooms-list').should('exist');
        cy.dataCy('closed-rooms-list').should('exist');
    });

    it('should open create room dialog and validate form', () => {
        cy.dataCy('create-room-button').click();
        cy.dataCy('create-room-dialog').should('be.visible');

        cy.dataCy('room-name-input').should('be.visible');
        cy.dataCy('room-exchange-input').should('be.visible');
        cy.dataCy('create-button').should('be.disabled');

        cy.dataCyInput('room-name-input').focus().blur();
        cy.dataCy('room-name-input').getErrorMessage().should('be.visible');

        cy.dataCyInput('room-name-input').type('Test Room');
        cy.dataCyInput('room-exchange-input').clear().type('0');
        cy.dataCy('room-exchange-input').getErrorMessage().should('be.visible');

        cy.dataCyInput('room-exchange-input').clear().type('10');
        cy.dataCy('create-button').should('not.be.disabled');

        cy.dataCy('cancel-button').click();
        cy.dataCy('create-room-dialog').should('not.exist');
    });

    it('should create a new room successfully', () => {
        cy.dataCy('create-room-button').click();
        cy.dataCyInput('room-name-input').type(createRoom.name);
        cy.dataCyInput('room-exchange-input').clear().type(createRoom.exchange.toString());
        cy.dataCy('create-button').click();

        cy.url().should('include', '/room/');
    });

    it('should display rooms in the appropriate lists', () => {
        cy.createRoom(createRoom).then((createdRoom: Room) => {
            cy.reload();

            cy.dataCy('open-rooms-list').should('be.visible');
            cy.dataCy('open-rooms-list').find('[data-cy=room-list-item]')
                .should('contain', createdRoom.name);

            cy.closeRoom(createdRoom);
            cy.reload();

            cy.dataCy('closed-rooms-list').should('be.visible');
            cy.dataCy('closed-rooms-list').find('[data-cy=room-list-item]')
                .should('contain', createdRoom.name);
        });
    });

    it('should navigate to room details when clicking on a room', () => {
        cy.createRoom(createRoom).then((createdRoom: Room) => {
            cy.reload();
            cy.contains('[data-cy=room-list-item]', createdRoom.name).click();

            cy.url().should('include', `/room/${createdRoom.id}`);
            cy.dataCy('room-header').should('contain', createdRoom.name);
        });
    });

    it('should logout from home page', () => {
        cy.dataCy('user-menu').click();
        cy.dataCy('logout-button').click();

        cy.url().should('include', '/login');
    });
});
