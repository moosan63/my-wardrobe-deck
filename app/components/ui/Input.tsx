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

  const baseInputStyles = 'w-full px-3 py-2 border rounded-lg bg-white text-text-main placeholder-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent'
  const errorStyles = hasError
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-200 hover:border-secondary'
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''

  return (
    <div class={`mb-4 ${className}`}>
      <label
        for={inputId}
        class="block text-sm font-medium text-primary mb-1"
      >
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
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
        <p id={errorId} class="mt-1 text-sm text-red-500" role="alert">
          <i class="fa-solid fa-exclamation-circle mr-1" aria-hidden="true"></i>
          {error}
        </p>
      )}
    </div>
  )
}
