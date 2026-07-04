import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Compass, Download, FileText, MapPin, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

/*
  Home page sections — visual language mapped to hirekit-temlis.
  Section order:
    1. Hero (huge serif h1 with italic accent word, dual CTAs, quick facts row)
    2. Discovery band (About/Contact primary tiles + directory/library entry)
    3. Directory feed strip (Local Directory renamed feed)
    4. Reference Library preview strip
    5. Time-based collections
    6. Stats/trust band on dark
    7. CTA slab
*/

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-6 lg:px-8'

function taskLabel(task: TaskKey) {
  return getTaskTheme(task).kicker
}

function taskRoute(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.route || `/${task}`
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function excerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw = (typeof content.description === 'string' && content.description) || post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

/* ------------------------------- Hero ------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const [rawTitleA, rawTitleB] = pagesContent.home.hero.title
  const brand = SITE_CONFIG.name

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(82,0,128,0.10),transparent_75%)]" />
      <div className={`relative ${container} pb-16 pt-12 sm:pt-16 lg:pt-24`}>
        <EditableReveal>
          <p className={dc.badge.pill}>{pagesContent.home.hero.badge}</p>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1 className="editable-display mt-6 max-w-[16ch] text-balance text-[3rem] leading-[1.02] tracking-[-0.005em] sm:text-[4.25rem] lg:text-[5.5rem]">
            {rawTitleA} <span className="editable-italic italic">{rawTitleB}</span>
          </h1>
        </EditableReveal>

        <EditableReveal index={2}>
          <p className="mt-6 max-w-2xl text-[1.05rem] leading-[1.7] text-[var(--slot4-muted-text)] sm:text-[1.15rem]">
            {pagesContent.home.hero.description}
          </p>
        </EditableReveal>

        <EditableReveal index={3}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href={pagesContent.home.hero.primaryCta.href} className={dc.button.primary}>
              {pagesContent.home.hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={pagesContent.home.hero.secondaryCta.href} className={dc.button.secondary}>
              {pagesContent.home.hero.secondaryCta.label}
            </Link>
            <Link href="/search" className={dc.button.ghost}>
              or search everything <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        {/* Quick-facts strip */}
        <EditableReveal index={4}>
          <div className="mt-14 grid gap-3 sm:grid-cols-3">
            {[
              { icon: MapPin, label: 'Neighbourhood-first', note: 'A directory kept by hand — not scraped, not padded.' },
              { icon: BookOpen, label: 'Reference-ready', note: 'A shelf of downloadable guides and reports, always free.' },
              { icon: Compass, label: 'One search, both shelves', note: 'Type a shop name or a brief title — either surfaces.' },
            ].map((item, i) => (
              <div key={item.label} className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 transition-transform duration-500" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-primary)] text-[var(--slot4-on-primary)]">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-[var(--slot4-page-text)]">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </EditableReveal>

        {/* Latest posters (uses actual post images) */}
        {pool.length ? (
          <EditableReveal index={5}>
            <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {pool.slice(0, 6).map((post, i) => {
                const img = getEditablePostImage(post)
                return (
                  <Link
                    key={post.id || post.slug}
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-[0.75rem] border border-[var(--editable-border)] bg-[var(--slot4-media-bg)]"
                    style={{ transform: `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})` }}
                  >
                    <img src={img} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
                    <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(18,14,0,0.85))] p-2.5">
                      <p className="line-clamp-2 text-[0.7rem] leading-tight text-white/90">{post.title}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Freshest across {brand}</p>
          </EditableReveal>
        ) : null}
      </div>
    </section>
  )
}

/* ---------------- Discovery band (about the two shelves) ---------------- */
export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const intro = pagesContent.home.intro
  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <EditableReveal>
            <p className={dc.badge.pill}>{intro.badge}</p>
            <h2 className="editable-display mt-6 text-[2.25rem] leading-[1.08] sm:text-[3rem] lg:text-[3.5rem]">
              One home for the places you go, and the <span className="editable-italic italic">papers you keep</span>.
            </h2>
            <div className="mt-6 space-y-4 text-[1.05rem] leading-[1.75] text-[var(--slot4-muted-text)]">
              {intro.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={intro.primaryLink.href} className={dc.button.primary}>{intro.primaryLink.label}</Link>
              <Link href={intro.secondaryLink.href} className={dc.button.secondary}>{intro.secondaryLink.label}</Link>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="rounded-[1.5rem] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_20px_60px_rgba(18,14,0,0.06)]">
              <p className="editable-label text-[0.7rem] uppercase tracking-[0.24em] text-[var(--slot4-primary)]">{intro.sideBadge}</p>
              <ul className="mt-6 space-y-4">
                {intro.sidePoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[0.95rem] leading-7 text-[var(--slot4-page-text)]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-primary)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <Link href={primaryRoute} className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-primary)]">
                Start with the {taskLabel('listing')} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Primary feed strip (magazine split) ---------------- */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!activity.length) return null
  const kicker = taskLabel(primaryTask)
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <EditableReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className={dc.type.eyebrow}>Latest — {kicker}</p>
              <h2 className="editable-display mt-3 text-[2.25rem] leading-[1.05] sm:text-[3rem]">
                Fresh from the <span className="editable-italic italic">neighbourhood</span>.
              </h2>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              See every entry <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activity.map((post, i) => {
            const cat = categoryOf(post) || kicker
            const img = getEditablePostImage(post)
            const href = postHref(primaryTask, post, primaryRoute)
            return (
              <EditableReveal key={post.id || post.slug} index={i}>
                <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(82,0,128,0.08)]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
                    <img src={img} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-dark-bg)]/85 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">
                      {cat}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="editable-display line-clamp-2 text-[1.5rem] leading-[1.2]">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{excerpt(post, 140)}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] underline decoration-[var(--slot4-accent-fill)] decoration-[3px] underline-offset-[6px] transition group-hover:decoration-[var(--slot4-primary)]">
                      Open entry <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Time-based collections + library preview ---------------- */
