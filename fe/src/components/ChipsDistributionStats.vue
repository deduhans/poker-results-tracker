<template>
    <v-row no-gutters class="stats-row">
        <v-col cols="4" class="text-center stats-col">
            <div class="d-flex flex-column align-center">
                <div class="text-caption text-medium-emphasis font-weight-medium">Total</div>
                <div class="text-subtitle-1 mt-1 font-weight-bold">{{ formatNumber(total) }}</div>
            </div>
        </v-col>

        <v-col cols="4" class="text-center stats-col">
            <div class="d-flex flex-column align-center">
                <div class="text-caption text-medium-emphasis font-weight-medium">Distributed</div>
                <div class="text-subtitle-1 mt-1 font-weight-bold" :class="distributedClass">
                    {{ formatNumber(distributed) }}
                </div>
            </div>
        </v-col>

        <v-col cols="4" class="text-center stats-col">
            <div class="d-flex flex-column align-center">
                <div class="text-caption text-medium-emphasis font-weight-medium">Remaining</div>
                <div class="text-subtitle-1 mt-1 font-weight-bold" :class="{ 'text-error': remaining !== 0 }">
                    {{ formatNumber(remaining) }}
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
    total: number;
    distributed: number;
}>();

const remaining = computed(() => {
  return props.total - props.distributed;
});

const distributedClass = computed(() => {
  if (props.distributed > props.total) return 'text-error';
  if (props.distributed === props.total) return 'text-success';
  return '';
});

const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value);
};
</script>

<style scoped>
.stats-row {
    width: 100%;
}

.stats-col {
    position: relative;
}

.stats-col:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 4px;
    bottom: 4px;
    width: 1px;
    background: rgba(var(--v-border-color), var(--v-border-opacity));
}

.text-subtitle-1 {
    letter-spacing: -0.25px;
    line-height: 1.2;
}

.text-caption {
    line-height: 1;
}
</style>
