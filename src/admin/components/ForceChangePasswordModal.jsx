import { useState } from 'react';
import { adminAuthService } from '../services/adminAuthService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ForceChangePasswordModal({ isOpen, onClose, onSuccess }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);
        try {
            await adminAuthService.forceChangePassword(newPassword);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md shadow-lg max-w-md w-full mx-4">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Đổi Mật Khẩu Lần Đầu
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Bạn cần đổi mật khẩu trước khi sử dụng hệ thống
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                    <Input
                        label="Mật khẩu mới"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                        required
                        autoFocus
                    />

                    <Input
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        error={error}
                        required
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
                        </Button>
                    </div>
                </form>

                {/* Info */}
                <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
                    <p className="text-xs text-amber-800">
                        ⚠️ Bạn không thể đóng cửa sổ này cho đến khi đổi mật khẩu thành công.
                    </p>
                </div>
            </div>
        </div>
    );
}
