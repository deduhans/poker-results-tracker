<template>
    <v-container fluid class="pa-0 pt-4 mb-6">
        <v-row align="center" style="height: 600px">
            <v-col>
                <v-row justify="center">
                    <v-btn class="pa-2 ma-2" color="primary" @click="login">Log In</v-btn>
                </v-row>
                <v-row justify="center">
                    <v-btn class="pa-2 ma-2" color="secondary" @click="signup">Sign Up</v-btn>
                </v-row>
            </v-col>
        </v-row>
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