<template>
    <v-menu activator="parent">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" data-cy="user-menu"></v-btn>
        </template>
        <v-list>
            <v-list-item>
                <v-list-item-title>
                    <v-btn variant="text" :prepend-icon="themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                        @click="themeStore.toggleTheme">
                        {{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}
                    </v-btn>
                </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="handleLogout" :disabled="loading">
                <v-list-item-title>
                    <v-btn variant="text" prepend-icon="mdi-logout" :loading="loading" data-cy="logout-button">
                        Logout
                    </v-btn>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const themeStore = useThemeStore();
const { logout, loading } = useAuth();

const handleLogout = async () => {
    const success = await logout();
    if (success) {
        router.push({ name: 'login' });
    }
};
</script>