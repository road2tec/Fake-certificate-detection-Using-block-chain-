/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    dark: '#030712',
                    navy: '#0f172a',
                    blue: '#1e293b',
                },
                accent: {
                    pink: '#d53369',
                    orange: '#daae51',
                    indigo: '#6366f1',
                    purple: '#8b5cf6',
                }
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #1e293b 100%)',
                'cta-gradient': 'linear-gradient(to right, #d53369, #daae51)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glow': '0 0 40px rgba(99, 102, 241, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
