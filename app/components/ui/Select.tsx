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

  const baseSelectStyles = 'w-full px-3 py-2 border rounded-lg bg-white text-text-main transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent appearance-none cursor-pointer'
  const errorStyles = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-200 hover:border-secondary'
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''

  return (
    <div class={`mb-4 ${className}`}>
      <label
        for={selectId}
        class="block text-sm font-medium text-primary mb-1"
      >
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
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
        >
          {placeholder && (
            <option value="" disabled selected={!value}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              selected={value === option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <i class="fa-solid fa-chevron-down text-secondary text-sm" aria-hidden="true"></i>
        </div>
      </div>
      {error && (
        <p id={errorId} class="mt-1 text-sm text-red-500" role="alert">
          <i class="fa-solid fa-exclamation-circle mr-1" aria-hidden="true"></i>
          {error}
        </p>
      )}
    </div>
  )
}
