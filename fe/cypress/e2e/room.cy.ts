import { getUser, getRoom } from '../support/helper';
import type { User } from '../../src/types/user/User';
import type { Room } from '../../src/types/room/Room';

describe('Room Page', () => {
    let room: Room;

    beforeEach(() => {
        cy.createUser(getUser()).then((createdUser: User) => {
            cy.wrap(createdUser).login();

            cy.createRoom(getRoom(createdUser.id)).then((createdRoom: Room) => {
                cy.visit(`/room/${createdRoom.id}`);
                room = createdRoom;
            });
        });
    });

    it.skip('should display the room header and details correctly', () => {
        cy.dataCy('room-header').should('be.visible').and('contain', room.name);
        cy.dataCy('room-exchange').should('contain', room.exchange);
        cy.dataCy('room-status').should('contain', 'opened');
        cy.dataCy('room-players-count').should('contain', '1');
    });

    it.skip('should display empty states when no players or payments exist', () => {
        cy.dataCy('payment-history-list').should('not.exist');
        cy.dataCy('no-payments-message').should('be.visible');
    });

    it('should open add player dialog and add a new player', () => {
        const playerName = 'TestPlayer';

        cy.dataCy('new-player-button').click();
        cy.dataCy('new-player-dialog').should('be.visible');
        cy.dataCy('new-player-title').should('be.visible');

        cy.dataCy('new-player-name').type(playerName);
        cy.dataCy('new-player-add').click();

        cy.dataCy('players-list').should('be.visible');
        cy.dataCy('player-item').should('have.length.at.least', 2);
        cy.dataCy('player-item').contains(playerName).should('be.visible');
    });

    it('should add a payment to a player', () => {
        const playerName = 'Payment Test Player';

        cy.dataCy('new-player-button').click();
        cy.dataCy('new-player-name').type(playerName);
        cy.dataCy('new-player-add').click();

        cy.dataCy('create-payment-button').first().click();

        cy.dataCy('payment-history-list').should('be.visible');
        cy.dataCy('payment-item').should('be.visible');
        cy.dataCy('payment-item').contains(playerName).should('be.visible');
        cy.dataCy('payment-item').contains('50').should('be.visible');

        cy.dataCy('player-item').last().within(() => {
            cy.contains('Spend: 50€').should('be.visible');
        });
    });

    it('should display close room button for open rooms', () => {
        cy.dataCy('close-room-button').should('be.visible');
        cy.dataCy('close-room-button').contains('Close Room').should('be.visible');
    });

    it('should open close room dialog and close the room', () => {
        cy.dataCy('create-payment-button').click();
        cy.dataCy('payment-item').should('be.visible');

        cy.dataCy('close-room-button').click();
        cy.dataCy('close-room-dialog').should('be.visible');
        cy.dataCy('close-room-submit').should('be.visible');

        cy.dataCy('player-distribution-row-input').each(($input) => {
            cy.wrap($input).clear().type('50');
        });

        cy.dataCy('close-room-submit').should('be.enabled');
        cy.dataCy('close-room-submit').click();

        cy.url().should('include', '/home');

        cy.dataCy('closed-rooms-list').should('be.visible');
        cy.dataCy('closed-rooms-list').contains(room.name).should('be.visible');
    });

    it('should navigate back to home page when clicking back button', () => {
        cy.dataCy('back-button').click();
        cy.url().should('include', '/home');
    });

    it('should handle invalid room ID', () => {
        cy.visit('/room/99999');
        cy.dataCy('error-message').should('be.visible');
    });
});