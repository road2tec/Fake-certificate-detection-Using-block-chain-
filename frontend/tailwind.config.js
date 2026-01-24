/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Custom theme - NO black, blue, grey
                cream: {
                    50: '#FFFDF9',
                    100: '#FAF7F2',  // Updated to user's exact spec
                    200: '#F5F0E8',
                    300: '#EDE5D9',
                    400: '#E5DACC',
                },
                emerald: {
                    50: '#E6F5F0',
                    100: '#CCE9E0',
                    200: '#99D4C1',
                    300: '#66BEA3',
                    400: '#33A984',
                    500: '#1E8E6E',  // Updated to user's exact spec - trust & authenticity
                    600: '#187658',
                    700: '#125E46',
                },
                coral: {
                    50: '#FFF5F0',
                    100: '#FFE8DE',
                    200: '#FFD1BD',
                    300: '#FFB99C',
                    400: '#FF8C6B',  // Updated to user's exact spec - peach/coral
                    500: '#F97316',
                    600: '#EA580C',
                },
                violet: {
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',  // Lavender accent
                    600: '#7C3AED',
                },
                gold: {
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F4C430',  // Updated to user's exact spec
                    600: '#D97706',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, #FDF8F3 0%, #ECFDF5 50%, #F5F3FF 100%)',
                'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(16, 185, 129, 0.1)',
                'glass-lg': '0 8px 32px 0 rgba(16, 185, 129, 0.2)',
                'glow': '0 0 40px rgba(16, 185, 129, 0.3)',
                'glow-coral': '0 0 40px rgba(249, 115, 22, 0.3)',
                'glow-violet': '0 0 40px rgba(139, 92, 246, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
}
