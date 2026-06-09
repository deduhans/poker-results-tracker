<template>
  <v-card class="mx-auto my-0 player-card" :class="{ 'assigned-user': player.userId }">
    <v-card-item>
      <!-- Player Name and Details -->
      <v-row class="mb-0">
        <v-col cols="auto" class="mr-1">
          <v-icon v-if="player.role === PlayerRoleEnum.Host" color="warning" icon="mdi-crown" size="small"></v-icon>
          <v-icon v-else-if="player.role === PlayerRoleEnum.Admin" color="success" icon="mdi-shield-account"
            size="small"></v-icon>
          <v-icon v-else :color="player.userId ? 'primary' : 'grey'" icon="mdi-account" size="small"></v-icon>
        </v-col>
        <v-col>
          <div class="d-flex flex-column">
            <v-card-title class="text-subtitle-1 py-0 font-weight-bold d-flex align-center">
              {{ player.name }}
              <span v-if="player.username" class="text-caption ml-1">
                ({{ player.username }})
              </span>
              <div class="ml-auto d-flex">
                <v-btn v-if="isOpened() && canSetPlayerAsAdmin" @click="setAsAdmin" color="success" variant="outlined"
                  class="action-icon-btn promote-btn mr-1" :loading="setAdminLoading" title="Promote to Admin"
                  icon="mdi-shield-plus">
                </v-btn>
                <v-btn v-if="isOpened() && canBeAssignedToUser" @click="assignToUser" size="x-small" color="info"
                  variant="outlined" class="assign-btn" :loading="assignLoading" title="Assign to me">
                  <v-icon start size="small" icon="mdi-account-plus"></v-icon>
                  <span class="text-caption">Assign</span>
                </v-btn>
              </div>
            </v-card-title>
          </div>
        </v-col>
      </v-row>

      <!-- Financial Details -->
      <v-row v-if="isOpened()" class="my-0">
        <v-col cols="6" class="py-2">
          <div class="d-flex flex-column">
            <div class="text-caption text-medium-emphasis">Spent</div>
            <div class="text-body-2 font-weight-medium">{{ formatCurrency(totalSpend()) }}</div>
          </div>
        </v-col>
        <v-col cols="6" class="py-2 d-flex">
          <div class="d-flex flex-column">
            <div class="text-caption text-medium-emphasis">Income</div>
            <div class="text-body-2 font-weight-medium">{{ formatCurrency(totalIncome()) }}</div>
          </div>
          <v-btn v-if="isOpened()" @click="createBuyIn" size="x-small" color="primary" variant="text"
            icon="mdi-cash-plus" class="ml-auto add-payment-btn align-self-center" :loading="buyInLoading"
            title="Buy In" data-cy="create-buyin-button">
          </v-btn>
          <v-btn v-if="isOpened()" @click="createCashOut" size="x-small" color="success" variant="text"
            icon="mdi-cash-minus" class="add-payment-btn align-self-center" :loading="cashOutLoading" title="Cash Out"
            data-cy="create-cashout-button">
          </v-btn>
        </v-col>
      </v-row>
      <!-- Total Cash Out (visible only when room is closed) -->
      <v-row v-else class="my-0">
        <v-col cols="12" class="py-2">
          <div class="d-flex flex-column">
            <div class="text-caption text-medium-emphasis">Total Cash Out</div>
            <div :class="[
              'text-body-1 font-weight-bold',
              totalCashOut() > 0 ? 'text-success' : totalCashOut() < 0 ? 'text-error' : ''
            ]">
              {{ formatCurrency(totalCashOut()) }}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
import ExchangeController from '@/network/lib/exchange';
import RoomController from '@/network/lib/room';
import PlayerController from '@/network/lib/player';
import { useUserStore } from '@/stores/user';
import { useRoomStore } from '@/stores/room';
import type { CreateExchange } from '@/types/exchange/CreateExchange';
import { ExchangeDirectionEnum } from '@/types/exchange/ExchangeDirectionEnum';
import type { Player } from '@/types/player/Player';
import { PlayerRoleEnum } from '@/types/player/PlayerRole';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import currency from 'currency.js';

const exchangeController = new ExchangeController();
const roomController = new RoomController();
const playerController = new PlayerController();
const userStore = useUserStore();
const roomStore = useRoomStore();
const router = useRouter();
const loading = ref(false);
const assignLoading = ref(false);
const setAdminLoading = ref(false);
const buyInLoading = ref(false);
const cashOutLoading = ref(false);

const props = defineProps<{
  roomId: number,
  player: Player,
  status: any
}>();

// Check if current user is assigned to any player in this room
const isCurrentUserInRoom = computed(() => {
  return roomStore.room?.players.some(p => p.userId === userStore.userId);
});

