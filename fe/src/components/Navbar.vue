<template>
    <v-app-bar>
        <template v-if="router.currentRoute.value.name !== 'home'">
            <v-btn icon="mdi-arrow-left" @click="redirectBack()"></v-btn>
        </template>

        <v-app-bar-title>Poker Results Tracker</v-app-bar-title>

        <template v-slot:append>
            <OverflowMenu />
        </template>
    </v-app-bar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import OverflowMenu from '@/components/OverflowMenu.vue';

const router = useRouter();

const redirectBack = () => {
    router.back();
};
</script>

<style scoped>
.v-app-bar {
    z-index: 1000;
}
</style>