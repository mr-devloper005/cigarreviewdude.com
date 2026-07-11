'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { getTaskTheme } from '@/editable/theme/task-themes'

/*
  Footer:
  - Dark near-black surface (matches hirekit-temlis CTA slab tone)
  - Left column: brand + description + socials
  - Discovery column with renamed task labels (kicker copy)
  - Account column
  - Big serif brand mark under a horizontal rule
*/
export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const brand = SITE_CONFIG.name
  const description =
    globalContent.footer?.description ||
    `${brand} is a discovery platform pairing a local business directory with a downloadable reference library.`

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Signup slab */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-5 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Stay close</p>
            <h2 className="editable-display mt-3 max-w-xl text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              A weekly letter on what’s <span className="editable-italic italic">new in the neighbourhood</span> and worth downloading.
            </h2>
          </div>
          <form action="/contact" className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5">
            <input
              name="email"
              type="email"
              placeholder="you@studio.example"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-white/40"
            />
            <button type="submit" className="rounded-full bg-[var(--slot4-accent-fill)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-on-accent)] transition hover:brightness-95">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[0.6rem] bg-white/10">
              <img src="/favicon.png?v=20260703" alt={brand} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-2xl leading-none">{brand}</span>
          </Link>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">{description}</p>
        </div>

        <div>
          <h3 className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Discover</h3>
          <ul className="mt-5 space-y-3">
            {taskLinks.map((task) => {
              const theme = getTaskTheme(task.key)
              return (
                <li key={task.key}>
                  <Link href={task.route} className="group inline-flex items-center gap-1.5 text-sm text-white/75 transition hover:text-white">
                    {theme.kicker}
                    <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h3 className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Site</h3>
          <ul className="mt-5 space-y-3">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ['Search', '/search'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-sm text-white/75 transition hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="editable-label text-[0.72rem] uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">Account</h3>
          <ul className="mt-5 space-y-3">
            {session ? (
              <>
                <li><Link href="/create" className="text-sm text-white/75 transition hover:text-white">Submit content</Link></li>
                <li>
                  <button type="button" onClick={logout} className="text-left text-sm text-white/75 transition hover:text-white">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link href="/login" className="text-sm text-white/75 transition hover:text-white">Sign in</Link></li>
                <li><Link href="/signup" className="text-sm text-white/75 transition hover:text-white">Get started</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 pb-12 pt-10 sm:px-6 lg:px-8">
          <p className="editable-display text-[clamp(3.5rem,14vw,10rem)] leading-[0.9] tracking-[-0.02em] text-white/95">{brand}</p>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
            <span>© {year} {brand}. All rights reserved.</span>
            <span>Made for discovery, built to browse.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
