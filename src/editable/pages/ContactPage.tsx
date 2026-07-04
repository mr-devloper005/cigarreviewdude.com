'use client'

import { BookOpen, FileText, Mail, MapPin, MessageSquare } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const LANES = [
  { icon: MapPin, title: 'Add a directory entry', body: 'Send us the shop, studio or service and we’ll take it from there — hours, address, contact and a checked note.' },
  { icon: FileText, title: 'Share a library file', body: 'Have a report, guide or brief that belongs on the shelf? Upload the file and a short intro.' },
  { icon: BookOpen, title: 'Pitch a field note', body: 'A short piece of writing about the neighbourhood, a place or a paper — we read every pitch.' },
  { icon: MessageSquare, title: 'Something isn’t quite right', body: 'Broken link, out-of-date detail, wrong photo — tell us and we’ll fix it the same week.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="editable-enter">
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-6 sm:py-24 lg:px-8">
          <EditableReveal>
            <p className={dc.badge.pill}>{pagesContent.contact.eyebrow}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className="editable-display mt-6 max-w-3xl text-balance text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.75rem]">
              A short note to the <span className="editable-italic italic">desk</span>.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className="mt-6 max-w-2xl text-[1.05rem] leading-[1.7] text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
          </EditableReveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="space-y-5">
              {LANES.map((lane, i) => (
                <EditableReveal key={lane.title} index={i}>
                  <div className="rounded-[1.25rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)]">
                      <lane.icon className="h-4 w-4" />
                    </span>
                    <h2 className="editable-display mt-5 text-[1.35rem] leading-[1.2]">{lane.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>

            <EditableReveal index={2}>
              <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-9">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[var(--slot4-primary)]" />
                  <span className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[var(--slot4-primary)]">The desk</span>
                </div>
                <h2 className="editable-display mt-4 text-[1.75rem] leading-[1.15]">{pagesContent.contact.formTitle}</h2>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
