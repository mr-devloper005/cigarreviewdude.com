import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="editable-enter">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <EditableReveal>
            <p className={dc.badge.pill}>{copy.badge}</p>
            <h1 className="editable-display mt-6 max-w-xl text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.5rem]">
              Welcome back <span className="editable-italic italic">to the room</span>.
            </h1>
            <p className="mt-6 max-w-lg text-[1.02rem] leading-8 text-[var(--slot4-muted-text)]">{copy.description}</p>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-9">
              <h2 className="editable-display text-[1.75rem] leading-[1.15]">{copy.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                New around here?{' '}
                <Link href="/signup" className="font-medium text-[var(--slot4-primary)] underline decoration-[3px] decoration-[var(--slot4-accent-fill)] underline-offset-[6px]">{copy.createCta}</Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
