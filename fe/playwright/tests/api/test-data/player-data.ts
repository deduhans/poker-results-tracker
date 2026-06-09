import { faker } from '@faker-js/faker';
import { PlayerResult } from '../../../../src/types/player/PlayerResult';
import { CreatePlayer } from '../../../../src/types/player/CreatePlayer';

export class PlayerFactory {
  /**
   * Creates a valid player result
   * @param id The ID of the player
   * @param income Optional income value (defaults to 0)
   * @returns A PlayerResult object
   */
  static createPlayerResult(id: number, income?: string): PlayerResult {
    return {
      id,
      income: income || '0'
    };
  }

  /**
   * Creates an array of player results
   * @param playerIds Array of player IDs
   * @returns An array of PlayerResult objects
   */
  static createPlayerResults(playerIds: number[]): PlayerResult[] {
    return playerIds.map(id => this.createPlayerResult(id));
  }

  /**
   * Creates a valid player for creation
   * @param roomId The ID of the room
   * @param userId Optional user ID to associate with the player
   * @returns A CreatePlayer object
   */
  static createValid(roomId: number, userId?: number): CreatePlayer {
    return {
      roomId,
      name: `Player ${faker.person.firstName()}`.substring(0, 20),
      userId
    };
  }

  /**
   * Creates a player with a specific name
   * @param roomId The room ID
   * @param name The player name
   * @param userId Optional user ID
   * @returns A CreatePlayer object
   */
  static createWithName(roomId: number, name: string, userId?: number): CreatePlayer {
    return {
      roomId,
      name,
      userId
    };
  }

  /**
   * Creates a player with custom properties
   * @param roomId The room ID
   * @param overrides Properties to override in the base player
   * @returns A CreatePlayer object with overridden properties
   */
  static createWithOverrides(roomId: number, overrides: Partial<CreatePlayer>): CreatePlayer {
    return {
      ...this.createValid(roomId),
      ...overrides
    };
  }

  /**
   * Creates a batch of players
   * @param roomId The room ID
   * @param count Number of players to create
   * @returns An array of CreatePlayer objects
   */
  static createBatch(roomId: number, count: number): CreatePlayer[] {
    return Array.from({ length: count }, () => this.createValid(roomId));
  }
}
