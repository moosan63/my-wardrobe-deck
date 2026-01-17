import type { Child } from 'hono/jsx'

interface CardProps {
  children: Child
  class?: string
  href?: string
}

export function Card({ children, class: className = '', href }: CardProps) {
  const baseStyles = 'bg-card-bg rounded-lg shadow-sm overflow-hidden transition-all duration-200'
  const hoverStyles = href ? 'hover:shadow-md hover:-translate-y-0.5' : ''
  const combinedStyles = `${baseStyles} ${hoverStyles} ${className}`

  if (href) {
    return (
      <a href={href} class={`block ${combinedStyles}`}>
        {children}
      </a>
    )
  }

  return <div class={combinedStyles}>{children}</div>
}
