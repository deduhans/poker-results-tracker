<template>
  <v-btn v-if="isRoomOpened()" block color="error" @click="openDialog" data-cy="close-room-button">Close Room</v-btn>
  <v-dialog v-model="dialog" :max-width="$vuetify.display.mobile ? '100%' : '500px'"
    :fullscreen="$vuetify.display.mobile" data-cy="close-room-dialog">
    <v-card :class="{ 'mobile-card': $vuetify.display.mobile }">
      <v-toolbar v-if="$vuetify.display.mobile" color="primary" density="compact">
        <v-btn icon @click="dialog = false" :disabled="isClosing">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="text-subtitle-1">Close Room</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="closeRoom" :disabled="!canCloseRoom" :loading="isClosing">
          Done
        </v-btn>
      </v-toolbar>

      <template v-else>
        <v-card-title class="text-h6 px-4 pt-4">Close Room</v-card-title>
      </template>

      <v-card-text :class="{ 'px-4': !$vuetify.display.mobile }">
        <chips-distribution-stats :total="totalChipsCapacity" :distributed="totalValue" class="mb-4" />
        <v-list class="pa-0" density="compact">
          <player-distribution-row v-for="(player, index) in playersResults" :key="player.id" :id="player.id"
            :name="player.name" :is-host="player.isHost" :initial-value="player.initialValue"
            v-model:value="player.value" :exchange-rate="exchangeRate" :has-error="totalValue > totalChipsCapacity"
            @next="focusNextInput(index)" ref="playerRows" />
        </v-list>

        <v-alert v-if="totalValue > totalChipsCapacity" type="error" class="mt-4" density="compact" variant="tonal">
          Total distributed chips cannot exceed {{ totalChipsCapacity }}
        </v-alert>
      </v-card-text>

      <v-card-actions v-if="!$vuetify.display.mobile" class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="closeRoom" :disabled="!canCloseRoom" :loading="isClosing"
          data-cy="close-room-submit">
          Close Room
        </v-btn>
        <v-btn color="error" variant="text" @click="dialog = false" :disabled="isClosing">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import RoomController from '@/network/lib/room';
import { useRoomStore } from '@/stores/room';
import type { Player } from '@/types/player/Player';
import { PlayerRoleEnum } from '@/types/player/PlayerRole';
import type { PlayerResult } from '@/types/player/PlayerResult';
import type { Room } from '@/types/room/Room';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import PlayerDistributionRow from './PlayerDistributionRow.vue';
import ChipsDistributionStats from './ChipsDistributionStats.vue';
import { useChipsCalculation } from '@/composables/useChipsCalculation';
import currency from 'currency.js';

interface PlayerResultInput {
  id: number;
  name: string;
  value: number;
  isHost: boolean;
  initialValue: number;
}

const roomController = new RoomController();
const router = useRouter();
const roomStore = useRoomStore();
const { calculatePlayerChips, calculateTotalChips } = useChipsCalculation();

const dialog = ref(false);
const isClosing = ref(false);
const playersResults = ref<PlayerResultInput[]>([]);
const totalChipsCapacity = ref(0);
const exchangeRate = ref(0);
const playerRows = ref<InstanceType<typeof PlayerDistributionRow>[]>([]);

const openDialog = () => {
  const room = roomStore.room;
  if (!room) return;

  exchangeRate.value = room.exchange;
  totalChipsCapacity.value = calculateTotalChips(room.players, room.exchange);

  playersResults.value = room.players.map((player) => {
    const { initialValue } = calculatePlayerChips(player, room.exchange);
    return {
      id: player.id,
      name: player.name,
      value: 0,
      isHost: player.role === PlayerRoleEnum.Host,
      initialValue,
    };
  });

  dialog.value = true;
  // Focus first input on next tick after dialog is shown
  setTimeout(() => {
    const firstInput = document.querySelector('.chips-input input') as HTMLInputElement;
    if (firstInput) firstInput.focus();
  }, 100);
};

const focusNextInput = (currentIndex: number) => {
  const nextIndex = currentIndex + 1;
  if (nextIndex < playersResults.value.length) {
    const nextInput = document.querySelectorAll('.chips-input input')[nextIndex] as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }
};

const totalValue = computed(() => {
  return playersResults.value.reduce((sum, player) => sum + (player.value || 0), 0);
});

const canCloseRoom = computed(() => {
  return totalValue.value === totalChipsCapacity.value &&
    playersResults.value.every((player) =>
      player.value >= 0 && Number.isInteger(player.value),
    );
});

const closeRoom = async () => {
  if (!roomStore.room || !canCloseRoom.value) return;

  isClosing.value = true;
  try {
    const results: PlayerResult[] = playersResults.value.map((player) => ({
      id: player.id,
      income: currency(player.value || 0).toString(),
    }));

    await roomController.closeRoom(roomStore.room.id, results);
    const updatedRoom = await roomController.getRoom(roomStore.room.id);
    roomStore.setRoom(updatedRoom);
    dialog.value = false;
  } catch (error) {
    console.error('Failed to close room:', error);
  } finally {
    isClosing.value = false;
  }
};

const isRoomOpened = () => {
  return roomStore.roomStatus === 'opened';
};
</script>

<style scoped>
.mobile-card {
  border-radius: 0;
}
</style>