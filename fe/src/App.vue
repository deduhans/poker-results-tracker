<template>
  <v-app class="app-container">
    <Navbar v-if="userStore.userId" />
    <v-main>
      <v-container class="content-container" :class="{ 'pb-nav': userStore.userId }">
        <router-view></router-view>
      </v-container>
    </v-main>
    <BottomNavigation v-if="userStore.userId" />
  </v-app>
</template>

<script lang="ts" setup>
import Navbar from '@/components/Navbar.vue';
import BottomNavigation from '@/components/BottomNavigation.vue';
import { useUserStore } from '@/stores/user';
import { useRoomStore } from './stores/room';
import { useAuthStore } from '@/stores/auth';
import { useTelegramAuth } from '@/composables/useTelegramAuth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const roomStore = useRoomStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const { isInsideTelegram, applyTelegramTheme } = useTelegramAuth();
const router = useRouter();

onMounted(async () => {
  if (authStore.isAuthenticated && authStore.isSessionValid) {
    if (isInsideTelegram) applyTelegramTheme();
    return;
  }

  const sessionOk = await authStore.initializeAuth();

  if (!sessionOk && isInsideTelegram) {
    applyTelegramTheme();
    const telegramOk = await authStore.initializeTelegramAuth();
    if (telegramOk) {
      router.push({ name: 'home' });
    }
  }
});
</script>

<style>
/* Ensure the app container takes up the full screen */
.app-container {
  min-height: 100vh;
}

/* Constrain content width on large screens for better readability */
.content-container {
  max-width: 1100px;
  margin-inline: auto;
}

/* Add space so content isn't hidden behind the fixed bottom navigation */
.pb-nav {
  padding-bottom: 88px;
}

/* Remove border from v-app to make it full width in dark mode */
.v-application {
  width: 100% !important;
  border: none !important;
}

/* Ensure the body and html take the theme background color */
html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Custom theme background classes */
.v-theme--pokerLight {
  --app-background: #FFFFFF;
}

.v-theme--pokerDark {
  --app-background: #121212;
}
</style>
