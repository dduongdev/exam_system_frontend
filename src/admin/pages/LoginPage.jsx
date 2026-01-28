import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function AdminLoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAdminAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(identifier, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="border-b border-gray-200 px-8 py-6">
                        <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">
                            Quản Trị Hệ Thống
                        </h1>
                        <p className="text-sm text-gray-600 text-center">
                            Exam System Administration
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Tên đăng nhập / Email / SĐT"
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Nhập tên đăng nhập, email hoặc số điện thoại"
                                required
                                autoFocus
                            />

                            <Input
                                label="Mật khẩu"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                error={error}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs text-gray-600 text-center">
                            Chỉ dành cho quản trị viên hệ thống
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
