/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#10B981',
					light: '#34D399',
					dark: '#059669'
				},
				accent: {
					DEFAULT: '#4ADE80',
					light: '#86EFAC',
					dark: '#22C55E'
				},
				neutral: {
					DEFAULT: '#1F2937',
					light: '#6B7280',
					lighter: '#F3F4F6'
				}
			},
			animation: {
				'glow': 'glow 2s ease-in-out infinite alternate',
				'glow-text': 'glow-text 2s ease-in-out infinite alternate',
				'float': 'float 6s ease-in-out infinite'
			},
			keyframes: {
				glow: {
					'0%': {
						'box-shadow': '0 0 5px #4ADE80, 0 0 10px #86EFAC, 0 0 15px #10B981',
						'transform': 'translateY(0)'
					},
					'100%': {
						'box-shadow': '0 0 10px #4ADE80, 0 0 20px #86EFAC, 0 0 30px #10B981',
						'transform': 'translateY(-3px)'
					}
				},
				'glow-text': {
					'0%': {
						'text-shadow': '0 0 5px #4ADE80, 0 0 10px #86EFAC'
					},
					'100%': {
						'text-shadow': '0 0 10px #4ADE80, 0 0 20px #86EFAC, 0 0 30px #10B981'
					}
				},
				float: {
					'0%, 100%': {
						'transform': 'translateY(0)'
					},
					'50%': {
						'transform': 'translateY(-10px)'
					}
				}
			},
			boxShadow: {
				'neon': '0 0 5px #4ADE80, 0 0 10px #86EFAC, 0 0 15px #10B981',
				'neon-strong': '0 0 10px #4ADE80, 0 0 20px #86EFAC, 0 0 30px #10B981'
			}
		},
	},
	plugins: [],
}
