<template>
  <v-btn @click="openDialog" color="primary" prepend-icon="mdi-plus" data-cy="create-room-button">
    New Room
  </v-btn>

  <v-dialog v-model="dialog" max-width="500px" :persistent="loading" data-cy="create-room-dialog">
    <v-card>
      <v-card-title class="text-h5">Create New Room</v-card-title>

      <v-card-text>
        <v-alert v-if="error" type="error" variant="outlined" density="compact" class="mb-4"
          data-cy="create-room-error">
          {{ errorMessage }}
        </v-alert>

        <v-form ref="form" v-model="valid" @submit.prevent="createRoom" data-cy="create-room-form">
          <v-text-field v-model="name" label="Room Name" :rules="nameRules" required :disabled="loading"
            data-cy="room-name-input"></v-text-field>

          <v-select v-model="currency" label="Currency" :items="currencyOptions" :rules="currencyRules" required
            :disabled="loading" data-cy="room-currency-input"></v-select>

          <v-text-field v-model="exchange" label="Exchange Rate" type="number" :rules="exchangeRules" required
            :disabled="loading" :hint="`Minimum bet amount in ${currency}`" persistent-hint
            data-cy="room-exchange-input"></v-text-field>

          <v-text-field v-model="baseBuyIn" label="Base Buy-In" type="number" :rules="baseBuyInRules" required
            :disabled="loading" :hint="`Default buy-in amount in ${currency}`" persistent-hint
            data-cy="room-base-buy-in-input"></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="closeDialog" :disabled="loading" data-cy="cancel-button">
          Cancel
        </v-btn>
        <v-btn color="primary" @click="createRoom" :loading="loading" :disabled="!valid || loading"
          data-cy="create-button">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import RoomController from '@/network/lib/room';
import { useUserStore } from '@/stores/user';
import type { CreateRoom } from '@/types/room/CreateRoom';
import type { Room } from '@/types/room/Room';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CurrencyEnum } from '@/types/room/CurrencyEnum';

const roomController = new RoomController();
const userStore = useUserStore();
const router = useRouter();

const dialog = ref(false);
const name = ref('');
const exchange = ref<number>(10);
const currency = ref<CurrencyEnum>(CurrencyEnum.USD);
const baseBuyIn = ref<number>(50);
const valid = ref(false);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const currencyOptions = Object.values(CurrencyEnum);

const nameRules = [
  (v: string) => !!v || 'Room name is required',
  (v: string) => (v && v.length >= 3) || 'Name must be at least 3 characters',
  (v: string) => (v && v.length <= 20) || 'Name must be less than 20 characters',
];

const exchangeRules = [
  (v: number | null) => v !== null || 'Exchange rate is required',
  (v: number | null) => (v !== null && v > 0) || 'Exchange rate must be greater than 0',
  (v: number | null) => (v !== null && v <= 1000) || 'Exchange rate must be less than 1000',
];

const baseBuyInRules = [
  (v: number | null) => v !== null || 'Base buy-in is required',
  (v: number | null) => (v !== null && v >= 1) || 'Base buy-in must be at least 1',
  (v: number | null) => (v !== null && v <= 10000) || 'Base buy-in must be less than 10000',
];

const currencyRules = [
  (v: CurrencyEnum) => !!v || 'Currency is required',
  (v: CurrencyEnum) => Object.values(CurrencyEnum).includes(v) || 'Invalid currency',
];

const openDialog = () => {
  resetForm();
  dialog.value = true;
};

const closeDialog = () => {
  if (!loading.value) {
    dialog.value = false;
    resetForm();
  }
};

const resetForm = () => {
  name.value = '';
  exchange.value = 10;
  currency.value = CurrencyEnum.USD;
  baseBuyIn.value = 50;
  error.value = false;
  errorMessage.value = '';
  valid.value = false;
};

const createRoom = async () => {
  if (!valid.value || !userStore.userId) {
    return;
  }

  loading.value = true;
  error.value = false;
  errorMessage.value = '';

  try {
    const createRoomDto: CreateRoom = {
      name: name.value.trim(),
      exchange: Number(exchange.value) || 10,
      hostId: userStore.userId,
      currency: currency.value,
      baseBuyIn: Number(baseBuyIn.value),
      isVisible: true, // Always visible since we don't have the toggle anymore
    };

    const room: Room = await roomController.createRoom(createRoomDto);
    dialog.value = false;
    
    // Include access token in route if available
    if (room.accessToken) {
      router.push({ 
        name: 'room', 
        params: { id: room.id },
        query: { token: room.accessToken }
      });
    } else {
      router.push({ name: 'room', params: { id: room.id } });
    }
  } catch (e: any) {
    error.value = true;
    errorMessage.value = e.response?.data?.message || 'Failed to create room';
    console.error('Error creating room:', e);
  } finally {
    loading.value = false;
  }
};
</script>
