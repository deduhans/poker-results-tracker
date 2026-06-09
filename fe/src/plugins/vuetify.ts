import { createVuetify } from 'vuetify';
import { md3 } from 'vuetify/blueprints';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Poker theme colors
const pokerLight = {
  dark: false,
  colors: {
    primary: '#1B5E20',      // Dark green (poker table)
    secondary: '#B71C1C',    // Dark red (cards)
    accent: '#FDD835',       // Gold (chips)
    background: '#FFFFFF',    // White
    surface: '#F5F5F5',      // Light gray
    'surface-variant': '#EEEEEE',
    error: '#D32F2F',        // Red
    info: '#0288D1',         // Blue
    success: '#388E3C',      // Green
    warning: '#F57C00',      // Orange
    'on-background': '#000000',
    'on-surface': '#000000',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-accent': '#000000',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#FFFFFF',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.05,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  },
};

const pokerDark = {
  dark: true,
  colors: {
    primary: '#2E7D32',      // Green (poker table)
    secondary: '#D32F2F',    // Red (cards)
    accent: '#FFD700',       // Gold (chips)
    background: '#121212',   // Dark gray
    surface: '#1E1E1E',      // Slightly lighter dark
    'surface-variant': '#2D2D2D',
    error: '#CF6679',        // Red
    info: '#64B5F6',         // Blue
    success: '#81C784',      // Green
    warning: '#FFB74D',      // Orange
    'on-background': '#FFFFFF',
    'on-surface': '#FFFFFF',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-accent': '#000000',
    'on-error': '#000000',
    'on-info': '#000000',
    'on-success': '#000000',
    'on-warning': '#000000',
  },
  variables: {
    'border-color': '#FFFFFF',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.10,
    'hover-opacity': 0.13,
    'focus-opacity': 0.15,
    'selected-opacity': 0.20,
    'activated-opacity': 0.24,
    'pressed-opacity': 0.24,
    'dragged-opacity': 0.20,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#343434',
    'theme-on-code': '#FFFFFF',
  },
};

export default createVuetify({
  blueprint: md3,
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'pokerLight',
    themes: {
      pokerLight,
      pokerDark,
    },
  },
});
