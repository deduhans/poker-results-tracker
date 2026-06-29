<template>
    <v-container class="welcome-wrap d-flex align-center justify-center">
        <div class="text-center welcome-inner">
            <v-avatar size="96" color="primary" class="mb-6 elevation-4">
                <v-icon size="56" color="accent">mdi-cards-playing-outline</v-icon>
            </v-avatar>

            <h1 class="text-h4 font-weight-bold mb-2">Poker Results Tracker</h1>
            <p class="text-body-1 text-medium-emphasis mb-8">
                Track buy-ins, cash-outs and settle up with your poker night crew.
            </p>

            <div class="d-flex flex-column ga-3 mx-auto" style="max-width: 280px;">
                <v-btn size="large" color="primary" block @click="login">Log In</v-btn>
                <v-btn size="large" color="primary" variant="tonal" block @click="signup">Sign Up</v-btn>
            </div>
        </div>
    </v-container>
</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const login = () => {
  router.push({ name: 'login' });
};

const signup = () => {
  router.push({ name: 'register' });
};
</script>

<style scoped>
.welcome-wrap {
  min-height: 80vh;
}

.welcome-inner {
  width: 100%;
  max-width: 480px;
}
</style>