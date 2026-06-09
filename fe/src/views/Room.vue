<template>
    <v-container fluid class="pa-3">
        <v-row justify="space-between" align="center" class="mb-4 px-2">
            <v-card-title class="text-h4" data-cy="room-header">{{ name }}</v-card-title>
            <div class="d-flex align-center">
                <ShareRoom v-if="roomData" :room="roomData" data-cy="share-room" />
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
                <v-card data-cy="players-card">
                    <v-card-item>
                        <v-card-title class="text-h6 mb-2">Players</v-card-title>
                        <v-row v-if="sortedPlayers && sortedPlayers.length > 0" data-cy="players-list">
                            <v-col v-for="player in sortedPlayers" :key="player.id" cols="12" sm="6" lg="4">
                                <Player :roomId="Number(id)" :player="player" :status="status" data-cy="player-item" />
                            </v-col>
                        </v-row>
                        <v-card-text v-else class="text-center pa-4" data-cy="no-players-message">
                            <v-icon icon="mdi-account-multiple-plus" size="x-large" color="grey-lighten-1"
                                class="mb-2"></v-icon>
                            <div class="text-body-1 text-grey">No players have joined yet</div>
                            <div v-if="isOpened()" class="text-caption text-grey-darken-1">Click the "Add Player" button
                                to add players to the room</div>
                            <div v-else class="text-caption text-grey-darken-1" data-cy="room-closed-message">This room
                                is closed and cannot accept new players</div>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <v-card data-cy="payment-history-card">
                    <v-card-item>
                        <v-card-title class="text-h6 mb-2">Payment History</v-card-title>
                        <v-list v-if="payments && payments.length > 0" data-cy="payment-history-list">
                            <PaymentInfo v-for="payment in payments" :key="payment.id" :payment="payment"
                                data-cy="payment-item" />
                        </v-list>
                        <v-card-text v-else class="text-center pa-4" data-cy="no-payments-message">
                            <v-icon icon="mdi-cash-clock" size="x-large" color="grey-lighten-1" class="mb-2"></v-icon>
                            <div class="text-body-1 text-grey">No payments have been made yet</div>
                            <div class="text-caption text-grey-darken-1">Click the + button on a player card to add a
                                payment</div>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4" v-if="isOpened()">
            <v-col cols="12">
                <CloseRoomPopup data-cy="close-room-popup" />
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
import { useUserStore } from '@/stores/user';
import type { Room } from '@/types/room/Room';
import type { Exchange } from '@/types/exchange/Exchange';
import type { ExchangeDetails } from '@/types/exchange/ExchangeDetails';
import { ExchangeDirectionEnum } from '@/types/exchange/ExchangeDirectionEnum';
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import currency from 'currency.js';

const roomController = new RoomController();
const router = useRouter();
const route = useRoute();
const roomStore = useRoomStore();
const userStore = useUserStore();

const name = ref();
const players = ref();
const payments = ref<ExchangeDetails[]>([]);
const status = ref();
const roomId = ref<number | null>(null);
const exchange = ref();
const created = ref();
const capacity = ref<number>(0);
const chipsCapacity = ref<number>(0);
const roomData = ref<Room | null>(null);
const accessTokenFromUrl = computed(() => route.query.token as string | undefined);

const props = defineProps<{
    id: string
}>();

const updateRoom = async () => {
    try {
        // Get access token from URL query parameter if available
        const accessToken = route.query.token as string | undefined;

        // Fetch room data with the access token
        const room: Room = await roomController.getRoom(Number(props.id), accessToken);

        // Set room data
        roomStore.setRoom(room);
        roomData.value = room;

        name.value = room.name;
        players.value = room.players;
        payments.value = getPayments(room);
        status.value = room.status;
        roomId.value = room.id;
        exchange.value = room.exchange;
        created.value = formatDate(new Date(room.createdAt));
        capacity.value = getCapacity(room);
        chipsCapacity.value = getChipsCapacity(room);
    } catch (error: any) {
        console.error('Error loading room:', error);

        // If we get a 403 error, it means the room is invisible and requires an access token
        if (error.response?.status === 403) {
            router.push({ name: 'home', query: { error: 'room-access-denied' } });
        }
    }
};

onMounted(() => updateRoom());

// Watch for room store changes
watch(() => roomStore.room, (newRoom) => {
    if (newRoom) {
        roomData.value = newRoom;
        name.value = newRoom.name;
        players.value = newRoom.players;
        payments.value = getPayments(newRoom);
        status.value = newRoom.status;
        roomId.value = newRoom.id;
        exchange.value = newRoom.exchange;
        created.value = formatDate(new Date(newRoom.createdAt));
        capacity.value = getCapacity(newRoom);
        chipsCapacity.value = getChipsCapacity(newRoom);
    }
});

const getPayments = (room: Room): ExchangeDetails[] => {
    const allPayments: ExchangeDetails[] = [];

    if (room.players) {
        room.players.forEach(player => {
            if (player.exchanges) {
                player.exchanges.forEach(exchange => {
                    allPayments.push({
                        id: exchange.id,
                        amount: parseFloat(exchange.cashAmount),
                        date: formatDate(new Date(exchange.createdAt)),
                        playerName: player.name,
                        type: exchange.direction
                    });
                });
            }
        });
    }

    return allPayments.sort((a, b) => b.id - a.id);
};

const getCapacity = (room: Room): number => {
    let totalBuyIn = 0;
    let totalCashOut = 0;

    if (room.players) {
        room.players.forEach(player => {
            if (player.exchanges) {
                player.exchanges.forEach(exchange => {
                    const amount = parseFloat(exchange.cashAmount);
                    if (exchange.direction === ExchangeDirectionEnum.BuyIn) {
                        totalBuyIn += amount;
                    } else if (exchange.direction === ExchangeDirectionEnum.CashOut) {
                        totalCashOut += amount;
                    }
                });
            }
        });
    }

    return totalBuyIn - totalCashOut;
};

const getChipsCapacity = (room: Room): number => {
    return getCapacity(room) * room.exchange;
};

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

const formatCurrency = (value: number) => {
    return currency(value, { symbol: '€', separator: ',', decimal: '.', precision: 2 }).format();
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value);
};

const isOpened = () => {
    return status.value === 'opened';
};

const sortedPlayers = computed(() => {
    if (!players.value) return [];

    return [...players.value].sort((a, b) => {
        // Sort by role: Host first, then Admin, then Player
        const roleOrder: Record<string, number> = { host: 0, admin: 1, player: 2 };
        const roleA = roleOrder[a.role.toLowerCase()] || 3;
        const roleB = roleOrder[b.role.toLowerCase()] || 3;
        
        if (roleA !== roleB) {
            return roleA - roleB;
        }
        
        // Then by name alphabetically
        return a.name.localeCompare(b.name);
    });
});
</script>
