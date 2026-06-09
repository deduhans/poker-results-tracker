<template>
    <v-list-item rounded="lg" class="player-row mb-2" active-class="">
        <v-list-item-title class="text-body-2 font-weight-medium text-truncate" :title="name">{{ name
        }}</v-list-item-title>

        <template v-slot:append>
            <v-row align="center" no-gutters class="gap-2">
                <v-col class="flex-grow-0">
                    <v-chip :color="incomeColor" size="small" variant="tonal" class="font-weight-medium income-chip">
                        {{ formattedIncome }}
                    </v-chip>
                </v-col>
                <v-col class="flex-grow-0">
                    <v-text-field v-model.number="localValue" type="number" density="compact" hide-details
                        variant="outlined" bg-color="surface" class="chips-input" :error="hasError"
                        :rules="validationRules" @update:model-value="updateValue" @keydown.enter="$emit('next')"
                        data-cy="player-distribution-row-input">
                        <template #append-inner>
                            <v-icon size="small" color="medium-emphasis">mdi-poker-chip</v-icon>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </template>
    </v-list-item>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    id: number;
    name: string;
    isHost: boolean;
    initialValue: number;
    value: number;
    exchangeRate: number;
    hasError: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:value', value: number | null): void;
    (e: 'next'): void;
}>();

const localValue = ref<number | null>(props.value);

watch(() => props.value, (newValue) => {
    if (newValue !== localValue.value) {
        localValue.value = newValue;
    }
});

const updateValue = (value: number | string | null) => {
    emit('update:value', value === null || value === '' ? null : Number(value));
};

const income = computed(() => {
    return ((localValue.value ?? 0) - props.initialValue) / props.exchangeRate;
});

const incomeColor = computed(() => {
    if (income.value > 0) return 'success';
    if (income.value < 0) return 'error';
    return 'medium-emphasis';
});

const formattedIncome = computed(() => {
    const prefix = income.value > 0 ? '+' : '';
    return `${prefix}${income.value.toFixed(2)}€`;
});

const validationRules = [
    (v: any) => !!v || 'Required',
    (v: any) => v >= 0 || 'Must be positive',
    (v: any) => Number.isInteger(v) || 'Must be a whole number',
];
</script>

<style scoped>
.chips-input {
    width: 110px;
}

.income-chip {
    min-width: 70px;
    justify-content: center;
}

.text-truncate {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.gap-2 {
    gap: 8px;
}
</style>
