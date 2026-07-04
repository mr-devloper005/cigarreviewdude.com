'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogIn, Menu, PlusCircle, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Navbar spec:
  - No task-page redirects (nothing that links to a task archive route).
  - Left: brand mark. Center/left: About + Contact only.
  - Right: search-icon → /search, then auth actions.
  - Mobile mirrors the same links.
*/

const STATIC_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const brand = SITE_CONFIG.name

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)]/95 text-[var(--editable-nav-text)] backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-6 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[0.6rem] bg-[var(--slot4-dark-bg)]">
            <img src="/favicon.png?v=20260703" alt={brand} className="h-10 w-10 object-contain" />
          </span>
          <span className="editable-display block max-w-[220px] truncate text-2xl font-normal leading-none tracking-[-0.005em]">{brand}</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {STATIC_LINKS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-[var(--slot4-primary)] text-[var(--slot4-on-primary)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-dark-bg)]"
          >
            <Search className="h-4 w-4" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-[0.75rem] bg-[var(--slot4-dark-bg)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-accent-fill)] transition hover:-translate-y-[1px] hover:bg-[var(--slot4-primary)] sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-warm)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-[0.75rem] bg-[var(--slot4-dark-bg)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-accent-fill)] transition hover:-translate-y-[1px] hover:bg-[var(--slot4-primary)] sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-5 py-5 lg:hidden">
          <div className="grid gap-1">
            {STATIC_LINKS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[0.75rem] px-4 py-3 text-sm font-medium ${
                    active
                      ? 'bg-[var(--slot4-primary)] text-[var(--slot4-on-primary)]'
                      : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-[0.75rem] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]"
            >
              Search
            </Link>
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="rounded-[0.75rem] bg-[var(--slot4-dark-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-accent-fill)]"
                >
                  Submit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="rounded-[0.75rem] px-4 py-3 text-left text-sm font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-[0.75rem] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-warm)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-[0.75rem] bg-[var(--slot4-dark-bg)] px-4 py-3 text-sm font-medium text-[var(--slot4-accent-fill)]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
