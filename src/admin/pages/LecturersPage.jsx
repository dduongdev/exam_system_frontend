import { useState, useEffect } from 'react';
import { lecturerService } from '../services/lecturerService';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function LecturersPage() {
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLecturer, setEditingLecturer] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadLecturers();
    }, []);

    const loadLecturers = async () => {
        try {
            setLoading(true);
            const data = await lecturerService.getAll();
            setLecturers(data);
        } catch (error) {
            console.error('Error loading lecturers:', error);
            setError('Không thể tải danh sách Giảng viên');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingLecturer(null);
        setFormData({ fullName: '', email: '', phone: '' });
        setError('');
        setSuccessMessage('');
        setIsModalOpen(true);
    };

    const handleEdit = (lecturer) => {
        setEditingLecturer(lecturer);
        setFormData({
            fullName: lecturer.fullName,
            email: lecturer.email,
            phone: lecturer.phone || ''
        });
        setError('');
        setSuccessMessage('');
        setIsModalOpen(true);
    };

    const handleDelete = async (lecturer) => {
        if (!confirm(`Bạn có chắc muốn xóa tài khoản Giảng viên "${lecturer.fullName}"?`)) return;

        try {
            await lecturerService.delete(lecturer.id);
            await loadLecturers();
            alert('Xóa Giảng viên thành công');
        } catch (error) {
            alert('Không thể xóa Giảng viên: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleResetPassword = async (lecturer) => {
        if (!confirm(`Reset mật khẩu cho "${lecturer.fullName}" về 123456789?`)) return;

        try {
            const result = await lecturerService.resetPassword(lecturer.id);
            alert(`${result.message}\nMật khẩu mặc định: ${result.defaultPassword}`);
        } catch (error) {
            alert('Không thể reset mật khẩu: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            if (editingLecturer) {
                await lecturerService.update(editingLecturer.id, formData);
                setIsModalOpen(false);
                await loadLecturers();
                alert('Cập nhật Giảng viên thành công');
            } else {
                const result = await lecturerService.create(formData);
                setSuccessMessage(`Tạo thành công!\nMật khẩu mặc định: ${result.defaultPassword}\n\nEmail: ${formData.email}\nPassword: ${result.defaultPassword}\n\nVui lòng thông báo cho Giảng viên.`);
                await loadLecturers();
                // Don't close modal to show password
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        { header: 'Họ tên', accessor: 'fullName' },
        { header: 'Email', accessor: 'email' },
        { header: 'Số điện thoại', accessor: 'phone', render: (row) => row.phone || '-' },
        {
            header: 'Ngày tạo',
            accessor: 'createdAt',
            render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN')
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý Giảng viên</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Tạo và quản lý tài khoản Giảng viên trong hệ thống
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    + Thêm Giảng viên
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={lecturers}
                        actions={(row) => (
                            <>
                                <button
                                    onClick={() => handleEdit(row)}
                                    className="text-primary-800 hover:text-primary-900 font-medium"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleResetPassword(row)}
                                    className="text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    Reset MK
                                </button>
                                <button
                                    onClick={() => handleDelete(row)}
                                    className="text-red-600 hover:text-red-700 font-medium"
                                >
                                    Xóa
                                </button>
                            </>
                        )}
                    />
                )}
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSuccessMessage('');
                }}
                title={editingLecturer ? 'Sửa thông tin Giảng viên' : 'Tạo tài khoản Giảng viên'}
            >
                {successMessage ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium text-green-800">Tạo tài khoản thành công!</h3>
                                    <div className="mt-2 text-sm text-green-700 whitespace-pre-line">
                                        {successMessage}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => {
                                setIsModalOpen(false);
                                setSuccessMessage('');
                                setFormData({ fullName: '', email: '', phone: '' });
                            }}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Họ và tên"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Ví dụ: Nguyễn Văn A"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="lecturer@example.com"
                            required
                        />

                        <Input
                            label="Số điện thoại (tùy chọn)"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0123456789"
                        />

                        {!editingLecturer && (
                            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                                <p className="text-sm text-amber-800">
                                    ⚠️ Mật khẩu mặc định là: <strong>123456789</strong>
                                    <br />
                                    Giảng viên sẽ phải đổi mật khẩu sau lần đăng nhập đầu tiên.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">
                                {editingLecturer ? 'Cập nhật' : 'Tạo tài khoản'}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
