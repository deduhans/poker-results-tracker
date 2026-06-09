<template>
    <v-list-item class="pa-2" data-cy="payment-item">
        <template v-slot:prepend>
            <v-icon :icon="payment.type === ExchangeDirectionEnum.BuyIn ? 'mdi-cash-minus' : 'mdi-cash-plus'"
                :color="payment.type === ExchangeDirectionEnum.BuyIn ? 'error' : 'success'">
            </v-icon>
        </template>
        <v-list-item-title class="text-subtitle-2" data-cy="payment-item-player">{{ payment.playerName
            }}</v-list-item-title>
        <template v-slot:append>
            <div class="d-flex align-center">
                <span class="text-subtitle-2 font-weight-medium mr-4"
                    :class="payment.type === ExchangeDirectionEnum.BuyIn ? 'text-error' : 'text-success'"
                    data-cy="payment-item-amount">
                    {{ payment.type === ExchangeDirectionEnum.BuyIn ? '-' : '+' }}{{ payment.amount }}€
                </span>
                <span class="text-caption text-medium-emphasis" data-cy="payment-item-date">{{ payment.date }}</span>
            </div>
        </template>
    </v-list-item>
</template>

<script lang="ts" setup>
import { ExchangeDirectionEnum } from '@/types/exchange/ExchangeDirectionEnum';

interface Payment {
    playerName: string;
    amount: number;
    date: string;
    type: ExchangeDirectionEnum;
}

defineProps<{
    payment: Payment;
}>();
</script>
