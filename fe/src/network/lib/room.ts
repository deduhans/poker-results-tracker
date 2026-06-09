import type { Room } from '@/types/room/Room';
import axiosClient from '../apiClient';
import type { CreateRoom } from '@/types/room/CreateRoom';
import type { PlayerResult } from '@/types/player/PlayerResult';

class RoomController {
  private readonly CONTROLLER: string = '/rooms';

  async getRooms(): Promise<Room[]> {
    const url: string = `${this.CONTROLLER}`;
    const response = await axiosClient.get(url);

    return response.data as Room[];
  }

  async getRoom(id: number, accessToken?: string): Promise<Room> {
    let url: string = `${this.CONTROLLER}/${id}`;
    const params = new URLSearchParams();
    
    // Add access token as query parameter if provided
    if (accessToken) {
      params.append('token', accessToken);
    }
    
    // Add params to URL if any exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axiosClient.get(url);
    return response.data as Room;
  }

  async createRoom(createRoom: CreateRoom): Promise<Room> {
    const url: string = `${this.CONTROLLER}`;
    const response = await axiosClient.post(url, createRoom);

    return response.data as Room;
  }

  async closeRoom(id: number, playersResults: PlayerResult[], accessToken?: string): Promise<void> {
    let url: string = `${this.CONTROLLER}/close/${id}`;
    const params = new URLSearchParams();
    
    // Add access token as query parameter if provided
    if (accessToken) {
      params.append('token', accessToken);
    }
    
    // Add params to URL if any exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    await axiosClient.put(url, playersResults);
  }

  async regenerateAccessToken(id: number): Promise<string> {
    const url: string = `${this.CONTROLLER}/${id}/regenerate-token`;
    const response = await axiosClient.put(url);
    
    return response.data.accessToken;
  }

  // Generate a shareable URL for a room
  getShareableUrl(roomId: number, accessToken: string): string {
    // Get the base URL from the current window location
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    return `${baseUrl}/room/${roomId}?token=${accessToken}`;
  }
}

export default RoomController;