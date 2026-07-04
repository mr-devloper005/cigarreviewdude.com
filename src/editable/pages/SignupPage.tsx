import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="editable-enter">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
          <EditableReveal>
            <div className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-9">
              <h1 className="editable-display text-[1.75rem] leading-[1.15]">{copy.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[var(--slot4-primary)] underline decoration-[3px] decoration-[var(--slot4-accent-fill)] underline-offset-[6px]">{copy.loginCta}</Link>
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className={dc.badge.pill}>{copy.badge}</p>
            <h2 className="editable-display mt-6 max-w-xl text-[2.75rem] leading-[1.02] sm:text-[3.75rem] lg:text-[4.5rem]">
              Make an account, <span className="editable-italic italic">take a seat</span>.
            </h2>
            <p className="mt-6 max-w-lg text-[1.02rem] leading-8 text-[var(--slot4-muted-text)]">{copy.description}</p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
