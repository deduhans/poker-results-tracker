<template>
  <div>
    <v-btn
      icon
      variant="text"
      color="primary"
      @click="dialog = true"
      data-cy="share-room-button"
    >
      <v-icon>mdi-share-variant</v-icon>
    </v-btn>

    <v-dialog v-model="dialog" max-width="400" data-cy="share-room-dialog">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          Share Room
        </v-card-title>
        
        <v-card-text class="text-center pa-4">
          <div class="d-flex justify-center mb-4">
            <qrcode-vue
              :value="roomUrl"
              :size="200"
              level="H"
              render-as="svg"
              data-cy="room-qr-code"
            />
          </div>
          
          <v-alert v-if="copied" type="success" density="compact" variant="tonal" class="mb-2">
            URL copied to clipboard!
          </v-alert>
          
          <v-alert type="info" density="compact" variant="tonal" class="mb-2">
            Share this link or QR code with players to join the room.
          </v-alert>

          <v-btn 
            block
            color="primary"
            @click="copyToClipboard"
            class="mt-2"
            data-cy="copy-room-url-button"
          >
            <v-icon start>mdi-content-copy</v-icon>
            Copy Link
          </v-btn>

          <v-btn
            v-if="isHost"
            block
            color="secondary"
            @click="regenerateToken"
            class="mt-2"
            :loading="regenerating"
            data-cy="regenerate-token-button"
          >
            <v-icon start>mdi-refresh</v-icon>
            Regenerate Access Link
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QrcodeVue from 'qrcode.vue';
import RoomController from '@/network/lib/room';
import type { Room } from '@/types/room/Room';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
  room: Room
}>();

const userStore = useUserStore();
const roomController = new RoomController();
const dialog = ref(false);
const copied = ref(false);
const regenerating = ref(false);

const isHost = computed(() => {
  const hostPlayer = props.room.players.find(player => player.role === 'host');
  return hostPlayer?.user?.id === userStore.userId;
});

const roomUrl = computed(() => {
  // Get the base URL from the current window location
  const baseUrl = window.location.origin;
  
  // Always include the access token if available
  if (props.room.accessToken) {
    return `${baseUrl}/room/${props.room.id}?token=${props.room.accessToken}`;
  }
  
  // If no access token, just use the room ID
  return `${baseUrl}/room/${props.room.id}`;
});

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(roomUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000); // Hide the alert after 3 seconds
  } catch (err) {
    console.error('Failed to copy URL: ', err);
  }
};

const regenerateToken = async () => {
  if (!isHost.value) return;
  
  regenerating.value = true;
  try {
    const newToken = await roomController.regenerateAccessToken(props.room.id);
    // Update the room's access token in the parent component
    props.room.accessToken = newToken;
    
    // Show success message
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 3000);
  } catch (err) {
    console.error('Failed to regenerate token: ', err);
  } finally {
    regenerating.value = false;
  }
};
</script>
