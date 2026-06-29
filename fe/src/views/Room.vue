<template>
    <v-container fluid class="pa-3">
        <!-- Header -->
        <div class="d-flex flex-wrap align-center justify-space-between mb-1 ga-3">
            <div class="d-flex align-center ga-3 flex-wrap">
                <h1 class="text-h5 font-weight-bold mb-0" data-cy="room-header">{{ name }}</h1>
                <v-chip :color="isOpened() ? 'success' : 'grey'" variant="flat" size="small" label
                    data-cy="room-status">
                    <v-icon start size="small">{{ isOpened() ? 'mdi-door-open' : 'mdi-door-closed' }}</v-icon>
                    {{ status }}
                </v-chip>
            </div>
            <div class="d-flex align-center ga-2">
                <ShareRoom v-if="roomData" :room="roomData" @token-updated="onTokenUpdated" data-cy="share-room" />
            </div>
        </div>
        <div class="text-caption text-medium-emphasis mb-4" data-cy="room-created">Created {{ created }}</div>

        <!-- Summary stat tiles -->
        <v-card variant="flat" border class="mb-2" data-cy="room-details-card">
            <v-row no-gutters>
                <v-col cols="4" class="stat-col">
                    <div class="pa-3">
                        <div class="text-caption text-medium-emphasis">On table</div>
                        <div class="text-subtitle-2 font-weight-bold mt-1" data-cy="room-total-money">{{ formatCurrency(capacity) }}</div>
                    </div>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="4" class="stat-col">
                    <div class="pa-3">
                        <div class="text-caption text-medium-emphasis">Total chips</div>
                        <div class="text-subtitle-2 font-weight-bold mt-1" data-cy="room-total-chips">{{ formatNumber(chipsCapacity) }}</div>
                    </div>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="4" class="stat-col">
                    <div class="pa-3">
                        <div class="text-caption text-medium-emphasis">Exchange</div>
                        <div class="text-subtitle-2 font-weight-bold mt-1" data-cy="room-exchange">1 : {{ exchange }}</div>
                    </div>
                </v-col>
            </v-row>
        </v-card>

        <!-- Players -->
        <section class="mt-6" data-cy="players-card">
            <div class="d-flex align-center ga-2 mb-3 px-1">
                <v-icon color="primary">mdi-account-multiple</v-icon>
                <h2 class="text-h6 mb-0">Players</h2>
                <v-chip v-if="players?.length" size="x-small" variant="tonal" color="primary"
                    data-cy="room-players-count">{{ players.length }}</v-chip>
                <v-spacer></v-spacer>
                <NewPlayer v-if="isOpened()" :roomId="Number(id)" data-cy="new-player-button" />
            </div>
            <v-row v-if="sortedPlayers && sortedPlayers.length > 0" data-cy="players-list">
                <v-col v-for="player in sortedPlayers" :key="player.id" cols="12" sm="6" lg="4">
                    <Player :roomId="Number(id)" :player="player" :status="status" data-cy="player-item" />
                </v-col>
            </v-row>
            <v-card v-else variant="flat" border class="text-center pa-8" data-cy="no-players-message">
                <v-icon icon="mdi-account-multiple-plus" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
                <div class="text-body-1 text-medium-emphasis">No players have joined yet</div>
                <div v-if="isOpened()" class="text-caption text-medium-emphasis">Click the "Add Player" button
                    to add players to the room</div>
                <div v-else class="text-caption text-medium-emphasis" data-cy="room-closed-message">This room
                    is closed and cannot accept new players</div>
            </v-card>
        </section>

        <!-- Payment History -->
        <section class="mt-8" data-cy="payment-history-card">
            <div class="d-flex align-center ga-2 mb-3 px-1">
                <v-icon color="primary">mdi-history</v-icon>
                <h2 class="text-h6 mb-0">Payment History</h2>
                <v-chip v-if="payments?.length" size="x-small" variant="tonal" color="primary">{{ payments.length
                    }}</v-chip>
            </div>
            <v-card v-if="payments && payments.length > 0" variant="flat" border>
                <v-list class="py-0 payment-list" data-cy="payment-history-list">
                    <PaymentInfo v-for="payment in payments" :key="payment.id" :payment="payment"
                        data-cy="payment-item" />
                </v-list>
            </v-card>
            <v-card v-else variant="flat" border class="text-center pa-8" data-cy="no-payments-message">
                <v-icon icon="mdi-cash-clock" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
                <div class="text-body-1 text-medium-emphasis">No payments have been made yet</div>
                <div class="text-caption text-medium-emphasis">Click the + button on a player card to add a
                    payment</div>
            </v-card>
        </section>

        <div class="mt-8" v-if="isOpened()">
            <CloseRoomPopup />
        </div>
    </v-container>
