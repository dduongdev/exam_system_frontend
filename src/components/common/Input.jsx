// Professional Input component for exam system

export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    className = ''
}) {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    {label}
                    {required && <span className="text-error-600 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`
          w-full px-4 py-2.5 text-base
          border rounded-md
          bg-white
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-primary-800
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300
          ${error ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : 'border-gray-400'}
        `}
            />
            {error && (
                <p className="mt-1.5 text-sm text-error-600">{error}</p>
            )}
        </div>
    );
}
