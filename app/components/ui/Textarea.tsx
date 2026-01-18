interface TextareaProps {
  name: string
  label: string
  value?: string
  placeholder?: string
  required?: boolean
  error?: string
  class?: string
  disabled?: boolean
  rows?: number
}

export function Textarea({
  name,
  label,
  value,
  placeholder,
  required = false,
  error,
  class: className = '',
  disabled = false,
  rows = 4,
}: TextareaProps) {
  const textareaId = `textarea-${name}`
  const errorId = `${textareaId}-error`
  const hasError = !!error

  const baseTextareaStyles = `
    w-full px-4 py-3
    bg-background border border-border rounded-xl
    text-text-main placeholder-secondary-light
    transition-all duration-250
    focus:outline-none focus:bg-white focus:border-accent focus:shadow-input-focus
    resize-y min-h-[100px]
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
        for={textareaId}
        class="block text-sm font-medium text-primary mb-2 tracking-wide"
      >
        {label}
        {required && <span class="text-accent-dark ml-1">*</span>}
      </label>
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        class={`${baseTextareaStyles} ${errorStyles} ${disabledStyles}`}
      >{value}</textarea>
      {error && (
        <p id={errorId} class="mt-2 text-sm text-accent-dark flex items-center" role="alert">
          <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true"></i>
          {error}
        </p>
      )}
    </div>
  )
}
