import { ref, readonly } from 'vue';
import AuthController from '@/network/lib/auth';

const webApp = window.Telegram?.WebApp ?? null;

export function useTelegramAuth() {
  const isInsideTelegram = !!webApp?.initData;
  const linking = ref(false);
  const linkError = ref('');
  const linkSuccess = ref(false);

  const telegramAutoLogin = async (): Promise<{ userId: number; username: string; access_token: string } | null> => {
    if (!isInsideTelegram || !webApp) return null;

    try {
      webApp.ready();
      webApp.expand();

      const authController = new AuthController();
      const response = await authController.telegramLogin(webApp.initData);
      return response;
    } catch {
      return null;
    }
  };

  const linkTelegramAccount = async (): Promise<boolean> => {
    if (!isInsideTelegram || !webApp) return false;

    linking.value = true;
    linkError.value = '';
    linkSuccess.value = false;

    try {
      const authController = new AuthController();
      await authController.linkTelegram(webApp.initData);
      linkSuccess.value = true;
      return true;
    } catch (e: any) {
      linkError.value = e.response?.data?.message || 'Failed to link Telegram account';
      return false;
    } finally {
      linking.value = false;
    }
  };

  const applyTelegramTheme = () => {
    if (!webApp) return;
    const { themeParams, colorScheme } = webApp;
    if (themeParams.bg_color) {
      webApp.setBackgroundColor(themeParams.bg_color);
    }
    if (themeParams.bg_color) {
      webApp.setHeaderColor(colorScheme === 'dark' ? '#121212' : '#FFFFFF');
    }
  };

  return {
    isInsideTelegram,
    webApp,
    linking: readonly(linking),
    linkError: readonly(linkError),
    linkSuccess: readonly(linkSuccess),
    telegramAutoLogin,
    linkTelegramAccount,
    applyTelegramTheme,
  };
}
