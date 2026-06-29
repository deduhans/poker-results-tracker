import { useAuthStore } from '@/stores/auth';
import { type NavigationGuard } from 'vue-router';

const authGuard: NavigationGuard = (to) => {
  const authStore = useAuthStore();

  // Check if user is authenticated and session is valid
  if (authStore.isAuthenticated && authStore.isSessionValid) {
    return true;
  }

  // Session expired or not authenticated, redirect to login
  return {
    name: 'login',
    query: to.path !== '/' ? { redirect: to.fullPath } : {}
  };
};

export default authGuard;