import type { Child } from 'hono/jsx'

interface CardProps {
  children: Child
  class?: string
  href?: string
  padding?: boolean
}

export function Card({ children, class: className = '', href, padding = false }: CardProps) {
  const baseStyles = `
    bg-card-bg rounded-2xl
    shadow-card border border-border-light
    overflow-hidden
    transition-all duration-250
  `.trim().replace(/\s+/g, ' ')

  const hoverStyles = href
    ? 'hover:shadow-card-hover hover:-translate-y-1 hover:border-border'
    : ''

  const paddingStyles = padding ? 'p-5' : ''

  const combinedStyles = `${baseStyles} ${hoverStyles} ${paddingStyles} ${className}`

  if (href) {
    return (
      <a href={href} class={`block ${combinedStyles}`}>
        {children}
      </a>
    )
  }

  return <div class={combinedStyles}>{children}</div>
}
