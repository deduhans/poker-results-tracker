<template>
    <v-card class="auth-card mx-auto" max-width="420">
        <div class="text-center pt-8 pb-2">
            <v-avatar size="64" color="primary" class="mb-3">
                <v-icon size="36" color="accent">mdi-cards-playing-outline</v-icon>
            </v-avatar>
            <h1 class="text-h5 font-weight-bold">Welcome back</h1>
            <p class="text-body-2 text-medium-emphasis">Log in to track your games</p>
        </div>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin" data-cy="login-form">
                <v-text-field
                    v-model="userName"
                    label="Username"
                    :rules="usernameRules"
                    required
                    :disabled="loading"
                    data-cy="username"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    label="Password"
                    :rules="passwordRules"
                    required
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    :disabled="loading"
                    data-cy="password"
                ></v-text-field>
            </v-form>
            <v-alert
                v-if="error"
                density="compact"
                variant="outlined"
                :text="errorMessage"
                type="error"
                data-cy="login-error"
            ></v-alert>
        </v-card-text>

        <v-card-actions class="flex-column ga-2 px-4 pb-6">
            <v-btn
                color="primary"
                block
                size="large"
                @click="handleLogin"
                :loading="loading"
                :disabled="!valid || loading"
                data-cy="login-button"
            >Log in</v-btn>
            <v-btn
                color="primary"
                variant="text"
                block
                @click="register"
                :disabled="loading"
                data-cy="register-button"
            >Don't have an account? Register</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';
import type { Auth } from '@/types/auth/Auth';

const router = useRouter();
const { 
    login, 
    loading, 
    error, 
    errorMessage,
    usernameRules,
    passwordRules
} = useAuth();

const userName = ref('');
const password = ref('');
const valid = ref(false);
const showPassword = ref(false);

const register = () => {
  router.push({ name: 'register' });
};

const handleLogin = async () => {
  if (!valid.value) return;

  const auth: Auth = {
    username: userName.value,
    password: password.value,
  };

  const success = await login(auth);
  if (success) {
    router.push({ name: 'home' });
  }
};
</script>

<style scoped>
.auth-card {
  margin-top: 10vh;
}
</style>