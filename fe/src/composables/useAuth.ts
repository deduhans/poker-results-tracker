import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import AuthController from '@/network/lib/auth';
import UserController from '@/network/lib/user';
import type { Auth } from '@/types/auth/Auth';
import type { CreateUser } from '@/types/user/CreateUser';
import type { User } from '@/types/user/User';
import { extractErrorMessage, handleAuthError } from '@/utils/errorHandler';
import { usernameRules, passwordRules, createPasswordConfirmationRule } from '@/utils/validationRules';

export function useAuth() {
  const router = useRouter();
  const userStore = useUserStore();
  const authStore = useAuthStore();
  const authController = new AuthController();
  const userController = new UserController();

  // State variables
  const loading = ref(false);
  const error = ref(false);
  const errorMessage = ref('');
  const isAuthenticated = computed(() => authStore.isAuthenticated && authStore.isSessionValid);

  /**
   * Login user with provided credentials
   */
  const login = async (auth: Auth): Promise<boolean> => {
    loading.value = true;
    error.value = false;
    errorMessage.value = '';

    try {
      const response = await authController.login(auth);

      if (response.access_token) {
        authStore.setToken(response.access_token);
      }

      userStore.setUser({
        userId: response.userId,
        name: response.username
      });

      authStore.setAuthenticated(true);

      return true;
    } catch (e: any) {
      error.value = true;
      errorMessage.value = handleAuthError(e);
      console.error('Login error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Register a new user
   */
  const register = async (createUser: CreateUser): Promise<boolean> => {
    loading.value = true;
    error.value = false;
    errorMessage.value = '';

    try {
      // Create the user
      const newUser: User = await userController.createUser(createUser);

      // Log in with the new credentials
      const auth: Auth = {
        username: createUser.username,
        password: createUser.password
      };

      await login(auth);
      return true;
    } catch (e: any) {
      error.value = true;
      errorMessage.value = extractErrorMessage(e, 'Registration failed. Please try again.');
      console.error('Registration error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout the current user
   */
  const logout = async (): Promise<boolean> => {
    loading.value = true;
    error.value = false;
    errorMessage.value = '';

    try {
      await authController.logout();
      authStore.clearAuth(); // This will also clear user store
      return true;
    } catch (e: any) {
      error.value = true;
      errorMessage.value = extractErrorMessage(e, 'Logout failed. Please try again.');
      console.error('Logout error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Check if the user is logged in
   */
  const checkAuthStatus = async (): Promise<boolean> => {
    loading.value = true;

    try {
      // First check if we have a valid session in the auth store
      if (authStore.isAuthenticated && authStore.isSessionValid) {
        return true;
      }

      // If not, try to initialize from the backend
      return await authStore.initializeAuth();
    } catch (e) {
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    loading,
    error,
    errorMessage,
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    checkAuthStatus,

    // Validation rules
    usernameRules,
    passwordRules,
    createPasswordConfirmationRule
  };
}
