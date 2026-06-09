<template>
    <v-card class="my-3" data-cy="room-list">
        <v-card-title class="text-h6" data-cy="room-list-title">{{ listName }}</v-card-title>

        <v-container v-if="isListEmpty" class="d-flex justify-center" data-cy="empty-list-message">
            <v-card-subtitle>No {{ listName.toLowerCase() }} available</v-card-subtitle>
        </v-container>

        <v-list v-else>
            <v-list-item v-for="room in rooms" :key="room.id" @click="handleRoomClick(room)" class="room-item"
                data-cy="room-list-item">
                <template v-slot:prepend>
                    <div class="d-flex align-center mr-2">
                        <v-icon :color="room.status === 'opened' ? 'success' : 'grey'" data-cy="room-status-icon">
                            {{ room.status === 'opened' ? 'mdi-door-open' : 'mdi-door-closed' }}
                        </v-icon>
                    </div>
                </template>

                <div class="d-flex align-center">
                    <v-list-item-title data-cy="room-name">{{ room.name }}</v-list-item-title>
                </div>
                <v-list-item-subtitle data-cy="room-creation-time">
                    Started {{ formatTimeAgo(room.createdAt) }}
                </v-list-item-subtitle>

                <template v-slot:append>
                    <v-chip size="small" :color="room.status === 'opened' ? 'success' : 'grey'" variant="outlined"
                        data-cy="room-status-chip">
                        {{ room.status }}
                    </v-chip>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script lang="ts" setup>
import type { Room } from '@/types/room/Room';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps<{
    listName: string,
    rooms: Room[],
}>();

const router = useRouter();

const isListEmpty = computed(() => {
    return !props.rooms || props.rooms.length === 0;
});

const handleRoomClick = (room: Room) => {
    router.push({ name: 'room', params: { id: room.id } });
};

const formatTimeAgo = (date: Date) => {
    if (!date) return '';
    
    const now = new Date();
    const createdDate = new Date(date);
    const diffInMs = now.getTime() - createdDate.getTime();
    
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays > 0) {
        return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
        return `${diffInHours}h ago`;
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes}m ago`;
    } else {
        return 'just now';
    }
};
</script>

<style scoped>
.room-item {
    cursor: pointer;
    transition: background-color 0.2s;
}

.room-item:hover {
    background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
