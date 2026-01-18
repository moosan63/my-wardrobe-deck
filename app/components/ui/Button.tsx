import type { Child } from 'hono/jsx'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: Child
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  type?: 'button' | 'submit' | 'reset'
  class?: string
  disabled?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-sm hover:shadow-md',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark shadow-sm hover:shadow-md',
  accent: 'bg-accent text-primary-dark hover:bg-accent-dark hover:text-white active:bg-accent-dark shadow-sm hover:shadow-md',
  ghost: 'bg-transparent text-primary border border-border hover:border-primary hover:bg-primary/5 active:bg-primary/10',
  danger: 'bg-transparent text-accent-dark border border-accent-dark hover:bg-accent-dark hover:text-white active:bg-accent-dark',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  class: className = '',
  disabled = false,
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium tracking-wide rounded-xl
    transition-all duration-250
    focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
  `.trim().replace(/\s+/g, ' ')

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer'

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`

  if (href && !disabled) {
    return (
      <a href={href} class={combinedStyles}>
        {children}
      </a>
    )
  }

  if (href && disabled) {
    return (
      <span class={combinedStyles} aria-disabled="true">
        {children}
      </span>
    )
  }

  return (
    <button type={type} class={combinedStyles} disabled={disabled}>
      {children}
    </button>
  )
}
