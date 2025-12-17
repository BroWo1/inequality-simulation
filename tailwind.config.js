/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', '"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        rarity: {
          common: '#c7ced8',
          rare: '#6fa8ff',
          epic: '#c184ff',
          legendary: '#f5b963',
        },
      },
      boxShadow: {
        panel: '0 20px 80px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08), transparent 25%), radial-gradient(circle at 80% 0%, rgba(111, 168, 255, 0.14), transparent 30%), radial-gradient(circle at 50% 80%, rgba(193, 132, 255, 0.14), transparent 32%)',
      },
    },
  },
  plugins: [],
}
