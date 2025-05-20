import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./landingpage/src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				dmanske: {
					purple: '#9b87f5',
					'deep-purple': '#1A1F2C',
					'light-purple': '#D6BCFA',
					blue: '#1EAEDB',
					'sky-blue': '#33C3F0',
					green: '#4ade80',
					'dark-green': '#16a34a'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.6' },
					'50%': { opacity: '1' }
				},
				'data-flow': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'50%': { opacity: '0.5' },
					'100%': { transform: 'translateX(100%)', opacity: '0' }
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'data-flow': 'data-flow 8s linear infinite',
				'rotate-slow': 'rotate-slow 12s linear infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'futuristic-grid': 'linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px)'
			},
			utilities: {
				'.text-gradient': {
					'@apply bg-clip-text text-transparent bg-gradient-to-r from-dmanske-purple via-dmanske-blue to-dmanske-green': {}
				},
				'.glow': {
					'text-shadow': '0 0 10px rgba(155, 135, 245, 0.5)'
				},
				'.glow-border': {
					'box-shadow': '0 0 10px rgba(155, 135, 245, 0.3)'
				},
				'.glass': {
					'@apply backdrop-blur-lg bg-white/5 border border-white/10': {}
				},
				'.neo-blur': {
					'@apply backdrop-blur-2xl bg-black/40 border border-white/10': {}
				},
				'.grid-bg': {
					'background-size': '50px 50px'
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
	safelist: [
		'animate-float',
		'animate-pulse-glow',
		'animate-data-flow',
		'animate-rotate-slow',
		'text-gradient',
		'glow',
		'glow-border',
		'glass',
		'neo-blur',
		'grid-bg'
	]
} satisfies Config;
