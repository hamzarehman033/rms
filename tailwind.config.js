/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: { 
          DEFAULT: 'var(--primary)', 
          foreground: 'var(--primary-foreground)', 
          glow: 'var(--primary-glow)' 
        },
        secondary: { 
          DEFAULT: 'var(--secondary)', 
          foreground: 'var(--secondary-foreground)' 
        },
        destructive: { 
          DEFAULT: 'var(--destructive)', 
          foreground: 'var(--destructive-foreground)' 
        },
        muted: { 
          DEFAULT: 'var(--muted)', 
          foreground: 'var(--muted-foreground)' 
        },
        accent: { 
          DEFAULT: 'var(--accent)', 
          foreground: 'var(--accent-foreground)' 
        },
        popover: { 
          DEFAULT: 'var(--popover)', 
          foreground: 'var(--popover-foreground)' 
        },
        card: { 
          DEFAULT: 'var(--card)', 
          foreground: 'var(--card-foreground)' 
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          border: 'var(--sidebar-border)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { 
        lg: 'var(--radius)', 
        md: 'calc(var(--radius) - 2px)', 
        sm: 'calc(var(--radius) - 4px)' 
      },
    }
  },
  plugins: [],
}
