import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = (getPostTaskKey(post) as TaskKey | null) || 'article'
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const kicker = getTaskTheme(task).kicker

  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(82,0,128,0.10)]">
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${index % 5 === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-dark-bg)]/90 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{kicker}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {!image ? <span className="w-fit rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--slot4-accent-fill)]">{kicker}</span> : null}
        <h2 className="editable-display mt-4 line-clamp-3 text-[1.5rem] leading-[1.2]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{stripHtml(summary)}</p> : null}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-page-text)] underline decoration-[3px] decoration-[var(--slot4-accent-fill)] underline-offset-[6px]">
          Open result <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="editable-enter">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <EditableReveal>
            <p className={dc.badge.pill}>{pagesContent.search.hero.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.75rem]">
              Find a <span className="editable-italic italic">place</span>, a person or a paper.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-7 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className="mt-10 rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5 sm:p-6">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-[0.75rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-[0.75rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <select name="task" defaultValue={task} className="rounded-[0.75rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm font-medium outline-none">
                  <option value="">Everything</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>{getTaskTheme(item.key).kicker}</option>
                  ))}
                </select>
                <button type="submit" className={dc.button.primary}>Search</button>
              </div>
            </form>
          </EditableReveal>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{results.length} results</p>
              <h2 className="editable-display mt-2 text-[2rem] leading-[1.1] sm:text-[2.5rem]">
                {query ? <>Results for <span className="editable-italic italic">“{query}”</span></> : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/" className={dc.button.ghost}>Back home <ArrowUpRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index % 6}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[1.25rem] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center">
              <p className="editable-display text-[1.75rem] leading-[1.15]">Nothing on the shelves matches that.</p>
              <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">Try a different keyword, category, or entry type.</p>
            </div>
          )}

          <div className="mt-16 rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-5">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
