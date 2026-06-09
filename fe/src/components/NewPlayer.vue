<template>
    <v-dialog v-model="dialog" width="500" data-cy="new-player-dialog">
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-account-plus" data-cy="new-player-button"></v-btn>
        </template>

        <v-card>
            <v-card-title class="text-h6" data-cy="new-player-title">Add Player</v-card-title>

            <v-card-text>
                <v-text-field v-model="name" label="Name" data-cy="new-player-name"></v-text-field>
                
                <v-checkbox
                    v-if="!isUserAlreadyPlayer"
                    v-model="assignToCurrentUser"
                    label="Assign me to this player"
                    color="primary"
                    hide-details
                    data-cy="assign-me-checkbox"
                ></v-checkbox>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="createPlayer" data-cy="new-player-add">Add</v-btn>
                <v-btn color="error" @click="dialog = false" data-cy="new-player-cancel">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
import PlayerController from '@/network/lib/player';
import RoomController from '@/network/lib/room';
import { useRoomStore } from '@/stores/room';
import type { CreatePlayer } from '@/types/player/CreatePlayer';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const playerController = new PlayerController();
const roomController = new RoomController();
const roomStore = useRoomStore();
const userStore = useUserStore();

const props = defineProps<{
    roomId: number
}>();

const dialog = ref(false);
const name = ref('');
const assignToCurrentUser = ref(true);

// Check if the current user is already assigned to a player in this room
const isUserAlreadyPlayer = computed(() => {
    if (!userStore.userId || !roomStore.room) return false;
    
    return roomStore.room.players.some(player => 
        player.user && player.user.id === userStore.userId
    );
});

// Initialize name field with current user's username if assigning to self
onMounted(() => {
    if (assignToCurrentUser.value && userStore.userName) {
        name.value = userStore.userName;
    }
});

const createPlayer = async () => {
    if (!name.value.trim()) {
        return;
    }

    const newPlayer: CreatePlayer = {
        roomId: props.roomId,
        name: name.value,
    };

    // If checkbox is checked and user is logged in, assign this player to current user
    if (assignToCurrentUser.value && userStore.userId) {
        newPlayer.userId = userStore.userId;
    }

    await playerController.createPlayer(newPlayer);
    const updatedRoom = await roomController.getRoom(props.roomId);
    roomStore.setRoom(updatedRoom);
    dialog.value = false;
    name.value = '';
    assignToCurrentUser.value = true;
};
</script>
