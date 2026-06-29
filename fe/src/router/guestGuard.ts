import { useAuthStore } from '@/stores/auth';
import { type NavigationGuard } from 'vue-router';

const guestGuard: NavigationGuard = () => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated && authStore.isSessionValid) {
    return { name: 'home' };
  }

  return true;
};

export default guestGuard;
