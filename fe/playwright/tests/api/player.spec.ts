import { test, expect } from '../../test-setup';
import { PlayerFactory } from './test-data/player-data';
import { User } from '../../../src/types/user/User';
import { Room } from '../../../src/types/room/Room';
import { PlayerRoleEnum } from '../../../src/types/player/PlayerRole';
import { createAndLoginUser, createBaseRoomTestSetup } from '../../utils/test-helpers';

test.describe('Player API', () => {
  let user: User;
  let room: Room;

  test.beforeEach(async ({ userController, authController, roomController }) => {
    ({ user, room } = await createBaseRoomTestSetup(userController, authController, roomController));
  });

  test('should create a player in a room', async ({ playerController }) => {
    const playerData = PlayerFactory.createValid(room.id);
    const response = await playerController.createPlayer(playerData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(playerData.name);
    expect(response.body.role).toBe(PlayerRoleEnum.Player);
  });

  test('should assign a player to the current user', async ({ userController, authController, playerController }) => {
    const playerData = PlayerFactory.createValid(room.id);
    const playerResponse = await playerController.createPlayer(playerData);
    const playerId = playerResponse.body.id;
    await createAndLoginUser(userController, authController);

    const response = await playerController.assignPlayerToUser(playerId);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.username).toBe(user.username);
  });

  test('should set a player as an admin', async ({ userController, authController, playerController }) => {
    const secondUser = await createAndLoginUser(userController, authController);
    const playerData = PlayerFactory.createValid(room.id, secondUser.id);
    const playerResponse = await playerController.createPlayer(playerData);
    const playerId = playerResponse.body.id;
    await authController.login(user);

    const response = await playerController.setPlayerAsAdmin(playerId);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(playerId);
    expect(response.body.role).toBe(PlayerRoleEnum.Admin);
  });

  test('should not allow setting a not assigned user as admin', async ({ userController, authController, playerController }) => {
    const secondUser = await createAndLoginUser(userController, authController);
    const playerData = PlayerFactory.createValid(room.id, secondUser.id);
    const playerResponse = await playerController.createPlayer(playerData);
    const playerId = playerResponse.body.id;

    const response = await playerController.setPlayerAsAdmin(playerId);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Only the host can set a player as admin');
  });

  test.describe('Player Validation', () => {
    test('should validate room ID is required', async ({ playerController }) => {
      const invalidPlayer = PlayerFactory.createWithOverrides(room.id, {
        roomId: undefined as any
      });

      const response = await playerController.createPlayer(invalidPlayer);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Room ID is required');
    });

    test('should validate room ID must be a number', async ({ playerController }) => {
      const invalidPlayer = PlayerFactory.createWithOverrides(room.id, {
        roomId: 'invalid' as any
      });

      const response = await playerController.createPlayer(invalidPlayer);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Room ID must be a number');
    });

    test('should validate player name is required', async ({ playerController }) => {
      const invalidPlayer = PlayerFactory.createWithOverrides(room.id, {
        name: ''
      });

      const response = await playerController.createPlayer(invalidPlayer);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Player name is required');
    });

    test('should validate player name length (min 3, max 20 characters)', async ({ playerController }) => {
      // Test with name that's too short (< 3 chars)
      const shortNameResponse = await playerController.createPlayer(
        PlayerFactory.createWithName(room.id, 'AB')
      );
      expect(shortNameResponse.status).toBe(400);
      expect(shortNameResponse.body.message).toContain('Player name must be between 3 and 20 characters');

      // Test with name that's too long (> 20 chars)
      const longNameResponse = await playerController.createPlayer(
        PlayerFactory.createWithName(room.id, 'A'.repeat(21))
      );
      expect(longNameResponse.status).toBe(400);
      expect(longNameResponse.body.message).toContain('Player name must be between 3 and 20 characters');
    });

    test('should validate player name contains only alphanumeric and spaces', async ({ playerController }) => {
      const invalidNameResponse = await playerController.createPlayer(
        PlayerFactory.createWithName(room.id, 'Player@123!')
      );
      expect(invalidNameResponse.status).toBe(400);
      expect(invalidNameResponse.body.message).toContain('Player name can only contain letters, numbers and spaces');
    });

    test('should validate user ID must be a number if provided', async ({ playerController }) => {
      const invalidPlayer = PlayerFactory.createWithOverrides(room.id, {
        userId: 'invalid' as any
      });

      const response = await playerController.createPlayer(invalidPlayer);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('User ID must be a number');
    });
  });

  test('should create player with user association', async ({ userController, authController, playerController }) => {
    const secondUser = await createAndLoginUser(userController, authController);
    const playerData = PlayerFactory.createValid(room.id, secondUser.id);

    const response = await playerController.createPlayer(playerData);

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.userId).toBe(secondUser.id);
    expect(response.body.name).toBe(playerData.name);
    expect(response.body.role).toBe(PlayerRoleEnum.Player);
    expect(response.body.createdAt).toBeDefined();
  });

  test('should not allow creating a player in a non-existent room', async ({ playerController }) => {
    const invalidRoomId = 99999;
    const playerData = PlayerFactory.createValid(invalidRoomId);

    const response = await playerController.createPlayer(playerData);

    expect(response.status).toBe(404);
    expect(response.body.message).toContain('Could not find room by id: ' + invalidRoomId);
  });

  test('should not allow assigning a player to non-existing user', async ({ playerController, authController }) => {
    // Create player without user association
    const playerData = PlayerFactory.createValid(room.id);
    const playerResponse = await playerController.createPlayer(playerData);
    expect(playerResponse.status).toBe(201);
    const playerId = playerResponse.body.id;

    // Logout current user
    await authController.logout();

    // Try to assign player - should fail with unauthorized
    const response = await playerController.assignPlayerToUser(playerId);

    expect(response.status).toBe(403);
  });
});
