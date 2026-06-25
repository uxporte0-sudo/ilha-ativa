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
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			card: {
				DEFAULT: 'var(--card)',
				foreground: 'var(--card-foreground)'
			},
			popover: {
				DEFAULT: 'var(--popover)',
				foreground: 'var(--popover-foreground)'
			},
			primary: {
				DEFAULT: 'var(--primary)',
				foreground: 'var(--primary-foreground)'
			},
			secondary: {
				DEFAULT: 'var(--secondary)',
				foreground: 'var(--secondary-foreground)'
			},
			muted: {
				DEFAULT: 'var(--muted)',
				foreground: 'var(--muted-foreground)'
			},
			accent: {
				DEFAULT: 'var(--accent)',
				foreground: 'var(--accent-foreground)'
			},
			destructive: {
				DEFAULT: 'var(--destructive)',
				foreground: 'var(--destructive-foreground)'
			},
			brand: {
				primary: 'var(--brand-primary)',
				'primary-strong': 'var(--brand-primary-strong)',
				'primary-subtle': 'var(--brand-primary-subtle)',
				secondary: 'var(--brand-secondary)',
				accent: 'var(--brand-accent)'
			},
			surface: {
				base: 'var(--surface-base)',
				base2: 'var(--surface-base2)',
				menu: 'var(--surface-menu)',
				subtle: 'var(--surface-subtle)',
				card: 'var(--surface-card)',
				elevated: 'var(--surface-elevated)',
				inverse: 'var(--surface-inverse)'
			},
			container: {
				primary: 'var(--container-primary)',
				'primary-strong': 'var(--container-primary-strong)',
				secondary: 'var(--container-secondary)',
				'secondary-strong': 'var(--container-secondary-strong)',
				accent: 'var(--container-accent)',
				'accent-strong': 'var(--container-accent-strong)'
			},
			text: {
				primary: 'var(--text-primary)',
				secondary: 'var(--text-secondary)',
				tertiary: 'var(--text-tertiary)',
				disabled: 'var(--text-disabled)',
				inverse: 'var(--text-inverse)'
			},
			interaction: {
				default: 'var(--interaction-default)',
				hover: 'var(--interaction-hover)',
				pressed: 'var(--interaction-pressed)',
				focus: 'var(--interaction-focus)',
				disabled: 'var(--interaction-disabled)'
			},
			success: {
				DEFAULT: 'var(--success)',
				foreground: 'var(--success-foreground)'
			},
			error: {
				DEFAULT: 'var(--error)',
				foreground: 'var(--error-foreground)'
			},
			border: 'var(--border)',
			borderSemantic: {
				subtle: 'var(--border-subtle)',
				DEFAULT: 'var(--border-default)',
				strong: 'var(--border-strong)',
				focus: 'var(--border-focus)'
			},
			input: 'var(--input)',
			ring: 'var(--ring)',
			chart: {
				'1': 'var(--chart-1)',
				'2': 'var(--chart-2)',
				'3': 'var(--chart-3)',
				'4': 'var(--chart-4)',
				'5': 'var(--chart-5)'
			},
			sidebar: {
				DEFAULT: 'var(--sidebar-background)',
				foreground: 'var(--sidebar-foreground)',
				primary: 'var(--sidebar-primary)',
				'primary-foreground': 'var(--sidebar-primary-foreground)',
				accent: 'var(--sidebar-accent)',
				'accent-foreground': 'var(--sidebar-accent-foreground)',
				border: 'var(--sidebar-border)',
				ring: 'var(--sidebar-ring)'
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


