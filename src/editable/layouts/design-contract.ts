import type { CSSProperties } from 'react'

/*
  Design contract — mapped to hirekit-temlis.webflow.io tokens.

  Palette: cream beige page, deep-purple primary, neon-green accent,
  near-black ink surfaces for CTA slabs and footer. Typography pairs
  a serif display (Instrument Serif) with Inter body. Buttons are soft
  rounded (0.75rem) — not pill, not sharp. Cards are hairline-bordered
  with a gentle lift on hover.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#fcfaed',
  '--slot4-page-text': '#120e00',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#555555',
  '--slot4-soft-muted-text': '#8a8a85',
  '--slot4-primary': '#520080',
  '--slot4-primary-soft': '#ebe1fd',
  '--slot4-accent': '#520080',
  '--slot4-accent-fill': '#c6fe01',
  '--slot4-accent-soft': '#d7fdcf',
  '--slot4-on-accent': '#120e00',
  '--slot4-on-primary': '#fcfaed',
  '--slot4-dark-bg': '#120e00',
  '--slot4-dark-text': '#fcfaed',
  '--slot4-media-bg': '#efece0',
  '--slot4-cream': '#fcfaed',
  '--slot4-warm': '#f7f2e0',
  '--slot4-lavender': '#ebe1fd',
  '--slot4-mint-soft': '#d7fdcf',
  '--slot4-orange-soft': '#feeecd',
  '--slot4-gray': '#f2ede0',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#fcfaed',
  '--editable-page-text': '#120e00',
  '--editable-container': '1200px',
  '--editable-border': '#e0e0e0',
  '--editable-nav-bg': '#fcfaed',
  '--editable-nav-text': '#120e00',
  '--editable-nav-active': '#520080',
  '--editable-nav-active-text': '#c6fe01',
  '--editable-cta-bg': '#120e00',
  '--editable-cta-text': '#c6fe01',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#120e00',
  '--editable-footer-text': '#fcfaed',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-primary)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-primary)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  primaryBg: 'bg-[var(--slot4-primary)]',
  primaryText: 'text-[var(--slot4-primary)]',
  onPrimaryText: 'text-[var(--slot4-on-primary)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  mintSoftBg: 'bg-[var(--slot4-mint-soft)]',
  orangeSoftBg: 'bg-[var(--slot4-orange-soft)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(18,14,0,0.04)]',
  shadowStrong: 'shadow-[0_18px_46px_rgba(18,14,0,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.7))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-28',
    sectionYSm: 'py-10 sm:py-14 lg:py-16',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'editable-label text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-primary)]',
    heroTitle: 'editable-display text-[3rem] leading-[1.02] sm:text-[3.75rem] lg:text-[5rem] xl:text-[5.5rem]',
    sectionTitle: 'editable-display text-[2.25rem] leading-[1.05] sm:text-[3rem] lg:text-[3.5rem]',
    subTitle: 'editable-display text-[1.75rem] leading-[1.15] sm:text-[2.25rem]',
    emphasis: 'editable-italic italic',
    body: 'text-[1rem] leading-[1.65] text-[var(--slot4-muted-text)]',
    lead: 'text-[1.125rem] leading-[1.6] text-[var(--slot4-muted-text)] sm:text-[1.25rem]',
  },
  surface: {
    card: `rounded-[1.25rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[1.25rem] border ${editablePalette.border} bg-[var(--slot4-warm)]`,
    dark: `rounded-[1.25rem] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    primary: `rounded-[1.25rem] ${editablePalette.primaryBg} ${editablePalette.onPrimaryText}`,
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-on-accent)]',
    darkPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-dark-text)]',
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-[0.75rem] bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-medium text-[var(--slot4-accent-fill)] transition duration-300 hover:-translate-y-[1px] hover:bg-[var(--slot4-primary)] hover:text-[var(--slot4-accent-fill)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-[0.75rem] border border-[var(--slot4-dark-bg)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-dark-bg)] hover:text-[var(--slot4-accent-fill)]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-[0.75rem] bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_10px_28px_rgba(198,254,1,0.28)]`,
    ghost: `inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-primary)]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1rem] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(82,0,128,0.10)]',
    fade: 'transition duration-300 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.03]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site palette in editableRootStyle first; all sections consume those CSS variables.',
  'Keep home section order in HomeSections.tsx: hero → benefits band → primary feed → library preview → stats → steps → CTA slab.',
  'Serif display face is Instrument Serif; body is Inter. Never hardcode font-family in JSX.',
  'Use dc.button.primary/accent for real CTAs and dc.button.secondary/ghost for supporting actions.',
  'Wrap section headers and grid items in <EditableReveal index={i}> for staggered reveals.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