const sectionCopy: Record<string, { eyebrow: string; title: string; italicTail: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'Added in the last', italicTail: 'seven days' },
  browse: { eyebrow: 'Popular now', title: 'Warmest this', italicTail: 'month' },
  index: { eyebrow: 'Evergreen', title: 'From the', italicTail: 'archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to', italicTail: 'explore' }
        const bg = index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'
        return (
          <section key={section.key} className={bg}>
            <div className={`${container} ${dc.shell.sectionY}`}>
              <EditableReveal>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className={dc.type.eyebrow}>{copy.eyebrow}</p>
                    <h2 className="editable-display mt-3 text-[2rem] leading-[1.05] sm:text-[2.75rem]">
                      {copy.title} <span className="editable-italic italic">{copy.italicTail}</span>.
                    </h2>
                  </div>
                  <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                    See more <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </EditableReveal>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => {
                  const cat = categoryOf(post) || taskLabel(primaryTask)
                  const img = getEditablePostImage(post)
                  return (
                    <EditableReveal key={post.id || post.slug} index={i}>
                      <Link href={postHref(primaryTask, post, primaryRoute)} className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(82,0,128,0.10)]">
                        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
                          <img src={img} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                        </div>
                        <div className="flex flex-1 flex-col p-5">
                          <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-primary)]">{cat}</p>
                          <h3 className="editable-display mt-2 line-clamp-2 text-[1.3rem] leading-[1.2]">{post.title}</h3>
                          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{excerpt(post, 110)}</p>
                        </div>
                      </Link>
                    </EditableReveal>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ---------------- Reference library preview strip (document-forward) ---- */
export function EditableLibraryStrip({ posts }: { posts: SitePost[] }) {
  const docs = dedupePosts(posts).slice(0, 4)
  const libraryRoute = taskRoute('pdf')
  if (!docs.length) return null
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <EditableReveal>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Reference library</p>
              <h2 className="editable-display mt-4 text-[2.25rem] leading-[1.05] text-white sm:text-[3rem]">
                A shelf worth <span className="editable-italic italic">downloading</span>.
              </h2>
              <p className="mt-4 max-w-lg text-[0.98rem] leading-7 text-white/70">
                Guides, briefs and reference files you can open in a tab or keep for the road. Every entry is a real file — no lead form, no email wall.
              </p>
            </div>
            <div className="justify-self-end">
              <Link href={libraryRoute} className={dc.button.accent}>
                Open the library <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </EditableReveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((post, i) => (
            <EditableReveal key={post.id || post.slug} index={i}>
              <Link
                href={postHref('pdf', post, libraryRoute)}
                className="group flex h-full flex-col justify-between rounded-[1.25rem] border border-white/15 bg-white/[0.04] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent-fill)]/60"
              >
                <div>
                  <FileText className="h-14 w-14 text-white/95" />
                  <h3 className="editable-display mt-6 line-clamp-3 text-[1.35rem] leading-[1.2] text-white">{post.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/60">{excerpt(post, 110)}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
                  Download <Download className="h-3.5 w-3.5" />
                </span>
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Trust / stats band ---------------- */
export function EditableStatsBand({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const totalPosts = pool.length
  const categorySet = new Set<string>()
  pool.forEach((post) => {
    const cat = categoryOf(post)
    if (cat) categorySet.add(cat.toLowerCase())
  })
  const stats = [
    { value: `${totalPosts}+`, label: 'entries on the shelves' },
    { value: `${categorySet.size || 12}`, label: 'categories to browse' },
    { value: '100%', label: 'downloads free & real' },
    { value: 'By hand', label: 'every listing checked' },
  ]
  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`${container} ${dc.shell.sectionYSm}`}>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <EditableReveal key={stat.label} index={i}>
              <div>
                <p className="editable-display text-[2.5rem] leading-none sm:text-[3.25rem]">{stat.value}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{stat.label}</p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Final CTA slab ---------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-page-bg)]">
      <div className={`${container} ${dc.shell.sectionY}`}>
        <EditableReveal>
          <div className="overflow-hidden rounded-[1.75rem] bg-[var(--slot4-primary)] px-8 py-16 text-[var(--slot4-on-primary)] sm:px-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">{cta.badge}</p>
              <h2 className="editable-display mt-5 text-[2.25rem] leading-[1.05] text-white sm:text-[3rem] lg:text-[3.5rem]">
                {cta.title.split(',')[0]}, <span className="editable-italic italic">or a report worth sharing?</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[1rem] leading-7 text-white/75">{cta.description}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link href={cta.primaryCta.href} className={`${dc.button.accent}`}>
                  {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href={cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-[0.75rem] border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                  {cta.secondaryCta.label}
                </Link>
              </div>
              <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" /> Read every submission
              </div>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* Placeholder to keep the exported symbol table for HomePage — icon set no
   longer needed but kept exported for compatibility with older imports. */
export const homeSectionIcons = { FileText }
