import { defineStore } from 'pinia';
import { useTheme } from 'vuetify';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const vuetifyTheme = useTheme();
  const isDark = ref(localStorage.getItem('theme') === 'pokerDark');

  // Initialize theme from localStorage
  if (isDark.value) {
    vuetifyTheme.global.name.value = 'pokerDark';
  }

  // Watch for theme changes and persist to localStorage
  watch(isDark, (newValue) => {
    const themeName = newValue ? 'pokerDark' : 'pokerLight';
    vuetifyTheme.global.name.value = themeName;
    localStorage.setItem('theme', themeName);
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    toggleTheme,
  };
});
