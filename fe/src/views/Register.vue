<template>
    <v-card class="auth-card mx-auto" max-width="420">
        <div class="text-center pt-8 pb-2">
            <v-avatar size="64" color="primary" class="mb-3">
                <v-icon size="36" color="accent">mdi-account-plus-outline</v-icon>
            </v-avatar>
            <h1 class="text-h5 font-weight-bold">Create your account</h1>
            <p class="text-body-2 text-medium-emphasis">Start tracking your poker nights</p>
        </div>
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

        <v-card-actions class="flex-column ga-2 px-4 pb-6">
            <v-btn color="primary" block size="large" @click="handleRegister" :loading="loading" :disabled="!valid || loading" data-cy="register-button">
                Create Account
            </v-btn>
            <v-btn color="primary" variant="text" block @click="goToLogin" :disabled="loading" data-cy="back-to-login-button">
                Already have an account? Log in
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

<style scoped>
.auth-card {
  margin-top: 8vh;
}
</style>
