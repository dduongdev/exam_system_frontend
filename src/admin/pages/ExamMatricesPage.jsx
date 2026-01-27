import { useState, useEffect } from 'react';
import { examMatrixService } from '../services/examService';
import { questionPoolService } from '../services/questionPoolService';
import { subjectService } from '../services/subjectService';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ExamMatricesPage() {
    const [matrices, setMatrices] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [pools, setPools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMatrix, setEditingMatrix] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        subjectId: '',
        duration: 90,
        mcqRules: [{ pool_id: '', count: 12, cognitive_level: 1 }],
        groupRules: [{ pool_id: '', count: 4, cognitive_level: 1 }]
    });
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (formData.subjectId) {
            loadPools(formData.subjectId);
        } else {
            setPools([]);
        }
    }, [formData.subjectId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [matricesData, subjectsData] = await Promise.all([
                examMatrixService.getAll(),
                subjectService.getAll()
            ]);
            setMatrices(matricesData);
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPools = async (subjectId) => {
        try {
            const data = await questionPoolService.getAll(subjectId);
            setPools(data);
        } catch (error) {
            console.error('Error loading pools:', error);
        }
    };

    const handleCreate = () => {
        setEditingMatrix(null);
        setFormData({
            name: '',
            subjectId: '',
            duration: 90,
            mcqRules: [{ pool_id: '', count: 12, cognitive_level: 1 }],
            groupRules: [{ pool_id: '', count: 4, cognitive_level: 1 }]
        });
        setIsModalOpen(true);
    };

    const handleEdit = (matrix) => {
        setEditingMatrix(matrix);
        setFormData({
            name: matrix.name,
            subjectId: matrix.subjectId || matrix.subject?.id || '',
            duration: matrix.duration || 90,
            mcqRules: matrix.settings?.mcq_rules?.length > 0
                ? matrix.settings.mcq_rules
                : [{ pool_id: '', count: matrix.totalMcqCount || 0, cognitive_level: 1 }],
            groupRules: matrix.settings?.group_rules?.length > 0
                ? matrix.settings.group_rules
                : [{ pool_id: '', count: matrix.totalGroupCount || 0, cognitive_level: 1 }]
        });
        setIsModalOpen(true);
    };

    const addRule = (type) => {
        const key = type === 'MCQ' ? 'mcqRules' : 'groupRules';
        const defaultCount = type === 'MCQ' ? 4 : 1;
        setFormData({
            ...formData,
            [key]: [...formData[key], { pool_id: '', count: defaultCount, cognitive_level: 1 }]
        });
    };

    const removeRule = (type, index) => {
        const key = type === 'MCQ' ? 'mcqRules' : 'groupRules';
        const newRules = formData[key].filter((_, i) => i !== index);
        setFormData({ ...formData, [key]: newRules.length > 0 ? newRules : [{ pool_id: '', count: 0, cognitive_level: 1 }] });
    };

    const updateRule = (type, index, field, value) => {
        const key = type === 'MCQ' ? 'mcqRules' : 'groupRules';
        const newRules = [...formData[key]];
        newRules[index] = { ...newRules[index], [field]: field === 'count' || field === 'cognitive_level' ? parseInt(value) || 0 : value };
        setFormData({ ...formData, [key]: newRules });
    };

    const handleDelete = async (matrix) => {
        if (!confirm(`Bạn có chắc muốn xóa ma trận "${matrix.name}"?`)) return;

        try {
            await examMatrixService.delete(matrix.id);
            await loadData();
        } catch (error) {
            alert('Không thể xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const mcqCount = formData.mcqRules.reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);
        const groupCount = formData.groupRules.reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);

        const payload = {
            name: formData.name,
            duration: parseInt(formData.duration),
            totalMcqCount: mcqCount,
            totalGroupCount: groupCount,
            settings: {
                mcq_rules: formData.mcqRules.filter(r => r.pool_id),
                group_rules: formData.groupRules.filter(r => r.pool_id)
            }
        };

        if (formData.subjectId && formData.subjectId.trim() !== '') {
            payload.subjectId = formData.subjectId;
        }

        try {
            if (editingMatrix) {
                await examMatrixService.update(editingMatrix.id, payload);
            } else {
                await examMatrixService.create(payload);
            }
            setIsModalOpen(false);
            await loadData();
        } catch (error) {
            console.error('Submit error:', error);
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        { header: 'Tên ma trận', accessor: 'name' },
        { header: 'Môn học', render: (row) => subjects.find(s => s.id === row.subjectId)?.name || '-' },
        { header: 'Thời gian (phút)', accessor: 'duration' },
        {
            header: 'Cấu trúc',
            render: (row) => {
                const mcqCount = row.settings?.mcq_rules?.reduce((acc, r) => acc + r.count, 0) || 0;
                const groupCount = row.settings?.group_rules?.reduce((acc, r) => acc + r.count, 0) || 0;
                return `MCQ: ${mcqCount}, GROUP: ${groupCount}`;
            }
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý ma trận đề</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Định nghĩa cấu trúc đề thi (số câu MCQ, GROUP, thời gian)
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    + Tạo ma trận
                </Button>
            </div>

            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={matrices}
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingMatrix ? 'Sửa ma trận đề' : 'Tạo ma trận đề mới'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên ma trận"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Đề thi Tin học THPT 2024"
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

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Thời gian (phút)"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            required
                            min="1"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tổng điểm dự kiến</label>
                            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-blue-700 font-bold">
                                {(formData.mcqRules.reduce((s, r) => s + (parseInt(r.count) || 0), 0) * 0.25 +
                                    formData.groupRules.reduce((s, r) => s + (parseInt(r.count) || 0), 0) * 1.0).toFixed(2)} / 10.00
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">PHẦN I. CÂU HỎI TRẮC NGHIỆM</h3>
                            <Button type="button" size="sm" variant="outline" onClick={() => addRule('MCQ')}>
                                + Thêm quy tắc
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.mcqRules.map((rule, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-100 relative group">
                                    {formData.mcqRules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRule('MCQ', idx)}
                                            className="absolute -top-2 -right-2 bg-white border border-red-200 text-red-600 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Gói câu hỏi</label>
                                            <select
                                                value={rule.pool_id}
                                                onChange={(e) => updateRule('MCQ', idx, 'pool_id', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-800"
                                                required
                                            >
                                                <option value="">-- Chọn gói --</option>
                                                {pools.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Mức độ</label>
                                            <select
                                                value={rule.cognitive_level}
                                                onChange={(e) => updateRule('MCQ', idx, 'cognitive_level', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-800"
                                            >
                                                <option value={1}>Biết</option>
                                                <option value={2}>Hiểu</option>
                                                <option value={3}>Vận dụng</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Số câu</label>
                                            <input
                                                type="number"
                                                value={rule.count}
                                                onChange={(e) => updateRule('MCQ', idx, 'count', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-800"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mb-3 mt-6">
                            <h3 className="text-sm font-semibold text-gray-900">PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG SAI</h3>
                            <Button type="button" size="sm" variant="outline" onClick={() => addRule('GROUP')}>
                                + Thêm quy tắc
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.groupRules.map((rule, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-100 relative group">
                                    {formData.groupRules.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRule('GROUP', idx)}
                                            className="absolute -top-2 -right-2 bg-white border border-red-200 text-red-600 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Gói câu hỏi</label>
                                            <select
                                                value={rule.pool_id}
                                                onChange={(e) => updateRule('GROUP', idx, 'pool_id', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-800"
                                                required
                                            >
                                                <option value="">-- Chọn gói --</option>
                                                {pools.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Mức độ</label>
                                            <select
                                                value={rule.cognitive_level}
                                                onChange={(e) => updateRule('GROUP', idx, 'cognitive_level', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-800"
                                            >
                                                <option value={1}>Biết</option>
                                                <option value={2}>Hiểu</option>
                                                <option value={3}>Vận dụng</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Số câu</label>
                                            <input
                                                type="number"
                                                value={rule.count}
                                                onChange={(e) => updateRule('GROUP', idx, 'count', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-800"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button type="submit">
                            {editingMatrix ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
