/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,njk,js}",
		"./src/_includes/**/*.njk",
		"./src/blog/posts/*.md",
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				forest: {
					900: '#06150D',
					800: '#0B2B1A',
					700: '#0F3B24',
					600: '#143D26',
					500: '#1A5C35',
					400: '#2D7A4A',
					300: '#4A8F63',
				},
				bark: {
					900: '#1A120C',
					800: '#2C1E14',
					700: '#3D2B1F',
					600: '#5C4033',
					500: '#6B4D3A',
					400: '#8B6F5E',
				},
				morpho: {
					deep: '#0C3547',
					700: '#0F4C6B',
					600: '#16688E',
					500: '#1B7EB0',
					400: '#2A95C8',
					300: '#4AADDA',
					glow: '#6EC5E9',
				},
				dart: {
					deep: '#5C1410',
					900: '#7A1A14',
					800: '#962118',
					700: '#B5281C',
					600: '#CC3022',
					500: '#E23D28',
					400: '#E85A48',
					300: '#ED7E6E',
					glow: '#F2A093',
				},
				cream: {
					50: '#FAF7F0',
					100: '#F5F0E6',
					200: '#EBE4D4',
					300: '#E0D6C2',
					400: '#D4C9AE',
					500: '#C4B899',
					600: '#A69E86',
					700: '#8A8370',
				},
			},
			fontFamily: {
				'display': ['Roca Two', 'system-ui', 'sans-serif'],
				'body': ['HK Grotesk Pro', 'system-ui', 'sans-serif'],
				'mono': ['ui-monospace', 'SF Mono', 'Cascadia Code', 'Fira Code', 'monospace'],
			},
			spacing: {
				'section': '120px',
				'block': '64px',
				'element': '32px',
				'tight': '16px',
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'ticker-up': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-50%)' }
				},
				'ticker-down': {
					'0%': { transform: 'translateY(-50%)' },
					'100%': { transform: 'translateY(0)' }
				},
			},
			animation: {
				'fade-in': 'fade-in 0.6s ease-out',
				'ticker-up': 'ticker-up 30s linear infinite',
				'ticker-down': 'ticker-down 30s linear infinite',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
};
