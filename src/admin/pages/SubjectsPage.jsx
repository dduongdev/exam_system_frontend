import { useState, useEffect } from 'react';
import { subjectService } from '../services/subjectService';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', description: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        loadSubjects();
    }, []);

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const data = await subjectService.getAll();
            setSubjects(data);
        } catch (error) {
            console.error('Error loading subjects:', error);
            setError('Không thể tải danh sách môn học');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingSubject(null);
        setFormData({ name: '', code: '', description: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setFormData({
            name: subject.name,
            code: subject.code || '',
            description: subject.description || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (subject) => {
        if (!confirm(`Bạn có chắc muốn xóa môn học "${subject.name}"?`)) return;

        try {
            await subjectService.delete(subject.id);
            await loadSubjects();
        } catch (error) {
            alert('Không thể xóa môn học: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingSubject) {
                await subjectService.update(editingSubject.id, formData);
            } else {
                await subjectService.create(formData);
            }
            setIsModalOpen(false);
            await loadSubjects();
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        { header: 'Tên môn học', accessor: 'name' },
        { header: 'Mã môn', accessor: 'code' },
        { header: 'Mô tả', accessor: 'description', render: (row) => row.description || '-' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý môn học</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Tạo và quản lý các môn học trong hệ thống
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    + Tạo môn học
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={subjects}
                        actions={(row) => (
                            <>
                                <button
                                    onClick={() => handleEdit(row)}
                                    className="text-primary-800 hover:text-primary-900 font-medium"
                                >
                                    Sửa
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
                onClose={() => setIsModalOpen(false)}
                title={editingSubject ? 'Sửa môn học' : 'Tạo môn học mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên môn học"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Tin học"
                        required
                    />

                    <Input
                        label="Mã môn"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="Ví dụ: INFO"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả ngắn về môn học"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                        />
                    </div>

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
                            {editingSubject ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
