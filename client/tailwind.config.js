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
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Deep Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
        },
        dark: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glass-sm': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        'glass': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'glass-glow': '0 10px 25px -5px rgba(20, 184, 166, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.01), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, hsla(169, 100%, 85%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(262, 100%, 85%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(333, 100%, 85%, 1) 0px, transparent 50%)',
        'mesh-subtle': 'radial-gradient(at 0% 0%, hsla(169, 80%, 95%, 1) 0px, transparent 40%), radial-gradient(at 100% 100%, hsla(262, 80%, 95%, 1) 0px, transparent 40%)',
      }
    },
  },
  plugins: [],
}
