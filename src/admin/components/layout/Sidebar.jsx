import { NavLink } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function Sidebar() {
    const { user } = useAdminAuth();

    const menuItems = [
        { path: '/admin/dashboard', label: 'Tổng quan', icon: '📊' },
        { path: '/admin/subjects', label: 'Môn học', icon: '📚' },
        { path: '/admin/question-pools', label: 'Gói câu hỏi', icon: '📦' },
        { path: '/admin/questions', label: 'Câu hỏi', icon: '❓' },
        { path: '/admin/exam-matrices', label: 'Ma trận đề', icon: '📋' },
        { path: '/admin/exam-sessions', label: 'Ca thi', icon: '🕐' },
        { path: '/admin/reports', label: 'Báo cáo', icon: '📈' },
        { path: '/admin/lecturers', label: 'Quản lý Giảng viên', icon: '👨‍🏫', roles: ['ADMIN'] },
        { path: '/admin/profile', label: 'Tài khoản', icon: '👤' },
    ];

    const filteredItems = menuItems.filter(item =>
        !item.roles || item.roles.includes(user?.role)
    );

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <h1 className="text-lg font-semibold text-primary-800">
                    Quản trị kỳ thi
                </h1>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${isActive
                                ? 'bg-primary-50 text-primary-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
