import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/**
 * Editorial hero card — dark near-black slab with warm image wash, neon-green
 * eyebrow, oversized serif title. Matches the reference's hero showcase tone.
 */
export function EditorialFeatureCard({ post, href, label = 'Featured entry' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(18,14,0,0.30)]`}>
      <div className="relative min-h-[480px] p-6 sm:p-9 lg:min-h-[580px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,14,0,0.35),rgba(18,14,0,0.92))]" />
        <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end lg:min-h-[520px]">
          <span className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{label}</span>
          <h3 className="editable-display mt-5 max-w-3xl text-[2.5rem] leading-[1.05] sm:text-[3rem] lg:text-[3.75rem]">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">{getEditableExcerpt(post, 180)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-[0.75rem] bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-medium text-[var(--slot4-on-accent)]">
            Read the piece <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/**
 * Rail card for horizontal snap rails — soft-bordered cream card with a 4:3
 * image frame and a serif title in muted ink.
 */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-5">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-[1.625rem] leading-[1.15] ${pal.panelText}`}>{post.title}</h3>
        <p className={`mt-3 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

/**
 * Compact indexed card used in dense grids — soft warm surface, purple index
 * dot, serif title.
 */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-dark-bg)] text-[0.7rem] font-semibold text-[var(--slot4-accent-fill)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-2 line-clamp-2 text-[1.5rem] leading-[1.15] ${pal.panelText}`}>{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

/**
 * Wide article-list card — image tile on the left, generous serif title
 * on the right, with a neon-underlined "open" affordance.
 */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[200px]`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={dc.type.eyebrow}>No. {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-[1.75rem] leading-[1.1] ${pal.panelText} sm:text-[2rem]`}>{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 200)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--slot4-page-text)] underline decoration-[var(--slot4-accent-fill)] decoration-[3px] underline-offset-[6px] transition group-hover:decoration-[var(--slot4-primary)]">
          Open entry <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
