'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  index?: number
  as?: 'div' | 'section' | 'article' | 'li' | 'span'
  className?: string
  style?: CSSProperties
  /** Extra delay on top of the staggered index delay (ms). */
  delay?: number
  /** Delay per index (ms). */
  step?: number
}

/**
 * Scroll-driven fade + slide-up reveal. Hidden state is only applied after
 * mount, so JS-off (or first paint) always shows content immediately.
 * Staggered by `index` so grid items cascade in gently.
 */
export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className,
  style,
  delay = 0,
  step = 70,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Tag = as as 'div'
  const cls = [
    'editable-reveal',
    mounted && !visible ? 'is-hidden' : '',
    visible ? 'is-visible' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')

  const transitionDelay = mounted ? `${delay + index * step}ms` : undefined
  return (
    <Tag ref={ref as never} className={cls} style={{ transitionDelay, ...style }}>
      {children}
    </Tag>
  )
}

export default EditableReveal
