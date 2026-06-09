<template>
  <v-dialog v-model="dialog" persistent max-width="400" data-cy="room-key-dialog">
    <v-card>
      <v-card-title class="text-h6">Room Key Required</v-card-title>
      <v-card-text>
        <p class="mb-4">This room is protected by a 4-digit key. Please enter the key to access the room.</p>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="roomKey"
            label="Room Key"
            type="number"
            :rules="keyRules"
            maxlength="4"
            required
            autofocus
            :loading="loading"
            :disabled="loading"
            hint="Enter the 4-digit code"
            persistent-hint
            data-cy="room-key-input"
          ></v-text-field>
          
          <v-alert
            v-if="error"
            type="error"
            variant="outlined"
            density="compact"
            class="mt-4"
            data-cy="room-key-error"
          >
            {{ errorMessage }}
          </v-alert>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          @click="cancel"
          :disabled="loading"
          data-cy="room-key-cancel-button"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="submit"
          :loading="loading"
          :disabled="!valid || loading"
          data-cy="room-key-submit-button"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  roomId: number;
  accessToken?: string;
}>();

const emit = defineEmits<{
  (e: 'submit', key: string): void;
  (e: 'cancel'): void;
}>();

const router = useRouter();
const dialog = ref(true);
const roomKey = ref('');
const valid = ref(false);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');

const keyRules = [
  (v: string) => !!v || 'Room key is required',
  (v: string) => /^\d{4}$/.test(v) || 'Room key must be exactly 4 digits',
];

const submit = async () => {
  if (!valid.value) {
    return;
  }

  loading.value = true;
  error.value = false;
  
  try {
    emit('submit', roomKey.value);
  } catch (e: any) {
    error.value = true;
    errorMessage.value = e.message || 'Invalid room key';
    console.error('Error submitting room key:', e);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  dialog.value = false;
  emit('cancel');
  router.push({ name: 'home' });
};
</script>
