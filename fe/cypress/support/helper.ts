import { faker } from '@faker-js/faker';
import type { CreateUser } from '../../src/types/user/CreateUser';
import type { CreateRoom } from '../../src/types/room/CreateRoom';
import type { CreatePlayer } from '../../src/types/player/CreatePlayer';
import type { CreateExchange } from '../../src/types/payment/CreateExchange';
import { ExchangeDirectionEnum } from '../../src/types/payment/ExchangeDirectionEnum';

export function getUser(user?: Partial<CreateUser>): CreateUser {
    const newUser: CreateUser = {
        username: faker.internet.username(),
        password: faker.internet.password()
    };

    if (user) {
        Object.assign(newUser, user);
    }

    return newUser;
}

export function getRoom(userId: number, room?: Partial<CreateRoom>): CreateRoom {
    const newRoom: CreateRoom = {
        name: faker.animal.type(),
        exchange: faker.number.int({ min: 1, max: 1000 }),
        hostId: userId
    };

    if (room) {
        Object.assign(newRoom, room);
    }

    return newRoom;
}

export function getPlayer(userId: number, roomId: number, player?: Partial<CreatePlayer>): CreatePlayer {
    const newPlayer: CreatePlayer = {
        roomId: roomId,
        userId: userId,
        name: faker.internet.username(),
    }

    if (player) {
        Object.assign(newPlayer, player);
    }

    return newPlayer;
}

export function getPayment(roomId: number, playerId: number, payment?: Partial<CreateExchange>): CreateExchange {
    const newPayment: CreateExchange = {
        roomId: roomId,
        playerId: playerId,
        amount: faker.number.int({ min: 50, max: 500 }),
        type: ExchangeDirectionEnum.BuyIn
    };

    if (payment) {
        Object.assign(newPayment, payment);
    }

    return newPayment;
}