// Professional Button component for exam system

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    onClick,
    type = 'button',
    className = ''
}) {
    // Base: flat design, clear borders, simple transitions
    const baseClasses = 'font-medium border transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1';

    const variantClasses = {
        primary: 'bg-primary-800 border-primary-800 text-white hover:bg-primary-900 focus:ring-primary-600 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
        secondary: 'bg-white border-gray-400 text-gray-800 hover:bg-gray-50 hover:border-gray-500 focus:ring-gray-400 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
        outline: 'bg-white border-primary-800 text-primary-800 hover:bg-primary-50 focus:ring-primary-600 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
        danger: 'bg-error-600 border-error-600 text-white hover:bg-error-700 focus:ring-error-500 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm rounded',
        md: 'px-4 py-2 text-base rounded-md',
        lg: 'px-6 py-3 text-base rounded-md'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
