<template>
	<v-container>
		<div class="d-flex justify-space-between align-center mb-6">
			<div>
				<h1 class="text-h5 font-weight-bold" data-cy="home-title">Rooms</h1>
				<p class="text-body-2 text-medium-emphasis mb-0">Manage your poker sessions</p>
			</div>
			<NewRoom />
		</div>

		<v-alert v-if="isInsideTelegram && !linkSuccess" type="info" variant="tonal" density="compact" class="mb-4" closable>
			<div class="d-flex align-center justify-space-between">
				<span>Link this account to your Telegram profile for seamless access.</span>
				<v-btn
					size="small"
					variant="flat"
					color="primary"
					:loading="linking"
					class="ml-2"
					@click="linkTelegramAccount"
				>
					Link
				</v-btn>
			</div>
		</v-alert>

		<v-alert v-if="linkError" type="error" variant="outlined" density="compact" class="mb-4" closable>
			{{ linkError }}
		</v-alert>

		<v-alert v-if="linkSuccess" type="success" variant="tonal" density="compact" class="mb-4" closable>
			Telegram account linked successfully!
		</v-alert>

		<v-alert v-if="error" type="error" variant="outlined" density="compact" class="mb-4" data-cy="error-alert">
			{{ errorMessage }}
		</v-alert>

		<v-progress-linear v-if="loading" indeterminate color="primary" data-cy="loading-indicator"></v-progress-linear>

		<v-col v-else>
			<RoomList :rooms="openRooms || []" listName="My rooms" data-cy="open-rooms-list" />
			<RoomList :rooms="closedRooms || []" listName="Previous rooms" data-cy="closed-rooms-list" />
		</v-col>
	</v-container>
</template>

<script lang="ts" setup>
import RoomList from '@/components/RoomList.vue';
import RoomController from '@/network/lib/room';
import { onMounted, ref } from 'vue';
import NewRoom from '@/components/NewRoom.vue';
import type { Room } from '@/types/room/Room';
import { useTelegramAuth } from '@/composables/useTelegramAuth';

const roomController: RoomController = new RoomController();
const { isInsideTelegram, linking, linkError, linkSuccess, linkTelegramAccount } = useTelegramAuth();

const openRooms = ref<Room[]>();
const closedRooms = ref<Room[]>();
const loading = ref(true);
const error = ref(false);
const errorMessage = ref('');

const loadRooms = async () => {
	loading.value = true;
	error.value = false;
	errorMessage.value = '';

	try {
		const response = await roomController.getRooms();
		openRooms.value = response.filter((room) => room.status === 'opened');
		closedRooms.value = response.filter((room) => room.status === 'closed');
	} catch (e: any) {
		error.value = true;
		errorMessage.value = e.response?.data?.message || 'Failed to load rooms';
		console.error('Error loading rooms:', e);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	loadRooms();
});
</script>
