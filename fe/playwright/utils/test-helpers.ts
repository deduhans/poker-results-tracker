import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { RoomController } from '../controllers/RoomController';
import { UserFactory } from '../tests/api/test-data/user-data';
import { AuthFactory } from '../tests/api/test-data/auth-data';
import { RoomFactory } from '../tests/api/test-data/room-data';
import { User } from '../../src/types/user/User';
import { Room } from '../../src/types/room/Room';
import { Player } from '../../src/types/player/Player';

/**
 * Creates a new user and logs in
 * @param userController UserController instance
 * @param authController AuthController instance
 * @returns Object containing the created user and auth data
 */
export async function createAndLoginUser(
  userController: UserController,
  authController: AuthController
): Promise<User> {
  const userData = UserFactory.createValid();
  const userResponse = await userController.createUser(userData);

  if (userResponse.status !== 201) {
    throw new Error(`Failed to create user: ${JSON.stringify(userResponse.body)}`);
  }

  const user = userResponse.body;
  user.password = userData.password;

  const authData = AuthFactory.createFromUser(user);
  const loginResponse = await authController.login(authData);

  if (loginResponse.status !== 201) {
    throw new Error(`Failed to login: ${JSON.stringify(loginResponse.body)}`);
  }

  return user;
}

/**
 * Creates a new room for the specified user
 * @param roomController RoomController instance
 * @param userId User ID to create the room for
 * @returns The created room
 */
export async function createRoom(
  roomController: RoomController,
  userId: number
): Promise<Room> {
  const roomData = RoomFactory.createValid(userId);
  const response = await roomController.createRoom(roomData);

  if (response.status !== 201) {
    throw new Error(`Failed to create room: ${JSON.stringify(response.body)}`);
  }

  return response.body;
}

/**
 * Creates a user and room setup for tests
 * @param userController UserController instance
 * @param authController AuthController instance
 * @param roomController RoomController instance 
 * @returns Object containing user and room data
 */
export async function createBaseRoomTestSetup(
  userController: UserController,
  authController: AuthController,
  roomController: RoomController
): Promise<{ user: User; room: Room; player: Player }> {
  const user = await createAndLoginUser(userController, authController);
  const room = await createRoom(roomController, Number(user.id));
  const player = room.players[0];

  return {
    user,
    room,
    player
  };
}
