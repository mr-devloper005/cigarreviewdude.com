import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A neighbourhood directory & reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Directory & Reference Library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Search', href: '/search' },
    },
  },
  footer: {
    tagline: 'The neighbourhood directory and reference library',
    description:
      `${slot4BrandConfig.siteName} pairs a hand-kept local directory with a downloadable reference library — one warm place to find who to call and what to read next.`,
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listings' },
          { label: 'Reference Library', href: '/pdf' },
          { label: 'Field Notes', href: '/articles' },
          { label: 'Visual Wall', href: '/image-sharing' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Made for discovery, built to browse.',
  },
  commonLabels: {
    readMore: 'Read the piece',
    viewAll: 'See all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
