import Link from 'next/link'
import { ArrowUpRight, BookOpen, Compass, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const VALUE_ICONS = [MapPin, BookOpen, Compass]

export default function AboutPage() {
  const about = pagesContent.about
  return (
    <EditableSiteShell>
      <main className="editable-enter">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <EditableReveal>
            <p className={dc.badge.pill}>{about.badge}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[3rem] leading-[1.02] sm:text-[4rem] lg:text-[5rem]">
              About <span className="editable-italic italic">{SITE_CONFIG.name}</span>.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-[1.75] text-[var(--slot4-muted-text)] sm:text-[1.15rem]">{about.description}</p>
          </EditableReveal>

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <EditableReveal index={3}>
              <div className="space-y-5 text-[1.02rem] leading-[1.75] text-[var(--slot4-muted-text)]">
                {about.paragraphs.map((p) => <p key={p}>{p}</p>)}
                <div className="pt-6">
                  <Link href="/listings" className={dc.button.primary}>Open the directory <ArrowUpRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </EditableReveal>

            <div className="space-y-5">
              {about.values.map((value, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length]
                return (
                  <EditableReveal key={value.title} index={i}>
                    <div className="rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-7">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-primary)] text-[var(--slot4-on-primary)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h2 className="editable-display mt-5 text-[1.5rem] leading-[1.2]">{value.title}</h2>
                      <p className="mt-3 text-[0.98rem] leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                    </div>
                  </EditableReveal>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
