import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { questionService } from '../services/questionService';
import { questionPoolService } from '../services/questionPoolService';
import { subjectService } from '../services/subjectService';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Tabs from '../components/common/Tabs';
import Button from '../../components/common/Button';
import MCQForm from '../components/forms/MCQForm';
import GroupQuestionForm from '../components/forms/GroupQuestionForm';

export default function QuestionsPage() {
    const [searchParams] = useSearchParams();
    const [questions, setQuestions] = useState([]);
    const [pools, setPools] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [questionType, setQuestionType] = useState('MCQ');
    const [filterSubject, setFilterSubject] = useState(searchParams.get('subjectId') || '');
    const [filterPool, setFilterPool] = useState(searchParams.get('poolId') || '');
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {
        loadSubjects();
    }, []);

    useEffect(() => {
        if (filterSubject) {
            loadPools(filterSubject);
        } else {
            setPools([]);
            setFilterPool('');
        }
    }, [filterSubject]);

    useEffect(() => {
        setPage(1); // Reset to first page on pool change
        if (filterPool) {
            loadQuestions(1);
        } else {
            setQuestions([]);
            setTotal(0);
        }
    }, [filterPool]);

    const loadSubjects = async () => {
        try {
            const data = await subjectService.getAll();
            setSubjects(data);
        } catch (error) {
            console.error('Error loading subjects:', error);
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

    const loadQuestions = async (pageNum = page) => {
        if (!filterPool) return;

        try {
            setLoading(true);
            const response = await questionService.getByPool(filterPool, {
                page: pageNum,
                limit
            });
            setQuestions(response.items);
            setTotal(response.total);
            setPage(response.page);
        } catch (error) {
            console.error('Error loading questions:', error);
            setError('Không thể tải danh sách câu hỏi');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > Math.ceil(total / limit)) return;
        loadQuestions(newPage);
    };

    const [editingQuestion, setEditingQuestion] = useState(null);

    const handleCreate = (type) => {
        setQuestionType(type);
        setEditingQuestion(null);
        setIsModalOpen(true);
    };

    const handleEdit = (question) => {
        setQuestionType(question.questionType);
        setEditingQuestion(question);
        setIsModalOpen(true);
    };

    const handleDelete = async (question) => {
        if (!confirm(`Bạn có chắc muốn xóa câu hỏi này?`)) return;

        try {
            await questionService.delete(question.id);
            await loadQuestions();
        } catch (error) {
            alert('Không thể xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (data) => {
        setError('');

        try {
            if (editingQuestion) {
                await questionService.update(editingQuestion.id, data);
            } else {
                await questionService.create({
                    ...data,
                    poolId: filterPool
                });
            }
            setIsModalOpen(false);
            setEditingQuestion(null);
            await loadQuestions();
            alert(editingQuestion ? 'Cập nhật câu hỏi thành công' : 'Thêm câu hỏi thành công');
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const getCognitiveLevelText = (level) => {
        const levels = { 1: 'Biết', 2: 'Hiểu', 3: 'Vận dụng' };
        return levels[level] || level;
    };

    const columns = [
        {
            header: 'Loại',
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-medium rounded ${row.questionType === 'MCQ'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                    }`}>
                    {row.questionType}
                </span>
            )
        },
        {
            header: 'Nội dung',
            render: (row) => (
                <div className="max-w-md truncate" title={row.content}>
                    {row.content}
                </div>
            )
        },
        {
            header: 'Mức độ',
            render: (row) => (
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${row.cognitiveLevel === 1 ? 'bg-green-50 text-green-700' :
                    row.cognitiveLevel === 2 ? 'bg-orange-50 text-orange-700' :
                        'bg-red-50 text-red-700'
                    }`}>
                    {getCognitiveLevelText(row.cognitiveLevel)}
                </span>
            )
        },
    ];

    const tabs = [
        { id: 'MCQ', label: 'Câu hỏi trắc nghiệm' },
        { id: 'GROUP', label: 'Câu hỏi Đúng/Sai' }
    ];

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Quản lý câu hỏi</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Tạo và quản lý câu hỏi thi (MCQ và GROUP)
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-md border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Môn học <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
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
                            Gói câu hỏi <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={filterPool}
                            onChange={(e) => setFilterPool(e.target.value)}
                            disabled={!filterSubject}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800 disabled:bg-gray-100"
                        >
                            <option value="">-- Chọn gói câu hỏi --</option>
                            {pools.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {filterPool && (
                <div className="flex gap-3">
                    <Button onClick={() => handleCreate('MCQ')}>
                        + Thêm câu trắc nghiệm
                    </Button>
                    <Button variant="outline" onClick={() => handleCreate('GROUP')}>
                        + Thêm câu Đúng/Sai
                    </Button>
                </div>
            )}

            {/* Table */}
            {filterPool && (
                <div className="space-y-4">
                    <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">Đang tải...</div>
                        ) : (
                            <Table
                                columns={columns}
                                data={questions}
                                emptyMessage="Chưa có câu hỏi nào. Hãy tạo câu hỏi mới!"
                                actions={(row) => (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEdit(row)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(row)}
                                            className="text-red-600 hover:text-red-700 font-medium"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            />
                        )}
                    </div>

                    {/* Pagination UI */}
                    {total > limit && (
                        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{(page - 1) * limit + 1}</span> đến <span className="font-medium">{Math.min(page * limit, total)}</span> trong tổng số <span className="font-medium">{total}</span> câu hỏi
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                >
                                    Trước
                                </Button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${page === i + 1
                                                ? 'bg-primary-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                title={editingQuestion ? 'Chỉnh sửa câu hỏi' : `Tạo câu hỏi ${questionType === 'MCQ' ? 'trắc nghiệm' : 'Đúng/Sai'}`}
                size="lg"
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingQuestion(null);
                }}
            >
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                        {error}
                    </div>
                )}

                {questionType === 'MCQ' ? (
                    <MCQForm
                        initialData={editingQuestion}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setEditingQuestion(null);
                        }}
                    />
                ) : (
                    <GroupQuestionForm
                        initialData={editingQuestion}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setIsModalOpen(false);
                            setEditingQuestion(null);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