// Check if current user is the host of the room
const isCurrentUserHost = computed(() => {
  return roomStore.room?.players.some(p =>
    p.role === PlayerRoleEnum.Host &&
    p.userId === userStore.userId
  );
});

// Can this player be assigned to the current user?
const canBeAssignedToUser = computed(() => {
  return isOpened() &&
    userStore.userId &&
    !isCurrentUserInRoom.value &&
    !props.player.userId;
});

// Can the current user set this player as admin?
const canSetPlayerAsAdmin = computed(() => {
  return isOpened() &&
    isCurrentUserHost.value &&
    props.player.role !== PlayerRoleEnum.Host &&
    props.player.role !== PlayerRoleEnum.Admin &&
    !!props.player.userId;
});

const createBuyIn = async () => {
  if (!userStore.userId || !roomStore.room) {
    return;
  }

  buyInLoading.value = true;
  const newExchange: CreateExchange = {
    roomId: props.roomId,
    playerId: props.player.id,
    amount: roomStore.room.baseBuyIn,
    type: ExchangeDirectionEnum.BuyIn,
  };

  await exchangeController.createExchange(newExchange);
  const updatedRoom = await roomController.getRoom(props.roomId);
  roomStore.setRoom(updatedRoom);
  buyInLoading.value = false;
};

const createCashOut = async () => {
  if (!userStore.userId || !roomStore.room) {
    return;
  }

  cashOutLoading.value = true;
  const cashOutAmount = roomStore.room.baseBuyIn * roomStore.room.exchange;
  const newExchange: CreateExchange = {
    roomId: props.roomId,
    playerId: props.player.id,
    amount: cashOutAmount,
    type: ExchangeDirectionEnum.CashOut,
  };

  await exchangeController.createExchange(newExchange);
  const updatedRoom = await roomController.getRoom(props.roomId);
  roomStore.setRoom(updatedRoom);
  cashOutLoading.value = false;
};

const assignToUser = async () => {
  if (!canBeAssignedToUser.value || assignLoading.value) return;

  assignLoading.value = true;
  try {
    await playerController.assignPlayerToUser(props.player.id);
    const updatedRoom = await roomController.getRoom(props.roomId);
    roomStore.setRoom(updatedRoom);
  } catch (error) {
    console.error('Failed to assign player to user:', error);
  } finally {
    assignLoading.value = false;
  }
};

const setAsAdmin = async () => {
  if (!canSetPlayerAsAdmin.value || setAdminLoading.value) return;

  setAdminLoading.value = true;
  try {
    await playerController.setPlayerAsAdmin(props.player.id);
    const updatedRoom = await roomController.getRoom(props.roomId);
    roomStore.setRoom(updatedRoom);
  } catch (error) {
    console.error('Failed to set player as admin:', error);
  } finally {
    setAdminLoading.value = false;
  }
};

const isOpened = () => {
  return props.status === 'opened';
};

const totalSpend = () => {
  let total = currency(0);

  props.player.exchanges
    ?.filter((payment) => payment.direction === ExchangeDirectionEnum.BuyIn)
    .forEach((payment) => {
      total = total.add(payment.cashAmount || '0');
    });

  return total.value;
};

const totalIncome = () => {
  let total = currency(0);

  props.player.exchanges
    ?.filter((payment) => payment.direction === ExchangeDirectionEnum.CashOut)
    .forEach((payment) => {
      total = total.add(payment.cashAmount || '0');
    });

  return total.value;
};

const totalCashOut = () => {
  // Total Cash Out is Income - Spent (profit/loss)
  return totalIncome() - totalSpend();
};

const formatCurrency = (value: number) => {
  return currency(value, { symbol: '€', decimal: '.', separator: ',' }).format();
};
</script>

<style scoped>
.player-card {
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.player-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md) !important;
}

.assigned-user {
  border-left: 3px solid var(--primary);
  border-right: 3px solid var(--primary);
}

.assign-btn {
  padding: 0 var(--space-sm) !important;
  min-width: 60px !important;
  height: 24px !important;
  font-size: var(--font-size-xs) !important;
}

.action-icon-btn {
  padding: 0 !important;
  min-width: 28px !important;
  height: 28px !important;
  font-size: var(--font-size-xs) !important;
  margin-right: var(--space-xs) !important;
}

.promote-btn {
  border: 1px solid var(--success) !important;
  min-width: 40px !important;
  padding: 0 var(--space-xs) !important;
}

.promote-arrow {
  margin-right: -3px;
  font-size: 10px;
  color: var(--success);
  opacity: 0.9;
}

.add-payment-btn {
  padding: 0 !important;
  min-width: 28px !important;
  height: 28px !important;
  font-size: var(--font-size-xs) !important;
}
</style>
