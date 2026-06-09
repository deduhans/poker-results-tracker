<template>
    <v-card class="mt-16 mx-auto" max-width="400">
        <v-card-title class="text-center">Create User</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleRegister" data-cy="register-form">
                <v-text-field v-model="userName" label="Username" :rules="usernameRules" required
                    :disabled="loading" hint="Username must be 3-20 characters long" data-cy="username"></v-text-field>

                <v-text-field v-model="password" label="Password" :rules="passwordRules" required
                    :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword" :disabled="loading"
                    hint="Password must be at least 8 characters with numbers and letters" data-cy="password"></v-text-field>

                <v-text-field v-model="confirmPassword" label="Confirm Password"
                    :rules="[...passwordRules, passwordConfirmationRule]" required
                    :type="showPassword ? 'text' : 'password'" :disabled="loading" data-cy="confirm-password"></v-text-field>

                <v-alert v-if="error" density="compact" type="error" variant="outlined" class="mt-3" data-cy="register-error">{{ errorMessage }}</v-alert>
            </v-form>
        </v-card-text>

        <v-card-actions>
            <v-btn color="secondary" @click="goToLogin" :disabled="loading" data-cy="back-to-login-button">
                Back to Login
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="handleRegister" :loading="loading" :disabled="!valid || loading" data-cy="register-button">
                Create Account
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import type { CreateUser } from '@/types/user/CreateUser';

const router = useRouter();
const { 
    register, 
    loading, 
    error, 
    errorMessage,
    usernameRules,
    passwordRules,
    createPasswordConfirmationRule
} = useAuth();

const form = ref<any>(null);
const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const valid = ref(false);
const showPassword = ref(false);

// Create a password confirmation rule that updates when password changes
const passwordConfirmationRule = computed(() => 
  createPasswordConfirmationRule(password.value)
);

const goToLogin = () => {
  router.push({ name: 'login' });
};

const handleRegister = async () => {
  if (!valid.value || !form.value?.validate()) return;

  const user: CreateUser = {
    username: userName.value,
    password: password.value,
  };

  const success = await register(user);
  if (success) {
    router.push({ name: 'home' });
  }
};
</script>
