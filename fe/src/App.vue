<template>
  <v-app class="app-container">
    <Navbar v-if="userStore.userId" />
    <v-main>
      <v-container fluid>
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
import { onMounted } from 'vue';

const roomStore = useRoomStore();
const userStore = useUserStore();
const authStore = useAuthStore();

// Check if the user has a valid session on app load
onMounted(async () => {
  // If we have a valid session in the auth store, no need to check with backend
  if (authStore.isAuthenticated && authStore.isSessionValid) {
    return;
  }

  // Otherwise, initialize from backend
  await authStore.initializeAuth();
});
</script>

<style>
/* Ensure the app container takes up the full screen */
.app-container {
  min-height: 100vh;
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
