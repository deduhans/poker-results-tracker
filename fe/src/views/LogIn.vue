<template>
    <v-card class="mt-16 mx-auto" max-width="400">
        <v-card-title class="text-center">Log in</v-card-title>
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

        <v-card-actions>
            <v-btn
                color="secondary"
                @click="register"
                :disabled="loading"
                data-cy="register-button"
            >Register</v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                @click="handleLogin"
                :loading="loading"
                :disabled="!valid || loading"
                data-cy="login-button"
            >Log in</v-btn>
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