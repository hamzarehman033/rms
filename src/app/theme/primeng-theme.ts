import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';


export const customTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f0f1ff',
      100: '#e0e2ff',
      200: '#c0c5ff',
      300: '#a0a8ff',
      400: '#808bff',
      500: '#606eff',
      600: '#5b6cff',
      700: '#4552ff',
      800: '#2f38ff',
      900: '#1a1eff',
    },
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '0.6rem',
      focusRing: {
        width: '2px',
        color: '#5b6cff',
        offset: '2px',
        shadow: '0 0 0 2px rgba(91, 108, 255, 0.1)',
      },
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8f9fa',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        primary: {
          color: '#5b6cff',
          inverseColor: '#ffffff',
          shade: '#4552ff',
          tint: '#8a7bff',
        },
        emphasis: {
          color: '#5b6cff',
          contrastColor: '#ffffff',
        },
        maskedBackground: 'rgba(0, 0, 0, 0.4)',
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#e6e8ee',
          100: '#c5cbd6',
          200: '#8b93a7',
          300: '#6c7588',
          400: '#5e6a7e',
          500: '#485264',
          600: '#3d4657',
          700: '#2a3140',
          800: '#222836',
          900: '#1c2230',
          950: '#161a23',
        },
        primary: {
          color: '#5b6cff',
          inverseColor: '#161a23',
          shade: '#4552ff',
          tint: '#8a7bff',
        },
        emphasis: {
          color: '#5b6cff',
          contrastColor: '#ffffff',
        },
        maskedBackground: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  components: {
    button: {
      paddedPaddingX: '1rem',
      paddedPaddingY: '0.5rem',
      sm: {
        paddingX: '0.625rem',
        paddingY: '0.375rem',
      },
      lg: {
        paddingX: '1.25rem',
        paddingY: '0.625rem',
      },
      raisedShadow: '0 0 24px -4px rgba(91, 108, 255, 0.45)',
      borderRadius: '0.6rem',
      gap: '0.5rem',
      fontWeight: '500',
      transitionDuration: '0.2s',
    },
    inputtext: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '0.6rem',
      transitionDuration: '0.2s',
    },
    dropdown: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      borderRadius: '0.6rem',
      itemPaddingX: '1rem',
      itemPaddingY: '0.75rem',
      transitionDuration: '0.2s',
    },
    card: {
      paddingX: '1.25rem',
      paddingY: '1.25rem',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 0 rgba(255,255,255,.02) inset, 0 8px 24px -12px rgba(0,0,0,.5)',
    },
    dialog: {
      paddingX: '1.25rem',
      paddingY: '1.25rem',
      borderRadius: '0.75rem',
    },
    toast: {
      paddingX: '1rem',
      paddingY: '1rem',
      borderRadius: '0.6rem',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
    },
    panel: {
      paddingX: '1.25rem',
      paddingY: '1.25rem',
      borderRadius: '0.75rem',
    },
    tabs: {
      paddingX: '1.25rem',
      paddingY: '0.75rem',
      borderRadius: '0.6rem',
    },
  },
});