</template>

<script setup lang="ts">
import CloseRoomPopup from '@/components/CloseRoomPopup.vue';
import NewPlayer from '@/components/NewPlayer.vue';
import PaymentInfo from '@/components/PaymentInfo.vue';
import Player from '@/components/Player.vue';
import ShareRoom from '@/components/ShareRoom.vue';
import RoomController from '@/network/lib/room';
import { useRoomStore } from '@/stores/room';
import type { Room } from '@/types/room/Room';
import type { Player as PlayerType } from '@/types/player/Player';
import type { ExchangeDetails } from '@/types/exchange/ExchangeDetails';
import { ExchangeDirectionEnum } from '@/types/exchange/ExchangeDirectionEnum';
import { RoomStatusEnum } from '@/types/room/RoomStatusEnum';
import { PlayerRoleEnum } from '@/types/player/PlayerRole';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const roomController = new RoomController();
const router = useRouter();
const route = useRoute();
const roomStore = useRoomStore();

const props = defineProps<{
    id: string
}>();

const roomData = computed<Room | null>(() => roomStore.room);

const name = computed(() => roomData.value?.name ?? '');
const status = computed<RoomStatusEnum | null>(() => roomData.value?.status ?? null);
const exchange = computed(() => roomData.value?.exchange ?? 0);
const created = computed(() => (roomData.value ? formatDate(roomData.value.createdAt) : ''));
const players = computed<PlayerType[]>(() => roomData.value?.players ?? []);
const capacity = computed(() => getCapacity(roomData.value));
const chipsCapacity = computed(() => capacity.value * exchange.value);
const payments = computed<ExchangeDetails[]>(() => getPayments(roomData.value));

const updateRoom = async () => {
    try {
        const accessToken = route.query.token as string | undefined;
        const room: Room = await roomController.getRoom(Number(props.id), accessToken);
        roomStore.setRoom(room);
    } catch (error: any) {
        console.error('Error loading room:', error);

        if (error.response?.status === 403) {
            router.push({ name: 'home', query: { error: 'room-access-denied' } });
        }
    }
};

onMounted(() => updateRoom());

const onTokenUpdated = (token: string) => {
    if (roomStore.room) {
        roomStore.setRoom({ ...roomStore.room, accessToken: token });
    }
};

const getPayments = (room: Room | null): ExchangeDetails[] => {
    if (!room?.players) return [];

    const allPayments: ExchangeDetails[] = [];
    room.players.forEach(player => {
        player.exchanges?.forEach(exchange => {
            allPayments.push({
                id: exchange.id,
                amount: parseFloat(exchange.cashAmount),
                date: formatDate(exchange.createdAt),
                playerName: player.name,
                type: exchange.direction
            });
        });
    });

    return allPayments.sort((a, b) => b.id - a.id);
};

const getCapacity = (room: Room | null): number => {
    if (!room?.players) return 0;

    let totalBuyIn = 0;
    let totalCashOut = 0;

    room.players.forEach(player => {
        player.exchanges?.forEach(exchange => {
            const amount = parseFloat(exchange.cashAmount);
            if (exchange.direction === ExchangeDirectionEnum.BuyIn) {
                totalBuyIn += amount;
            } else if (exchange.direction === ExchangeDirectionEnum.CashOut) {
                totalCashOut += amount;
            }
        });
    });

    return totalBuyIn - totalCashOut;
};

const isOpened = () => {
    return status.value === RoomStatusEnum.Opened;
};

const roleOrder: Record<PlayerRoleEnum, number> = {
    [PlayerRoleEnum.Host]: 0,
    [PlayerRoleEnum.Admin]: 1,
    [PlayerRoleEnum.Player]: 2,
};

const sortedPlayers = computed(() => {
    return [...players.value].sort((a, b) => {
        const roleA = roleOrder[a.role] ?? 3;
        const roleB = roleOrder[b.role] ?? 3;

        if (roleA !== roleB) {
            return roleA - roleB;
        }

        return a.name.localeCompare(b.name);
    });
});
</script>

<style scoped>
.stat-tile {
    transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.stat-tile:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm) !important;
}

.payment-list {
    max-height: 360px;
    overflow-y: auto;
}
</style>
