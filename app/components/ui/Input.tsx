interface InputProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  value?: string
  placeholder?: string
  required?: boolean
  error?: string
  class?: string
  disabled?: boolean
}

export function Input({
  name,
  label,
  type = 'text',
  value,
  placeholder,
  required = false,
  error,
  class: className = '',
  disabled = false,
}: InputProps) {
  const inputId = `input-${name}`
  const errorId = `${inputId}-error`
  const hasError = !!error

  const baseInputStyles = `
    w-full px-4 py-3
    bg-background border border-border rounded-xl
    text-text-main placeholder-secondary-light
    transition-all duration-250
    focus:outline-none focus:bg-white focus:border-accent focus:shadow-input-focus
  `.trim().replace(/\s+/g, ' ')

  const errorStyles = hasError
    ? 'border-accent-dark focus:border-accent-dark'
    : 'hover:border-secondary'

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed bg-border-light'
    : ''

  return (
    <div class={`mb-5 ${className}`}>
      <label
        for={inputId}
        class="block text-sm font-medium text-primary mb-2 tracking-wide"
      >
        {label}
        {required && <span class="text-accent-dark ml-1">*</span>}
      </label>
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        class={`${baseInputStyles} ${errorStyles} ${disabledStyles}`}
      />
      {error && (
        <p id={errorId} class="mt-2 text-sm text-accent-dark flex items-center" role="alert">
          <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true"></i>
          {error}
        </p>
      )}
    </div>
  )
}
