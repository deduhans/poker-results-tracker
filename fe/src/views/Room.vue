<template>
    <v-container fluid class="pa-3">
        <v-row justify="space-between" align="center" class="mb-4 px-2">
            <v-card-title class="text-h4" data-cy="room-header">{{ name }}</v-card-title>
            <div class="d-flex align-center">
                <ShareRoom v-if="roomData" :room="roomData" @token-updated="onTokenUpdated" data-cy="share-room" />
                <NewPlayer v-if="isOpened()" :roomId="Number(id)" data-cy="new-player-button" />
            </div>
        </v-row>

        <v-row>
            <v-col cols="12" md="4">
                <v-card data-cy="room-details-card">
                    <v-card-item>
                        <v-card-title class="text-h6 mb-2">Room Details</v-card-title>
                        <v-row>
                            <v-col cols="6">
                                <div class="d-flex flex-column">
                                    <v-card-subtitle class="py-1" data-cy="room-exchange">Exchange: {{ exchange
                                        }}</v-card-subtitle>
                                    <v-card-subtitle class="py-1" data-cy="room-total-money">Total Money: {{
                                        formatCurrency(capacity)
                                        }}</v-card-subtitle>
                                    <v-card-subtitle class="py-1" data-cy="room-total-chips">Total Chips: {{
                                        formatNumber(chipsCapacity) }}</v-card-subtitle>
                                </div>
                            </v-col>
                            <v-col cols="6">
                                <div class="d-flex flex-column">
                                    <v-card-subtitle class="py-1" data-cy="room-status">Status: {{ status
                                        }}</v-card-subtitle>
                                    <v-card-subtitle class="py-1" data-cy="room-created">Created: {{ created
                                        }}</v-card-subtitle>
                                    <v-card-subtitle class="py-1" data-cy="room-players-count">Players: {{
                                        players?.length || 0 }}</v-card-subtitle>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="8">
                <section data-cy="players-card">
                    <h2 class="text-h6 mb-2 px-1">Players</h2>
                    <v-row v-if="sortedPlayers && sortedPlayers.length > 0" data-cy="players-list">
                        <v-col v-for="player in sortedPlayers" :key="player.id" cols="12" sm="6" lg="4">
                            <Player :roomId="Number(id)" :player="player" :status="status" data-cy="player-item" />
                        </v-col>
                    </v-row>
                    <div v-else class="text-center pa-4" data-cy="no-players-message">
                        <v-icon icon="mdi-account-multiple-plus" size="x-large" color="grey-lighten-1"
                            class="mb-2"></v-icon>
                        <div class="text-body-1 text-grey">No players have joined yet</div>
                        <div v-if="isOpened()" class="text-caption text-grey-darken-1">Click the "Add Player" button
                            to add players to the room</div>
                        <div v-else class="text-caption text-grey-darken-1" data-cy="room-closed-message">This room
                            is closed and cannot accept new players</div>
                    </div>
                </section>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <section data-cy="payment-history-card">
                    <h2 class="text-h6 mb-2 px-1">Payment History</h2>
                    <v-list v-if="payments && payments.length > 0" data-cy="payment-history-list">
                        <PaymentInfo v-for="payment in payments" :key="payment.id" :payment="payment"
                            data-cy="payment-item" />
                    </v-list>
                    <div v-else class="text-center pa-4" data-cy="no-payments-message">
                        <v-icon icon="mdi-cash-clock" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
                        <div class="text-body-1 text-grey">No payments have been made yet</div>
                        <div class="text-caption text-grey-darken-1">Click the + button on a player card to add a
                            payment</div>
                    </div>
                </section>
            </v-col>
        </v-row>

        <v-row class="mt-4" v-if="isOpened()">
            <v-col cols="12">
                <CloseRoomPopup />
            </v-col>
        </v-row>
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
