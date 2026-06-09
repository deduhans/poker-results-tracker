import type { Player } from '@/types/player/Player';
import type { Room } from '@/types/room/Room';
import type { RoomStatusEnum } from '@/types/room/RoomStatusEnum';
import { defineStore } from 'pinia';

export const useRoomStore = defineStore('room', {
  state: (): { room: Room | null } => {
    const storedRoom = localStorage.getItem('room');
    return {
      room: storedRoom ? JSON.parse(storedRoom).room : null,
    };
  },

  getters: {
    roomId: (state): number | null => state.room?.id || null,
    roomStatus: (state): RoomStatusEnum | null => state.room?.status || null,
    roomPlayers: (state): Player[] | null => state.room?.players || null,
    roomExchange: (state): number | null => state.room?.exchange || null,
  },

  actions: {
    setRoom(room: Room) {
      this.room = room;
      localStorage.setItem('room', JSON.stringify(room));
    },

    clearRoom() {
      this.room = null;
      localStorage.removeItem('room');
    },
  },
});
