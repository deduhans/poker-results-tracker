import type { CreatePlayer } from '@/types/player/CreatePlayer';
import axiosClient from '../apiClient';
import type { Player } from '@/types/player/Player';

class PlayerController {
  private readonly CONTROLLER = '/players';

  async createPlayer(createPlayer: CreatePlayer): Promise<Player> {
    const url: string = `${this.CONTROLLER}`;

    const response = await axiosClient.post(url, createPlayer);

    return response.data as Player;
  }

  async assignPlayerToUser(playerId: number): Promise<Player> {
    const url: string = `${this.CONTROLLER}/${playerId}/assign`;

    const response = await axiosClient.patch(url);

    return response.data as Player;
  }

  async setPlayerAsAdmin(playerId: number): Promise<Player> {
    const url: string = `${this.CONTROLLER}/${playerId}/setAdmin`;

    const response = await axiosClient.patch(url);

    return response.data as Player;
  }
}

export default PlayerController;