import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field notes',
    headline: 'Long reads on the neighbourhood, worth sitting with.',
    description: 'Guides, explainers and slow-cooked stories about the places, people and paperwork that make this community tick.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Written for readers who like their coffee, and their prose, taken unhurried.',
    chips: ['Editorial pace', 'Topic filters', 'Deep dives'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fresh offers and time-boxed listings from the neighbourhood.',
    description: 'Short, practical posts you can act on today — surplus stock, room-to-let notes, hand-me-downs and quick-turn work.',
    filterLabel: 'Filter notice type',
    secondaryNote: 'The board moves fast; snap up what fits before it rolls off.',
    chips: ['Fast scan', 'Fresh weekly', 'Direct action'],
  },
  sbm: {
    eyebrow: 'Curated links',
    headline: 'A shelf of hand-picked links, kept in one calm place.',
    description: 'Tools, references and outside reading worth saving — grouped so you can find them again next month, not just next tab.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Every entry earned its spot on the shelf.',
    chips: ['Curated', 'Grouped', 'Reference-ready'],
  },
  profile: {
    eyebrow: 'The directory people',
    headline: 'Faces behind the shopfronts and study rooms.',
    description: 'Owners, organisers and quiet-hand experts — the humans behind the businesses and reference guides you find here.',
    filterLabel: 'Filter people by field',
    secondaryNote: 'Discovery works better when a name and a face come with the listing.',
    chips: ['Identity first', 'Community', 'Verified'],
  },
  pdf: {
    eyebrow: 'Reference library',
    headline: 'A quiet reading room of downloadable guides and reports.',
    description: 'Guides, reports, briefs and background papers you can open in a tab or download to keep. Every entry is a real file, not a lead form.',
    filterLabel: 'Filter by section',
    secondaryNote: 'Take a copy for the bench, the plane or the archive.',
    chips: ['Free to download', 'Reference-ready', 'Real files'],
  },
  listing: {
    eyebrow: 'Local directory',
    headline: 'The neighbourhood’s open-door directory.',
    description: 'Practical, plain-language entries for the places around the corner — hours, address, contact, and honest notes about what to expect.',
    filterLabel: 'Filter by category',
    secondaryNote: 'Trust cues, direct actions and less scrolling.',
    chips: ['Address & hours', 'Direct contact', 'Community verified'],
  },
  image: {
    eyebrow: 'Visual wall',
    headline: 'A wall of photographs from around the block.',
    description: 'Storefronts, sunsets, opening days and everyday scenes. A calmer, slower photo feed for the neighbourhood.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'Let the photos do most of the talking.',
    chips: ['Portfolio flow', 'Visual first', 'Slower feed'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
