import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EditLocal — Free Private Media Tools',
    short_name: 'EditLocal',
    description: 'Free video and photo tools that process files locally without uploads.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9fc',
    theme_color: '#6d28d9',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
