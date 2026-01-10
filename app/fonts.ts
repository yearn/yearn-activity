import localFont from 'next/font/local';

export const aeonik = localFont({
  src: [
    {
      path: '../static/fonts/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../static/fonts/Aeonik-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../static/fonts/Aeonik-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik',
  display: 'swap',
  preload: true,
});

export const aeonikMono = localFont({
  src: [
    {
      path: '../static/fonts/AeonikMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../static/fonts/AeonikMono-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-aeonik-mono',
  display: 'swap',
  preload: true,
});
