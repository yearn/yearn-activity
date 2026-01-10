import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-aeonik)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-aeonik-mono)', 'monospace'],
      },
      colors: {
        'yearn-blue': '#0675F9',
        'good-ol-grey': {
          100: '#F4F4F4',
          200: '#EBEBEB',
          300: '#E1E1E1',
          400: '#9D9D9D',
          500: '#7E7E7E',
          600: '#5B5B5B',
          700: '#424242',
          800: '#282828',
          900: '#0C0C0C',
        },
        'metaverse-sunset': {
          50: '#FFEEA9',
          100: '#FFDC53',
          200: '#F1F025',
          300: '#E6FC06',
          400: '#F0D308',
          500: '#F8A908',
          600: '#F27F07',
          700: '#EA5204',
          800: '#C73203',
          900: '#8F0000',
        },
        'disco-salmon': {
          50: '#FFECEF',
          100: '#FF90A1',
          200: '#FD5DA5',
          300: '#FA3AA7',
          400: '#EE478A',
          500: '#DF536A',
          600: '#CC3767',
          700: '#B71962',
          800: '#99104F',
          900: '#6A0031',
        },
        'tokyo-party': {
          50: '#D1A2DD',
          100: '#A446BA',
          200: '#7829E1',
          300: '#5814FB',
          400: '#6B26C2',
          500: '#7D3787',
          600: '#663690',
          700: '#4F3398',
          800: '#371F75',
          900: '#120040',
        },
        'up-only-green': {
          50: '#DDF3AC',
          100: '#BAE659',
          200: '#55F541',
          300: '#0DFF2F',
          400: '#38E331',
          500: '#63C532',
          600: '#34A14F',
          700: '#00796D',
          800: '#016057',
          900: '#003934',
        },
      },
    },
  },
  plugins: [],
};

export default config;
