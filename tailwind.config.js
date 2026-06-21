/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-sans)'],
  			display: ['var(--font-display)'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			brand: {
  				primary: 'hsl(var(--brand-primary))',
  				'primary-strong': 'hsl(var(--brand-primary-strong))',
  				'primary-subtle': 'hsl(var(--brand-primary-subtle))',
  				secondary: 'hsl(var(--brand-secondary))',
  				accent: 'hsl(var(--brand-accent))'
  			},
  			surface: {
  				base: 'hsl(var(--surface-base))',
  				base2: 'hsl(var(--surface-base2))',
				menu: 'hsl(var(--surface-menu))',
  				subtle: 'hsl(var(--surface-subtle))',
  				card: 'hsl(var(--surface-card))',
  				elevated: 'hsl(var(--surface-elevated))',
  				inverse: 'hsl(var(--surface-inverse))'
  			},
  			container: {
  				primary: 'hsl(var(--container-primary))',
  				'primary-strong': 'hsl(var(--container-primary-strong))',
  				secondary: 'hsl(var(--container-secondary))',
  				'secondary-strong': 'hsl(var(--container-secondary-strong))',
  				accent: 'hsl(var(--container-accent))',
  				'accent-strong': 'hsl(var(--container-accent-strong))'
  			},
  			text: {
  				primary: 'hsl(var(--text-primary))',
  				secondary: 'hsl(var(--text-secondary))',
  				tertiary: 'hsl(var(--text-tertiary))',
  				disabled: 'hsl(var(--text-disabled))',
  				inverse: 'hsl(var(--text-inverse))'
  			},
  			interaction: {
  				default: 'hsl(var(--interaction-default))',
  				hover: 'hsl(var(--interaction-hover))',
  				pressed: 'hsl(var(--interaction-pressed))',
  				focus: 'hsl(var(--interaction-focus))',
  				disabled: 'hsl(var(--interaction-disabled))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			error: {
  				DEFAULT: 'hsl(var(--error))',
  				foreground: 'hsl(var(--error-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			borderSemantic: {
  				subtle: 'hsl(var(--border-subtle))',
  				DEFAULT: 'hsl(var(--border-default))',
  				strong: 'hsl(var(--border-strong))',
  				focus: 'hsl(var(--border-focus))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
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
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}


