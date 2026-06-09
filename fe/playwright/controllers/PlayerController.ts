import { APIRequestContext } from '@playwright/test';
import { BaseController, ApiResponse } from './BaseController';
import { CreatePlayer } from '../../src/types/player/CreatePlayer';
import { Player } from '../../src/types/player/Player';

export class PlayerController extends BaseController {
  constructor(request: APIRequestContext) {
    super(request, '/players');
  }

  /**
   * Create a new player in a room
   * @param player Player data for creation
   * @returns API response with the created player
   */
  async createPlayer(player: CreatePlayer): Promise<ApiResponse<Player | any>> {
    return this.post('', player);
  }

  /**
   * Assign a player to the current authenticated user
   * @param playerId The ID of the player to assign
   * @returns API response with the updated player
   */
  async assignPlayerToUser(playerId: number): Promise<ApiResponse<Player | any>> {
    return this.patch(`${playerId}/assign`, {});
  }

  /**
   * Set a player as an admin (can only be done by the host)
   * @param playerId The ID of the player to promote
   * @returns API response with the updated player
   */
  async setPlayerAsAdmin(playerId: number): Promise<ApiResponse<Player | any>> {
    return this.patch(`${playerId}/setAdmin`, {});
  }

  /**
   * Get a player by ID
   * @param playerId The ID of the player to retrieve
   * @returns API response with the player data
   */
  async getPlayer(playerId: number): Promise<ApiResponse<Player | any>> {
    return this.get(`${playerId}`);
  }
}
