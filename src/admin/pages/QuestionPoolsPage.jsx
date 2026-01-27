import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionPoolService } from '../services/questionPoolService';
import { subjectService } from '../services/subjectService';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function QuestionPoolsPage() {
    const navigate = useNavigate();
    const [pools, setPools] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPool, setEditingPool] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', subjectId: '' });
    const [error, setError] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedPool, setSelectedPool] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [importStatus, setImportStatus] = useState('');

    useEffect(() => {
        loadData();
    }, [filterSubject]);

    const handleImportClick = (pool) => {
        setSelectedPool(pool);
        setImportFile(null);
        setImportStatus('');
        setIsImportModalOpen(true);
    };

    const handleImportUpload = async () => {
        if (!importFile) return;
        try {
            setImportStatus('Đang import...');
            const res = await questionPoolService.importQuestions(selectedPool.id, importFile);

            if (res.failed === 0) {
                setImportStatus(`Thành công! Đã thêm ${res.success} câu hỏi.`);
            } else {
                setImportStatus(`Đã xử lý:\n- Thành công: ${res.success}\n- Lỗi: ${res.failed}\n\nChi tiết lỗi:\n${res.errors.join('\n')}`);
            }

            await loadData();
        } catch (err) {
            setImportStatus('Lỗi: ' + (err.response?.data?.message || err.message));
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [poolsData, subjectsData] = await Promise.all([
                questionPoolService.getAll(filterSubject || null),
                subjectService.getAll()
            ]);
            setPools(poolsData);
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPool(null);
        setFormData({ name: '', description: '', subjectId: '' });
        setIsModalOpen(true);
    };

    const handleEdit = (pool) => {
        setEditingPool(pool);
        console.log('Editing pool:', pool); // Debug log
        setFormData({
            name: pool.name,
            description: pool.description || '',
            // Try pool.subjectId first, fallback to pool.subject?.id, or empty string
            subjectId: pool.subjectId || pool.subject?.id || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (pool) => {
        if (!confirm(`Bạn có chắc muốn xóa gói câu hỏi "${pool.name}"?`)) return;

        try {
            await questionPoolService.delete(pool.id);
            await loadData();
        } catch (error) {
            alert('Không thể xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate subjectId for new pools
        if (!editingPool && !formData.subjectId) {
            setError('Vui lòng chọn môn học');
            return;
        }

        // Prepare payload - only include subjectId if it's valid
        const payload = {
            name: formData.name,
            description: formData.description
        };

        // Only include subjectId if it's a non-empty string
        if (formData.subjectId && formData.subjectId.trim() !== '') {
            if (editingPool) {
                // If editing, only send if different from original
                const originalSubjectId = editingPool.subjectId || editingPool.subject?.id;
                if (formData.subjectId !== originalSubjectId) {
                    payload.subjectId = formData.subjectId;
                }
            } else {
                // Creating new, always send
                payload.subjectId = formData.subjectId;
            }
        }

        console.log('Submitting payload:', payload); // Debug log

        try {
            if (editingPool) {
                await questionPoolService.update(editingPool.id, payload);
            } else {
                await questionPoolService.create(payload);
            }
            setIsModalOpen(false);
            await loadData();
        } catch (error) {
            console.error('Submit error:', error.response?.data); // Debug log
            const errorMsg = error.response?.data?.message;
            if (Array.isArray(errorMsg)) {
                setError(errorMsg.join(', '));
            } else {
                setError(errorMsg || 'Có lỗi xảy ra');
            }
        }
    };

    const columns = [
        { header: 'Tên gói câu hỏi', accessor: 'name' },
        {
            header: 'Môn học',
            render: (row) => row.subject?.name || '-'
        },
        { header: 'Mô tả', accessor: 'description', render: (row) => row.description || '-' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý gói câu hỏi</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Tạo và quản lý các gói câu hỏi theo môn học
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    + Tạo gói câu hỏi
                </Button>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Lọc theo môn học:</label>
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                    >
                        <option value="">Tất cả môn học</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={pools}
                        actions={(row) => (
                            <>
                                <button
                                    onClick={() => navigate(`/admin/questions?subjectId=${row.subjectId || row.subject?.id}&poolId=${row.id}`)}
                                    className="text-primary-600 hover:text-primary-800 font-medium mr-3"
                                >
                                    Xem câu hỏi
                                </button>
                                <button
                                    onClick={() => handleImportClick(row)}
                                    className="text-green-600 hover:text-green-800 font-medium mr-3"
                                >
                                    Import
                                </button>
                                <button
                                    onClick={() => handleEdit(row)}
                                    className="text-primary-800 hover:text-primary-900 font-medium mr-3"
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
                title={editingPool ? 'Sửa gói câu hỏi' : 'Tạo gói câu hỏi mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên gói câu hỏi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Gói câu hỏi mức độ Biết"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Môn học <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={formData.subjectId}
                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                        >
                            <option value="">-- Chọn môn học --</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Mô tả ngắn về gói câu hỏi"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">
                            {editingPool ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title={`Import câu hỏi - ${selectedPool?.name}`}
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <p className="text-sm text-blue-800 font-medium mb-2">Quy định file Excel:</p>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>Sheet 1 (MCQ): Cột A-G (Nội dung, Mức độ, A, B, C, D, Đáp án đúng)</li>
                            <li>Sheet 2 (Group): Cột A-J (Nội dung, Mức độ, Ý a, Đ/S, Ý b, Đ/S...)</li>
                            <li>Dòng 1 là header, dữ liệu bắt đầu từ dòng 2.</li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-blue-100">
                            <a
                                href="/mau_nhap_cau_hoi.xlsx"
                                download
                                className="text-sm text-primary-700 font-bold hover:underline flex items-center gap-1"
                            >
                                📥 Tải file mẫu nhập câu hỏi (.xlsx)
                            </a>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn file Excel
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => {
                                setImportFile(e.target.files[0]);
                                setImportStatus('');
                            }}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded file:border-0
                                file:text-sm file:font-medium
                                file:bg-primary-50 file:text-primary-800
                                hover:file:bg-primary-100
                                cursor-pointer"
                        />
                    </div>

                    {importStatus && (
                        <div className={`text-sm px-3 py-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap ${importStatus.includes('Lỗi') || importStatus.includes('failed')
                            ? 'text-red-600 bg-red-50 border border-red-200'
                            : 'text-success-600 bg-success-50 border border-success-200'
                            }`}>
                            {importStatus}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                            Đóng
                        </Button>
                        <Button onClick={handleImportUpload} disabled={!importFile || importStatus.includes('Đang')}>
                            Upload
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
