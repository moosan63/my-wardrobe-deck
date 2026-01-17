import type { Child } from 'hono/jsx'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost'
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
  primary: 'bg-primary text-white hover:bg-opacity-90',
  secondary: 'bg-secondary text-white hover:bg-opacity-90',
  accent: 'bg-accent text-white hover:bg-opacity-90',
  ghost: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
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
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none'
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
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
