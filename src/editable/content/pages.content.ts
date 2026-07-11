import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Honest Cigar Reviews & Ratings`,
      description: `Straight-talking cigar reviews, tasting notes and buying guides at ${slot4BrandConfig.siteName} — every stick smoked to the band and rated by hand, with a free shelf of pairing briefs to download.`,
      openGraphTitle: `${slot4BrandConfig.siteName} — Honest Cigar Reviews & Ratings`,
      openGraphDescription: 'Hand-picked cigar reviews, ratings and tasting notes paired with a free library of pairing and buying guides.',
      keywords: ['cigar reviews', 'cigar ratings', 'best cigars', 'cigar tasting notes', 'cigar buying guide', 'cigar pairings'],
    },
    hero: {
      badge: 'Honest cigar reviews & ratings',
      title: ['The best cigars,', 'found and reviewed for you.'],
      description:
        'Cigar Review Dude smokes every stick to the band — burn, draw and flavour, start to finish — then hands you an honest rating you can actually trust. No hype and no paid placements, just a hand-picked shelf of reviews, pairing notes and buying guides to light up your next pick with confidence.',
      primaryCta: { label: 'Browse cigar reviews', href: '/listings' },
      secondaryCta: { label: 'Open the tasting library', href: '/pdf' },
      searchPlaceholder: 'Search a blend, a brand or a guide title',
      focusLabel: 'This week',
      featureCardBadge: 'Rotating covers',
      featureCardTitle: 'The freshest reviews and downloads set the cover mood.',
      featureCardDescription: 'Recent entries lead the visual rhythm without touching any of the underlying discovery logic.',
    },
    intro: {
      badge: 'Two shelves, one warm room',
      title: 'One home for the places you go and the papers you keep.',
      paragraphs: [
        'The directory holds the businesses, studios and services worth knowing about — hours, address, honest notes and a clean way to make contact.',
        'The reference library holds the paperwork that goes with a neighbourhood — playbooks, reports, guides and briefs, all real files, all free to download.',
        'Move between the two like moving between the front-of-house and the back office of the same small building.',
      ],
      sideBadge: 'What lives here',
      sidePoints: [
        'A local directory kept by hand, not scraped.',
        'A shelf of guides and reports, always downloadable.',
        'Editorial field notes when a listing deserves a longer story.',
        'Search that reaches every corner of the site.',
      ],
      primaryLink: { label: 'Open the directory', href: '/listings' },
      secondaryLink: { label: 'Browse the library', href: '/pdf' },
    },
    cta: {
      badge: 'Add your corner',
      title: 'Have a shopfront to list, or a report worth sharing?',
      description: 'Send it in — we read every submission, and good ones land in the directory or on the library shelf within the week.',
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Ask a question', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'Recent additions to this shelf.',
    },
  },
  about: {
    badge: 'About the room',
    title: 'A calmer, warmer way to find things around here.',
    description: `${slot4BrandConfig.siteName} was built to pair a neighbourhood directory with a downloadable reference library, so finding a place and the paperwork that explains it feels like one visit, not two.`,
    paragraphs: [
      'Half the site is the directory — a hand-kept list of shops, studios and services, written in plain language with the details you actually need before you visit.',
      'The other half is the library — a shelf of guides, reports and reference briefs you can download in one click and keep.',
      'Everything sits behind a slow, readable design, because discovery works better when the room isn’t shouting.',
    ],
    values: [
      {
        title: 'Directory kept by hand',
        description: 'No scraping. Every listing is written and checked, so the details you read are the details you meet.',
      },
      {
        title: 'A real library, not a lead form',
        description: 'Guides and reports are actual files. Open in a tab, or download and keep — no email wall.',
      },
      {
        title: 'Slow, steady discovery',
        description: 'Fewer cards, larger type, and quiet colour. Browsing here should feel like a good bookshop.',
      },
    ],
  },
  contact: {
    eyebrow: `Write to ${slot4BrandConfig.siteName}`,
    title: 'A short note to the desk, not a support queue.',
    description: 'Tell us about a listing to add, a file to share, or something on the site that isn’t behaving. We read everything and reply from a real inbox.',
    formTitle: 'Send a note',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search the directory and the reference library — every listing, guide and post lives behind one search box.',
    },
    hero: {
      badge: 'Search the room',
      title: 'Find a place, a person or a paper.',
      description: 'One search reaches the directory, the library shelf and the field notes.',
      placeholder: 'Search a shop name, a brief title or a category',
    },
    resultsTitle: 'Latest across the site',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Submit a listing, a file or a piece of writing for the site.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to open the submission desk.',
      description: 'Members can add directory entries, upload library files and file short field notes.',
    },
    hero: {
      badge: 'Submission desk',
      title: 'File a listing, upload a brief or send in a piece.',
      description: 'Pick the type, fill in the details and add any images or files. Submissions are queued for a quick edit before they go live.',
    },
    formTitle: 'Submission details',
    submitLabel: 'File this submission',
    successTitle: 'Filed. Thank you — we’ll take it from here.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign back in to your account.',
      badge: 'Members only',
      title: 'Welcome back to the room.',
      description: 'Sign in to keep bookmarks, file submissions and edit anything you’ve added to the directory.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched that. Try creating one, then signing in.',
      success: 'You’re in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account for the site.',
      badge: 'New around here',
      title: 'Make an account, and take a seat.',
      description: 'Members can save entries, file submissions and manage their own listings.',
      formTitle: 'Create account',
      submitLabel: 'Open the account',
      passwordShort: 'Please use at least four characters.',
      success: 'Account created. Welcome in.',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More field notes',
      fallbackTitle: 'Field note',
    },
    listing: {
      relatedTitle: 'More in the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More from the wall',
      fallbackTitle: 'Visual entry',
    },
    profile: {
      relatedTitle: 'Their field notes',
      fallbackDescription: 'A short introduction will appear here once the person publishes one.',
      visitButton: 'Visit official site',
    },
  },
} as const
