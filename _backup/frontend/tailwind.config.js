/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#f0fdfe',
  				'100': '#ccf7f9',
  				'200': '#99eff3',
  				'300': '#60dde4',
  				'400': '#22c1cd',
  				'500': '#00969A',
  				'600': '#047a82',
  				'700': '#0a6169',
  				'800': '#0f4f56',
  				'900': '#134349',
  				'950': '#042a30',
  				DEFAULT: '#00969A'
  			},
  			secondary: {
  				DEFAULT: '#f1f5f9',
  				foreground: '#0f172a'
  			},
  			accent: {
  				DEFAULT: '#f1f5f9',
  				foreground: '#0f172a'
  			},
  			destructive: {
  				DEFAULT: '#ef4444',
  				foreground: '#fef2f2'
  			},
  			muted: {
  				DEFAULT: '#f1f5f9',
  				foreground: '#64748b'
  			},
  			card: {
  				DEFAULT: '#ffffff',
  				foreground: '#0f172a'
  			},
  			popover: {
  				DEFAULT: '#ffffff',
  				foreground: '#0f172a'
  			},
  			border: '#e2e8f0',
  			input: '#e2e8f0',
  			ring: '#00969A',
  			background: '#ffffff',
  			foreground: '#0f172a',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [],
}