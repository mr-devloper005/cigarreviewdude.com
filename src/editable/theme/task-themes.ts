import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  One shared visual language for every task surface, mapped to the
  hirekit-temlis reference (cream page + serif display + purple/green
  accent). Only the kicker + note copy varies per task, using the
  renamed display labels for listing ("Local Directory") and pdf
  ("Reference Library").
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Instrument Serif', 'Times New Roman', ui-serif, Georgia, serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared cream palette + neon-green punch used everywhere; the accent-soft
// variant is the mint wash that pairs with it on light surfaces.
const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#fcfaed',
  surface: '#ffffff',
  raised: '#f7f2e0',
  text: '#120e00',
  muted: '#555555',
  line: '#e0e0e0',
  accent: '#520080',
  accentSoft: '#ebe1fd',
  onAccent: '#c6fe01',
  glow: 'rgba(82,0,128,0.08)',
  radius: '1.25rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Field Notes', note: 'Long-form pieces, guides and stories worth a slow read.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Find, compare and connect with the businesses around you.' },
  classified: { ...base, kicker: 'Notice Board', note: 'Fresh offers and time-sensitive listings, ready to act on.' },
  image: { ...base, kicker: 'Visual Wall', note: 'A curated feed of standout images and photo galleries.' },
  sbm: { ...base, kicker: 'Curated Links', note: 'Hand-picked resources and references worth saving.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Guides, reports and reference documents you can download.' },
  profile: { ...base, kicker: 'The Directory People', note: 'Discover the creators and businesses shaping this community.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.onAccent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
