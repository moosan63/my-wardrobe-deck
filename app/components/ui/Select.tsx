interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  name: string
  label: string
  options: SelectOption[]
  value?: string
  placeholder?: string
  required?: boolean
  error?: string
  class?: string
  disabled?: boolean
}

export function Select({
  name,
  label,
  options,
  value,
  placeholder,
  required = false,
  error,
  class: className = '',
  disabled = false,
}: SelectProps) {
  const selectId = `select-${name}`
  const errorId = `${selectId}-error`
  const hasError = !!error

  const baseSelectStyles = `
    w-full px-4 py-3 pr-10
    bg-background border border-border rounded-xl
    text-text-main
    transition-all duration-250
    focus:outline-none focus:bg-white focus:border-accent focus:shadow-input-focus
    appearance-none cursor-pointer
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
        for={selectId}
        class="block text-sm font-medium text-primary mb-2 tracking-wide"
      >
        {label}
        {required && <span class="text-accent-dark ml-1">*</span>}
      </label>
      <div class="relative">
        <select
          id={selectId}
          name={name}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          class={`${baseSelectStyles} ${errorStyles} ${disabledStyles}`}
          value={value || ''}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <i class="fa-solid fa-chevron-down text-secondary text-sm" aria-hidden="true"></i>
        </div>
      </div>
      {error && (
        <p id={errorId} class="mt-2 text-sm text-accent-dark flex items-center" role="alert">
          <i class="fa-solid fa-exclamation-triangle mr-2" aria-hidden="true"></i>
          {error}
        </p>
      )}
    </div>
  )
}
