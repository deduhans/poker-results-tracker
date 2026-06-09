# Test info

- Name: Room API >> should get all rooms
- Location: /Users/deduhan/Documents/poker-results-tracker/poker-results-tracker-fe/playwright/tests/api/room.spec.ts:31:3

# Error details

```
Error: expect(received).not.toHaveProperty(path)

Expected path: not "players"

Received value: [{"createdAt": "2025-04-30T09:48:58.657Z", "id": 514, "name": "user_738154", "role": "host", "userId": 681, "username": "user_738154"}]
    at /Users/deduhan/Documents/poker-results-tracker/poker-results-tracker-fe/playwright/tests/api/room.spec.ts:45:29
```

# Test source

```ts
   1 | import { test, expect } from '../../test-setup';
   2 | import { RoomFactory } from './test-data/room-data';
   3 | import { PlayerFactory } from './test-data/player-data';
   4 | import { User } from '../../../src/types/user/User';
   5 | import { Room } from '../../../src/types/room/Room';
   6 | import { CurrencyEnum } from '../../../src/types/room/CurrencyEnum';
   7 | import { CreateRoom } from '../../../src/types/room/CreateRoom';
   8 | import { PlayerResult } from '../../../src/types/player/PlayerResult';
   9 | import { createAndLoginUser } from '../../utils/test-helpers';
   10 |
   11 | test.describe('Room API', () => {
   12 |   let testUser: User;
   13 |
   14 |   test.beforeEach(async ({ userController, authController }) => {
   15 |     testUser = await createAndLoginUser(userController, authController);
   16 |   });
   17 |
   18 |   test('should create a new room', async ({ roomController }) => {
   19 |     const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
   20 |     const response = await roomController.createRoom(roomData);
   21 |
   22 |     expect(response.status).toBe(201);
   23 |     expect(response.body).toHaveProperty('id');
   24 |     expect(response.body.name).toBe(roomData.name);
   25 |     expect(response.body.status).toBe('opened');
   26 |     expect(response.body.requiresKey).toBe(false);
   27 |     expect(response.body).not.toHaveProperty('roomKey');
   28 |
   29 |   });
   30 |
   31 |   test('should get all rooms', async ({ roomController }) => {
   32 |     const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
   33 |     await roomController.createRoom(roomData);
   34 |
   35 |     const response = await roomController.getRooms();
   36 |
   37 |     expect(response.status).toBe(200);
   38 |     expect(Array.isArray(response.body)).toBe(true);
   39 |
   40 |     const foundRoom = response.body.find((room: Room) => room.name === roomData.name);
   41 |     expect(foundRoom).toBeDefined();
   42 |     if (foundRoom) {
   43 |       expect(foundRoom).toHaveProperty('id');
   44 |       expect(foundRoom.status).toBe('opened');
>  45 |       expect(foundRoom).not.toHaveProperty('players');
      |                             ^ Error: expect(received).not.toHaveProperty(path)
   46 |     }
   47 |   });
   48 |
   49 |   test('should get a specific room by ID', async ({ roomController }) => {
   50 |     const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
   51 |     const createResponse = await roomController.createRoom(roomData);
   52 |     const createdRoomId = createResponse.body.id;
   53 |
   54 |     const response = await roomController.getRoom(createdRoomId);
   55 |
   56 |     expect(response.status).toBe(200);
   57 |     expect(response.body).toHaveProperty('id');
   58 |     expect(response.body.id).toBe(createdRoomId);
   59 |     expect(response.body.name).toBe(roomData.name);
   60 |   });
   61 |
   62 |   test('should close a room with player results', async ({ roomController }) => {
   63 |     const roomData: CreateRoom = RoomFactory.createValid(testUser.id);
   64 |     const createResponse = await roomController.createRoom(roomData);
   65 |     const createdRoomId = createResponse.body.id;
   66 |
   67 |     const playerResult = PlayerFactory.createPlayerResult(createResponse.body.players[0].id);
   68 |
   69 |     const response = await roomController.closeRoom(createdRoomId, [playerResult]);
   70 |
   71 |     expect(response.status).toBe(200);
   72 |     expect(response.body).toHaveProperty('id');
   73 |     expect(response.body.id).toBe(createdRoomId);
   74 |     expect(response.body.status).toBe('closed');
   75 |
   76 |     const roomsResponse = await roomController.getRooms();
   77 |     const closedRoom = roomsResponse.body.find((room: Room) => room.id === createdRoomId);
   78 |     expect(closedRoom).toBeDefined();
   79 |     if (closedRoom) {
   80 |       expect(closedRoom.status).toBe('closed');
   81 |     }
   82 |   });
   83 |
   84 |   test('should not allow closing a room that does not exist', async ({ roomController }) => {
   85 |     const invalidRoomId = '99999';
   86 |     const playerResults: PlayerResult[] = [
   87 |       PlayerFactory.createPlayerResult(testUser.id, "100")
   88 |     ];
   89 |
   90 |     const response = await roomController.closeRoom(invalidRoomId, playerResults);
   91 |
   92 |     expect(response.status).toBe(404);
   93 |     expect(response.body).toHaveProperty('message');
   94 |   });
   95 |
   96 |   test.describe('Room Creation Validation', () => {
   97 |     test('should validate room name length (min 3, max 20 characters)', async ({ roomController }) => {
   98 |       const shortNameResponse = await roomController.createRoom(
   99 |         RoomFactory.createWithOverrides(testUser.id, { name: 'AB' })
  100 |       );
  101 |       expect(shortNameResponse.status).toBe(400);
  102 |       expect(shortNameResponse.body.message).toContain('Room name must be between 3 and 20 characters');
  103 |
  104 |       const longNameResponse = await roomController.createRoom(
  105 |         RoomFactory.createWithOverrides(testUser.id, { name: 'A'.repeat(21) })
  106 |       );
  107 |       expect(longNameResponse.status).toBe(400);
  108 |       expect(longNameResponse.body.message).toContain('Room name must be between 3 and 20 characters');
  109 |
  110 |       const emptyNameResponse = await roomController.createRoom(
  111 |         RoomFactory.createWithOverrides(testUser.id, { name: '' })
  112 |       );
  113 |       expect(emptyNameResponse.status).toBe(400);
  114 |       expect(emptyNameResponse.body.message).toContain('Room name is required');
  115 |     });
  116 |
  117 |     test('should validate exchange rate (must be integer ≥ 1)', async ({ roomController }) => {
  118 |       const zeroExchangeResponse = await roomController.createRoom(
  119 |         RoomFactory.createWithOverrides(testUser.id, { exchange: 0 })
  120 |       );
  121 |       expect(zeroExchangeResponse.status).toBe(400);
  122 |       expect(zeroExchangeResponse.body.message).toContain('Exchange rate must be at least 1');
  123 |
  124 |       const negativeExchangeResponse = await roomController.createRoom(
  125 |         RoomFactory.createWithOverrides(testUser.id, { exchange: -10 })
  126 |       );
  127 |       expect(negativeExchangeResponse.status).toBe(400);
  128 |       expect(negativeExchangeResponse.body.message).toContain('Exchange rate must be at least 1');
  129 |
  130 |       const nonIntExchangeResponse = await roomController.createRoom(
  131 |         RoomFactory.createWithOverrides(testUser.id, { exchange: 10.5 } as any)
  132 |       );
  133 |       expect(nonIntExchangeResponse.status).toBe(400);
  134 |       expect(nonIntExchangeResponse.body.message).toContain('Exchange rate must be an integer');
  135 |     });
  136 |
  137 |     test('should validate baseBuyIn (optional, but must be integer ≥ 1 if provided)', async ({ roomController }) => {
  138 |       const zeroBuyInResponse = await roomController.createRoom(
  139 |         RoomFactory.createWithOverrides(testUser.id, { baseBuyIn: 0 })
  140 |       );
  141 |       expect(zeroBuyInResponse.status).toBe(400);
  142 |       expect(zeroBuyInResponse.body.message).toContain('Base buy-in must be at least 1');
  143 |
  144 |       const negativeBuyInResponse = await roomController.createRoom(
  145 |         RoomFactory.createWithOverrides(testUser.id, { baseBuyIn: -10 })
```