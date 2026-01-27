// Layout component for consistent page structure

export default function Layout({ children, className = '' }) {
    return (
        <div className={`min-h-screen bg-gray-50 ${className}`}>
            {children}
        </div>
    );
}
