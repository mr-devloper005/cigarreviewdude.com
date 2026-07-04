'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { getTaskTheme } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'rounded-[0.75rem] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-primary)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeKicker = getTaskTheme(task).kicker

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle(''); setCategory(''); setSummary(''); setUrl(''); setImage(''); setBody('')
  }

  if (!session) {
    const locked = pagesContent.create.locked
    return (
      <EditableSiteShell>
        <main className="editable-enter">
          <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <EditableReveal>
              <div className="flex h-full min-h-72 items-center justify-center rounded-[1.5rem] bg-[var(--slot4-dark-bg)] text-[var(--slot4-accent-fill)]">
                <Lock className="h-20 w-20" />
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <p className={dc.badge.pill}>{locked.badge}</p>
              <h1 className="editable-display mt-6 max-w-xl text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.5rem]">
                Sign in <span className="editable-italic italic">to open the desk</span>.
              </h1>
              <p className="mt-6 max-w-xl text-[1.02rem] leading-8 text-[var(--slot4-muted-text)]">{locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className={dc.button.primary}>Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                <Link href="/signup" className={dc.button.secondary}>Get started</Link>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  const hero = pagesContent.create.hero
  return (
    <EditableSiteShell>
      <main className="editable-enter">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
          <EditableReveal>
            <p className={dc.badge.pill}>{hero.badge}</p>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.5rem]">
              File a submission <span className="editable-italic italic">to the desk</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-7 text-[var(--slot4-muted-text)]">{hero.description}</p>
          </EditableReveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <EditableReveal index={1}>
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-primary)]">Pick a shelf</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const theme = getTaskTheme(item.key)
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-[1rem] border p-5 text-left transition ${
                        active
                          ? 'border-transparent bg-[var(--slot4-dark-bg)] text-[var(--slot4-accent-fill)]'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:-translate-y-0.5'
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                      <span className="editable-display mt-3 block text-[1.15rem] leading-[1.2]">{theme.kicker}</span>
                      <span className={`mt-2 block text-xs leading-6 ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>{theme.note}</span>
                    </button>
                  )
                })}
              </div>
            </EditableReveal>

            <EditableReveal index={2}>
              <form onSubmit={submit} className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-primary)]">Filing to {activeKicker}</p>
                    <h2 className="editable-display mt-2 text-[1.75rem] leading-[1.15]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="rounded-full bg-[var(--slot4-warm)] px-4 py-2 text-xs font-medium">{session.name}</span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Entry title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or file URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Cover image URL" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short intro" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Full details, notes or description" required />
                </div>

                {created ? (
                  <div className="mt-5 flex items-start gap-3 rounded-[1rem] border border-[var(--slot4-accent-soft)] bg-[var(--slot4-accent-soft)]/60 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--slot4-primary)]" />
                    <div>
                      <p className="text-sm font-medium">{pagesContent.create.successTitle}</p>
                      <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                    </div>
                  </div>
                ) : null}

                <button type="submit" className={`${dc.button.primary} mt-6 w-full`}>
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
