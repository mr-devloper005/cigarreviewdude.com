import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Camera, CheckCircle2, Clock, Download,
  ExternalLink, FileText, Globe2, Layers, Mail, MapPin, Phone, ShieldCheck, Share2,
  Sparkles, Star, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const tagsOf = (post: SitePost) => (post.tags || []).slice(0, 6)
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {theme.kicker}
    </Link>
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = tagsOf(post)
  if (!tags.length) return null
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1 text-xs font-medium text-[var(--tk-muted)]">#{tag}</span>
      ))}
    </div>
  )
}

/* ============================ Article ============================ */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="article" />
        <p className="mt-10 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">{categoryOf(post, 'Field note')}</p>
        <h1 className="editable-display mt-5 text-balance text-[2.5rem] leading-[1.05] sm:text-[3.5rem] lg:text-[4rem]">{post.title}</h1>
        {leadText(post) ? <p className="editable-italic italic mt-6 text-[1.35rem] leading-[1.5] text-[var(--tk-muted)] sm:text-[1.6rem]">{leadText(post)}</p> : null}
        <div className="mt-6 text-sm text-[var(--tk-muted)]">
          <span>{SITE_CONFIG.name}</span>
        </div>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" /> : null}
        <BodyContent post={post} />
        <TagChips post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ============================ Listing ============================
   Premium directory record. New layout with prominent dates.
   - Breadcrumb row (Home / Directory / entry)
   - Kicker chip + category chip + established / updated date chips
   - Editorial serif h1, italic lead, author line with published date
   - Full-bleed 21:9 hero with overlay meta
   - Highlights bar (rating + district + price band + verified date)
   - Quick-facts grid (address / phone / hours / verified)
   - Two-column body: intro paragraph + core body + tag chips + gallery + map
   - Sticky sidebar: contact rows, dated log, primary CTA, trust panel, ads
   - Related strip
