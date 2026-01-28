import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';

const ROLE_MAP = {
    'ADMIN': 'Quản trị viên',
    'LECTURER': 'Giảng viên'
};

export default function Header() {
    const { user, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium text-gray-600">
                    Chào mừng, {user?.fullName || user?.username}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    {ROLE_MAP[user?.role] || user?.role}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    Đăng xuất
                </Button>
            </div>
        </header>
    );
}
