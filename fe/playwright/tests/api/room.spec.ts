import { test, expect } from '../../test-setup';
import { RoomFactory } from './test-data/room-data';
import { PlayerFactory } from './test-data/player-data';
import { User } from '../../../src/types/user/User';
import { Room } from '../../../src/types/room/Room';
import { CurrencyEnum } from '../../../src/types/room/CurrencyEnum';
import { CreateRoom } from '../../../src/types/room/CreateRoom';
import { PlayerResult } from '../../../src/types/player/PlayerResult';
import { createAndLoginUser } from '../../utils/test-helpers';

test.describe('Room API', () => {
  let testUser: User;

  test.beforeEach(async ({ userController, authController }) => {
    testUser = await createAndLoginUser(userController, authController);
  });

  test('should create a new room', async ({ roomController }) => {
    const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
    const response = await roomController.createRoom(roomData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(roomData.name);
    expect(response.body.status).toBe('opened');
    expect(response.body.requiresKey).toBe(false);
    expect(response.body).not.toHaveProperty('roomKey');

  });

  test('should get all rooms', async ({ roomController }) => {
    const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
    await roomController.createRoom(roomData);

    const response = await roomController.getRooms();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const foundRoom = response.body.find((room: Room) => room.name === roomData.name);
    expect(foundRoom).toBeDefined();
    if (foundRoom) {
      expect(foundRoom).toHaveProperty('id');
      expect(foundRoom.status).toBe('opened');
      expect(foundRoom).not.toHaveProperty('players');
    }
  });

  test('should get a specific room by ID', async ({ roomController }) => {
    const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
    const createResponse = await roomController.createRoom(roomData);
    const createdRoomId = createResponse.body.id;

    const response = await roomController.getRoom(createdRoomId);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(createdRoomId);
    expect(response.body.name).toBe(roomData.name);
  });

  test('should close a room with player results', async ({ roomController }) => {
    const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
    const createResponse = await roomController.createRoom(roomData);
    const createdRoomId = createResponse.body.id;

    const playerResult = PlayerFactory.createPlayerResult(createResponse.body.players[0].id);

    const response = await roomController.closeRoom(createdRoomId, [playerResult]);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toBe(createdRoomId);
    expect(response.body.status).toBe('closed');

    const roomsResponse = await roomController.getRooms();
    const closedRoom = roomsResponse.body.find((room: Room) => room.id === createdRoomId);
    expect(closedRoom).toBeDefined();
    if (closedRoom) {
      expect(closedRoom.status).toBe('closed');
    }
  });

  test('should not allow closing a room that does not exist', async ({ roomController }) => {
    const invalidRoomId = '99999';
    const playerResults: PlayerResult[] = [
      PlayerFactory.createPlayerResult(testUser.id, "100")
    ];

    const response = await roomController.closeRoom(invalidRoomId, playerResults);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  test.describe('Room Creation Validation', () => {
    test('should validate room name length (min 3, max 20 characters)', async ({ roomController }) => {
      const shortNameResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { name: 'AB' })
      );
      expect(shortNameResponse.status).toBe(400);
      expect(shortNameResponse.body.message).toContain('Room name must be between 3 and 20 characters');

      const longNameResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { name: 'A'.repeat(21) })
      );
      expect(longNameResponse.status).toBe(400);
      expect(longNameResponse.body.message).toContain('Room name must be between 3 and 20 characters');

      const emptyNameResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { name: '' })
      );
      expect(emptyNameResponse.status).toBe(400);
      expect(emptyNameResponse.body.message).toContain('Room name is required');
    });

    test('should validate exchange rate (must be integer ≥ 1)', async ({ roomController }) => {
      const zeroExchangeResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { exchange: 0 })
      );
      expect(zeroExchangeResponse.status).toBe(400);
      expect(zeroExchangeResponse.body.message).toContain('Exchange rate must be at least 1');

      const negativeExchangeResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { exchange: -10 })
      );
      expect(negativeExchangeResponse.status).toBe(400);
      expect(negativeExchangeResponse.body.message).toContain('Exchange rate must be at least 1');

      const nonIntExchangeResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { exchange: 10.5 } as any)
      );
      expect(nonIntExchangeResponse.status).toBe(400);
      expect(nonIntExchangeResponse.body.message).toContain('Exchange rate must be an integer');
    });

    test('should validate baseBuyIn (optional, but must be integer ≥ 1 if provided)', async ({ roomController }) => {
      const zeroBuyInResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { baseBuyIn: 0 })
      );
      expect(zeroBuyInResponse.status).toBe(400);
      expect(zeroBuyInResponse.body.message).toContain('Base buy-in must be at least 1');

      const negativeBuyInResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { baseBuyIn: -10 })
      );
      expect(negativeBuyInResponse.status).toBe(400);
      expect(negativeBuyInResponse.body.message).toContain('Base buy-in must be at least 1');

      const nonIntBuyInResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { baseBuyIn: 10.5 } as any)
      );
      expect(nonIntBuyInResponse.status).toBe(400);
      expect(nonIntBuyInResponse.body.message).toContain('Base buy-in must be an integer');

      const noBuyInResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { baseBuyIn: undefined })
      );
      expect(noBuyInResponse.status).toBe(201);
    });

    test('should validate currency (must be valid enum value if provided)', async ({ roomController }) => {
      const invalidCurrencyResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { currency: 'INVALID' as any })
      );
      expect(invalidCurrencyResponse.status).toBe(400);
      expect(invalidCurrencyResponse.body.message).toContain('Currency must be one of: ' + Object.values(CurrencyEnum).join(', '));

      for (const currency of Object.values(CurrencyEnum)) {
        const response = await roomController.createRoom(
          RoomFactory.createWithOverrides(testUser.id, { currency })
        );
        expect(response.status).toBe(201);
      }
    });

    test('should validate room key (must be exactly 4 digits if provided)', async ({ roomController }) => {
      const nonDigitKeyResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { roomKey: 'abcd' })
      );
      expect(nonDigitKeyResponse.status).toBe(400);
      expect(nonDigitKeyResponse.body.message).toContain('Room key must contain exactly 4 digits');

      const shortKeyResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { roomKey: '123' })
      );
      expect(shortKeyResponse.status).toBe(400);
      expect(shortKeyResponse.body.message).toContain('Room key must be exactly 4 digits');

      const longKeyResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { roomKey: '12345' })
      );
      expect(longKeyResponse.status).toBe(400);
      expect(longKeyResponse.body.message).toContain('Room key must be exactly 4 digits');

      const validKeyResponse = await roomController.createRoom(
        RoomFactory.createWithOverrides(testUser.id, { roomKey: '1234' })
      );

      expect(validKeyResponse.status).toBe(201);
      expect(validKeyResponse.body.requiresKey).toBe(true);
    });

    test('should create a room with all valid optional fields', async ({ roomController }) => {
      const fullRoomData = RoomFactory.createWithOverrides(testUser.id, {
        name: 'Complete Room',
        exchange: 50,
        baseBuyIn: 100,
        currency: CurrencyEnum.EUR,
        isVisible: false,
        roomKey: '5678'
      });

      const response = await roomController.createRoom(fullRoomData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(fullRoomData.name);
      expect(response.body.exchange).toBe(fullRoomData.exchange);
      expect(response.body.baseBuyIn).toBe(fullRoomData.baseBuyIn);
      expect(response.body.currency).toBe(fullRoomData.currency);
      expect(response.body.isVisible).toBe(fullRoomData.isVisible);
      expect(response.body.requiresKey).toBe(true);
      expect(response.body).not.toHaveProperty('roomKey'); // Password should not be returned
    });
  });

  test('should create a room with a password', async ({ roomController }) => {
    const roomData = RoomFactory.createWithPassword(testUser.id);

    const response = await roomController.createRoom(roomData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(roomData.name);
    expect(response.body.requiresKey).toBe(true);
    expect(response.body).not.toHaveProperty('roomKey');
  });
});

// Tests for unauthorized access
test.describe('Room API - Unauthorized Access', () => {
  test('should not allow creating rooms without login', async ({ roomController }) => {
    const roomData = RoomFactory.createValid(999);
    const response = await roomController.createRoom(roomData);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden resource');
  });

  test('should not allow closing rooms without login', async ({ roomController }) => {
    const response = await roomController.closeRoom('9999', []);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden resource');
  });

  test('should not allow generating tokens without login', async ({ roomController }) => {
    const response = await roomController.generateToken('9999');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden resource');
  });

  test('should allow fetching public rooms without login', async ({ roomController }) => {
    const response = await roomController.getRooms();

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden resource');
  });

  test('should allow fetching public room by ID without login', async ({ roomController }) => {
    const response = await roomController.getRoom('1');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden resource');
  });
});