*/
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0]
  const gallery = images.slice(1)
  const address = getField(post, ['address', 'location', 'city'])
  const district = getField(post, ['district', 'neighbourhood', 'neighborhood', 'area'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'schedule', 'openingHours']) || 'Mon–Sat · 9:00 – 18:00'

  const founded = getField(post, ['founded', 'established', 'since']) || ''
  const author = getField(post, ['author', 'listedBy', 'submittedBy']) || SITE_CONFIG.name
  const category = categoryOf(post, 'Local')
  const mapSrc = mapSrcFor(post)

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[var(--tk-muted)]">
          <Link href="/" className="transition hover:text-[var(--tk-text)]">Home</Link>
          <span>/</span>
          <Link href={getTaskConfig('listing')?.route || '/listings'} className="transition hover:text-[var(--tk-text)]">{getTaskTheme('listing').kicker}</Link>
          <span>/</span>
          <span className="truncate text-[var(--tk-text)]">{post.title}</span>
        </nav>

        {/* Kicker + category chips */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="editable-label rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--tk-accent)]">
            {getTaskTheme('listing').kicker}
          </span>
          <span className="editable-label rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            {category}
          </span>
          {district ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1 text-[0.72rem] font-medium text-[var(--tk-muted)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {district}
            </span>
          ) : null}
        </div>

        {/* Title & lead */}
        <h1 className="editable-display mt-6 max-w-4xl text-balance text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.75rem]">{post.title}</h1>
        {leadText(post) ? (
          <p className="editable-italic italic mt-6 max-w-3xl text-[1.35rem] leading-[1.5] text-[var(--tk-muted)] sm:text-[1.6rem]">{leadText(post)}</p>
        ) : null}

        {/* Author line */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--tk-muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <UserRound className="h-4 w-4" />
            </span>
            <span>Listed by <span className="font-medium text-[var(--tk-text)]">{author}</span></span>
          </span>
          {founded ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="hidden h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50 sm:inline-block" />
              <span>Since {founded}</span>
            </span>
          ) : null}
          <button type="button" className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]">
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>

        {/* Hero image with overlay meta */}
        {heroImage ? (
          <div className="relative mt-10 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
            <div className="relative aspect-[21/9] w-full">
              <img src={heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(18,14,0,0.75))]" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-6 gap-y-2 p-5 text-xs font-medium text-white/85 sm:p-7">
                {district ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" /> {district}</span> : null}
                <span className="inline-flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" /> Community pick</span>
                <span className="ml-auto inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" /> Verified by hand</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Highlights bar */}
        <div className="mt-8 grid gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:grid-cols-2 lg:grid-cols-4">
          <QuickFact icon={MapPin} label="Address" value={address || 'On request'} />
          <QuickFact icon={Phone} label="Phone" value={phone || 'Via the desk'} />
          <QuickFact icon={Clock} label="Hours" value={hours} />
          <QuickFact icon={ShieldCheck} label="Verified" value="By hand" />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <h2 className="editable-display text-[2rem] leading-[1.15] sm:text-[2.5rem]">
              About this <span className="editable-italic italic">entry</span>.
            </h2>
            <BodyContent post={post} />
            <TagChips post={post} />

            {/* Facts table */}
            <section className="mt-12">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-accent)]">The facts</p>
              <h3 className="editable-display mt-3 text-[1.75rem] leading-[1.15]">At a glance.</h3>
              <dl className="mt-6 grid gap-0 divide-y divide-[var(--tk-line)] rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                {[
                  ['Category', category],
                  ['District', district || '—'],
                  
                  ['Established', founded || '—'],
                  
                  
                  ['Listed by', author],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[140px_minmax(0,1fr)] items-baseline gap-4 px-5 py-3 text-sm sm:grid-cols-[180px_minmax(0,1fr)]">
                    <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</dt>
                    <dd className="font-medium text-[var(--tk-text)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {gallery.length ? (
              <section className="mt-12">
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-accent)]">Gallery</p>
                <h3 className="editable-display mt-3 text-[1.75rem] leading-[1.15]">A quick look inside.</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.slice(0, 6).map((image, i) => (
                    <figure key={`${image}-${i}`} className="group relative overflow-hidden rounded-[1rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                      <div className="relative aspect-[4/3]">
                        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {mapSrc ? (
              <section className="mt-12 overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex items-center justify-between gap-2 p-4">
                  <span className="inline-flex items-center gap-2 text-sm font-medium"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {address || 'On the map'}</span>
                  <a href={mapSrc.replace('&output=embed', '')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--tk-accent)]">Get directions <ArrowUpRight className="h-3.5 w-3.5" /></a>
                </div>
                <iframe src={mapSrc} title="Map" loading="lazy" className="h-80 w-full border-0" />
              </section>
            ) : null}
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Contact card with dates */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-accent)]">Get in touch</p>
              <div className="mt-5 space-y-2">
                {address ? <ContactRow icon={MapPin} label={address} href={mapSrc ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}` : undefined} /> : null}
                {phone ? <ContactRow icon={Phone} label={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow icon={Globe2} label={website.replace(/^https?:\/\//, '').replace(/\/$/, '')} href={website} external /> : null}
                <ContactRow icon={Clock} label={hours} />
              </div>
              <Link
                href={website || (phone ? `tel:${phone}` : '#')}
                className={`${dc.button.primary} mt-6 w-full`}
                target={website ? '_blank' : undefined}
                rel={website ? 'noreferrer' : undefined}
              >
                Visit the entry <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust panel */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-accent)]">Trust panel</p>
              <ul className="mt-5 space-y-3 text-sm">
                {([
                  { label: 'Verified by hand', Icon: CheckCircle2 },
                  { label: 'Independent — not sponsored', Icon: ShieldCheck },
                  { label: 'Community-reported entry', Icon: Sparkles },
                ] as const).map(({ label, Icon }) => (
                  <li key={label} className="flex items-start gap-2.5 text-[var(--tk-text)]">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function QuickFact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-[var(--tk-text)]">{value}</p>
      </div>
    </div>
  )
}

function ContactRow({ icon: Icon, label, href, external }: { icon: typeof MapPin; label: string; href?: string; external?: boolean }) {
  const inner = (
    <span className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
      <span className="min-w-0 text-sm font-medium text-[var(--tk-text)]">{label}</span>
    </span>
  )
  if (!href) return <div className="rounded-[0.75rem] px-2 py-2">{inner}</div>
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="block rounded-[0.75rem] px-2 py-2 transition hover:bg-[var(--tk-raised)]"
    >
      {inner}
    </a>
  )
}

/* ============================ Classified ============================ */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <div className="mt-7 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_22px_60px_rgba(82,0,128,0.08)]">
            <Kicker task="classified">Notice</Kicker>
            <h1 className="editable-display mt-4 text-[1.75rem] leading-[1.15]">{post.title}</h1>
            <p className="editable-display mt-6 text-[3rem] leading-none text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className={dc.button.accent}><Phone className="h-4 w-4" /> Call now</a> : null}
              {email ? <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Photos" large />
          <BodyContent post={post} />
          {website ? (
            <a href={website} target="_blank" rel="noreferrer" className={`${dc.button.primary} mt-8`}>Open website <ExternalLink className="h-4 w-4" /></a>
          ) : null}
          <TagChips post={post} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ============================ Image ============================ */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="image" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]"><Camera className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Visual story</div>
            <h1 className="editable-display mt-6 text-[2.5rem] leading-[1.05] sm:text-[3.25rem]">{post.title}</h1>
            {leadText(post) ? <p className="editable-italic italic mt-6 text-[1.2rem] leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <TagChips post={post} />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ============================ Bookmark ============================ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
        <div className="mt-6"><Kicker task="sbm">Saved</Kicker></div>
        <h1 className="editable-display mt-4 text-[2.75rem] leading-[1.05] sm:text-[3.5rem]">{post.title}</h1>
        {leadText(post) ? <p className="editable-italic italic mt-6 text-[1.3rem] leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`${dc.button.accent} mt-8`}>
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
        <TagChips post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ============================ PDF (Reference Library) ============================
   Document workspace.
   - Label chip row: display-label + PDF badge + category
   - Extra-large serif h1 (bigger than listing)
   - Lead paragraph as pull-quote (italic serif)
   - Primary "Download the file" + secondary "Open in new tab"
   - Quick-facts (Pages · Size · Format · Updated)
   - Large PDF preview iframe as centerpiece
   - Two-column body with h2 + tags + repeated CTA callout
   - <Ads slot="article-bottom" /> before related strip
   - Sticky right sidebar: document identity (big glyph, filename, meta rows),
     full-width Download CTA, "What's inside" panel
   - Related documents strip (glyph tiles, no photography)
   NO <img> tags outside sidebar + related strip.
*/
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const filename = getField(post, ['filename', 'fileName']) || `${post.slug || 'brief'}.file`
  const pages = getField(post, ['pages', 'pageCount']) || '—'
  const fileSize = getField(post, ['fileSize', 'size']) || '—'
  const uploadedBy = getField(post, ['author', 'uploader', 'uploadedBy']) || SITE_CONFIG.name
  const category = categoryOf(post, 'Reference brief')
  const insideBody = getBody(post)
  const outlineItems = extractOutline(insideBody).slice(0, 5)
  const theme = getTaskTheme('pdf')
  const version = getField(post, ['version', 'edition']) || '1.0'
  const language = getField(post, ['language', 'lang']) || 'English'

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[var(--tk-muted)]">
          <Link href="/" className="transition hover:text-[var(--tk-text)]">Home</Link>
          <span>/</span>
          <Link href={getTaskConfig('pdf')?.route || '/pdf'} className="transition hover:text-[var(--tk-text)]">{theme.kicker}</Link>
          <span>/</span>
          <span className="truncate text-[var(--tk-text)]">{post.title}</span>
        </nav>

        {/* Chip row */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="editable-label rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--tk-accent)]">
            {theme.kicker}
          </span>
          <span className="editable-label rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--slot4-accent-fill)]">
            File
          </span>
          <span className="editable-label rounded-full border border-[var(--tk-line)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            {category}
          </span>
          <span className="editable-label rounded-full border border-[var(--tk-line)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            v{version}
          </span>
          <span className="editable-label rounded-full border border-[var(--tk-line)] px-3 py-1 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--tk-muted)]">
            {language}
          </span>
        </div>

        {/* Title */}
        <h1 className="editable-display mt-6 max-w-4xl text-balance text-[3rem] leading-[1.02] sm:text-[4.25rem] lg:text-[5.5rem]">
          {post.title}
        </h1>

        {leadText(post) ? (
          <blockquote className="editable-italic italic mt-8 max-w-3xl border-l-4 border-[var(--tk-accent)] pl-6 text-[1.5rem] leading-[1.4] text-[var(--tk-text)] sm:text-[1.75rem]">
            “{leadText(post)}”
          </blockquote>
        ) : null}

        {/* Author + facts line */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--tk-muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <UserRound className="h-4 w-4" />
            </span>
            <span>Filed by <span className="font-medium text-[var(--tk-text)]">{uploadedBy}</span></span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-[var(--tk-accent)]" /> {pages} pages · {fileSize}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-[var(--tk-accent)]" /> {category}
          </span>
        </div>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {fileUrl ? (
            <a href={fileUrl} download className={dc.button.primary}>
              Download the file <Download className="h-4 w-4" />
            </a>
          ) : null}
          {fileUrl ? (
            <a href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
              Open in new tab <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        {/* Quick-facts strip */}
        <div className="mt-10 grid gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:grid-cols-2 lg:grid-cols-2">
          <QuickFact icon={FileText} label="Format" value="Brief" />
    
          <QuickFact icon={CheckCircle2} label="Version" value={`v${version} · ${language}`} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            {/* Large embedded PDF preview — the visual centerpiece */}
            {fileUrl ? (
              <div className="overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
                  <span className="text-sm font-medium">{filename}</span>
                  <a href={fileUrl} download className="inline-flex items-center gap-2 rounded-[0.5rem] bg-[var(--slot4-dark-bg)] px-4 py-2 text-xs font-medium text-[var(--slot4-accent-fill)] transition hover:opacity-90">
                    Download <Download className="h-3.5 w-3.5" />
                  </a>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[82vh] w-full bg-[var(--tk-raised)]" />
              </div>
            ) : (
              <div className="flex h-[60vh] items-center justify-center rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <p className="text-sm text-[var(--tk-muted)]">A preview will appear here when the file is ready.</p>
              </div>
            )}

            <div className="mt-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <h2 className="editable-display text-[2rem] leading-[1.1] sm:text-[2.5rem]">
                  About this <span className="editable-italic italic">brief</span>.
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--tk-muted)]">A short introduction to the sections and audience of this reference file, and where it sits on the {theme.kicker.toLowerCase()} shelf.</p>
              </div>
              <div>
                <BodyContent post={post} />
                <TagChips post={post} />
              </div>
            </div>

            {/* Repeated CTA callout */}
            <div className="mt-14 overflow-hidden rounded-[var(--tk-radius)] bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-dark-text)] sm:p-10">
              <div className="grid items-center gap-6 sm:grid-cols-[1.4fr_0.6fr]">
                <div>
                  <p className="editable-label text-[0.72rem] uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Take it with you</p>
                  <h3 className="editable-display mt-3 text-[1.75rem] leading-[1.15] sm:text-[2.25rem]">
                    Keep a copy on the bench or the plane.
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/70">Free to download, safe to share. No email wall, no watermark.</p>
                </div>
                {fileUrl ? (
                  <a href={fileUrl} download className={`${dc.button.accent} justify-self-end`}>
                    Download the file <Download className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Bottom ad — inside article column, before related strip */}
            <div className="mt-10 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Document identity */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <div className="flex items-start gap-4">
                <FileText className="h-14 w-14 text-[var(--tk-accent)]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--tk-text)]">{filename}</p>
                  <p className="mt-1 text-xs text-[var(--tk-muted)]">v{version} · {language}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-2.5 text-sm">
                <MetaRow label="Category" value={category} />
                
                <MetaRow label="Filed by" value={String(uploadedBy)} />
                <MetaRow label="Version" value={`v${version}`} />
                <MetaRow label="Language" value={language} />
              </dl>
              {fileUrl ? (
                <a href={fileUrl} download className={`${dc.button.primary} mt-6 w-full`}>
                  Download <Download className="h-4 w-4" />
                </a>
              ) : null}
              {fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noreferrer" className={`${dc.button.secondary} mt-2 w-full`}>
                  Open in new tab <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            {/* What's inside */}
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-accent)]">What’s inside</p>
              <ul className="mt-5 space-y-3 text-sm">
                {(outlineItems.length ? outlineItems : ['Overview and audience', 'Key definitions', 'Method notes', 'Findings and figures', 'Further reading']).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[var(--tk-text)]">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--tk-accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Related documents — glyph tiles, no photography */}
      {related.length ? (
        <section className="border-t border-[var(--tk-line)] bg-[var(--tk-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="editable-display text-[1.75rem] leading-[1.15] sm:text-[2.25rem]">More on the shelf</h2>
              <Link href={getTaskConfig('pdf')?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">
                Open the library <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => {
                const relFileSize = getField(item, ['fileSize', 'size']) || 'File'
                const relPages = getField(item, ['pages', 'pageCount']) || ''
                const href = `${getTaskConfig('pdf')?.route || '/pdf'}/${item.slug}`
                return (
                  <Link key={item.id || item.slug} href={href} className="group flex h-full flex-col justify-between rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(82,0,128,0.08)]">
                    <div>
                      <FileText className="h-12 w-12 text-[var(--tk-accent)]" />
                      <h3 className="editable-display mt-5 line-clamp-3 text-[1.2rem] leading-[1.2]">{item.title}</h3>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-xs text-[var(--tk-muted)]">
                      <span className="inline-flex items-center gap-1.5"><Download className="h-3.5 w-3.5" /> {relFileSize}</span>
                      {relPages ? <span className="inline-flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> {relPages} pages</span> : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-[var(--tk-line)] pb-2.5 last:border-none last:pb-0">
      <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right text-sm font-medium text-[var(--tk-text)]">{value}</dd>
    </div>
  )
}

/** Best-effort outline extraction from body H2/H3 headings. */
function extractOutline(body: string) {
  if (!body) return [] as string[]
  const matches = body.match(/<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/gi) || []
  const cleaned = matches.map((m) => stripHtml(m)).filter(Boolean)
  if (cleaned.length) return cleaned
  return stripHtml(body).split(/[.•]\s+/).map((s) => s.trim()).filter((s) => s.length > 12 && s.length < 90)
}

/* ============================ Profile ============================ */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <BackLink task="profile" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center shadow-[0_22px_60px_rgba(82,0,128,0.08)]">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-[1.75rem] leading-[1.15]">{post.title}</h1>
              {role ? <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {website ? <Link href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>Website <ExternalLink className="h-4 w-4" /></Link> : null}
                {email ? <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a> : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Profile</Kicker>
            <h2 className="editable-display mt-4 text-[2rem] leading-[1.15] sm:text-[2.5rem]">About this person.</h2>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Portfolio" />
            <TagChips post={post} />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ============================ Shared blocks ============================ */
function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[var(--tk-radius)] border border-[var(--tk-line)] object-cover" />
        ))}
      </div>
    </section>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[0.75rem] border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const theme = getTaskTheme(task)
  const taskConfig = getTaskConfig(task)
  const relatedLabel = task === 'listing' ? 'More in the directory' : `More ${theme.kicker.toLowerCase()}`
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="editable-display text-[1.75rem] leading-[1.15] sm:text-[2.25rem]">{relatedLabel}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--tk-accent)]">
            See all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  return (
    <Link href={href} className="group block overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(82,0,128,0.08)]">
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
      </div>
      <div className="p-5">
        <h3 className="editable-display line-clamp-2 text-[1.15rem] leading-[1.2]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
