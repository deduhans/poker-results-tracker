import { APIRequestContext } from '@playwright/test';
import { BaseController, ApiResponse } from './BaseController';
import { CreateRoom } from '../../src/types/room/CreateRoom';
import { Room } from '../../src/types/room/Room';
import { PlayerResult } from '../../src/types/player/PlayerResult';

export class RoomController extends BaseController {
  constructor(request: APIRequestContext) {
    super(request, '/rooms');
  }

  async createRoom(room: CreateRoom): Promise<ApiResponse<Room | any>> {
    return this.post('', room);
  }

  async getRooms(): Promise<ApiResponse<Room[] | any>> {
    return this.get();
  }

  async getRoom(roomId: number | string): Promise<ApiResponse<Room | any>> {
    return this.get(`${roomId}`);
  }

  async closeRoom(roomId: string, playerResults: PlayerResult[]): Promise<ApiResponse<Room | any>> {
    return this.put(`close/${roomId}`, playerResults);
  }

  async generateToken(roomId: string): Promise<ApiResponse> {
    return this.put(`${roomId}/regenerate-token`);
  }
}
