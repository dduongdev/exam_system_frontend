import { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import Button from '../../../components/common/Button';

export default function StudentExamDetailModal({ isOpen, onClose, studentExamId }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (isOpen && studentExamId) {
            loadDetail();
        } else {
            setDetail(null);
        }
    }, [isOpen, studentExamId]);

    const loadDetail = async () => {
        try {
            setLoading(true);
            const data = await reportService.getStudentExamDetail(studentExamId);
            setDetail(data);
        } catch (error) {
            console.error('Error loading detail:', error);
            alert('Không thể tải chi tiết bài làm');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await reportService.downloadStudentExamDetail(studentExamId);
        } catch (error) {
            console.error('Download error:', error);
            alert('Lỗi tải xuống');
        } finally {
            setDownloading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Chi tiết bài làm
                        </h3>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={handleDownload}
                                disabled={loading || !detail || downloading}
                            >
                                {downloading ? 'Đang tải...' : '📥 Tải bài làm'}
                            </Button>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-gray-50 px-4 py-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
                        ) : detail ? (
                            <div className="space-y-6">
                                {/* Student Info */}
                                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Sinh viên</p>
                                        <p className="font-medium text-gray-900">{detail.info.studentName} ({detail.info.studentCode})</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Lớp</p>
                                        <p className="font-medium text-gray-900">{detail.info.className || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Điểm số</p>
                                        <p className="font-bold text-primary-600 text-lg">
                                            {detail.info.score != null ? Number(detail.info.score).toFixed(2) : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái</p>
                                        <p className="font-medium text-gray-900">{detail.info.status}</p>
                                    </div>
                                </div>

                                {/* Questions */}
                                <div className="space-y-4">
                                    {detail.questions.map((q) => (
                                        <div key={q.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-900">Câu {q.index}: {q.content}</h4>
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${q.type === 'MCQ' ? (q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-gray-100 text-gray-800'}`}>
                                                    {q.type === 'MCQ' ? (q.isCorrect ? 'ĐÚNG' : 'SAI') : 'CHÙM CÂU HỎI'}
                                                </span>
                                            </div>

                                            {/* MCQ Options */}
                                            {q.type === 'MCQ' && (
                                                <div className="space-y-2 ml-4">
                                                    {!q.options.some(opt => opt.isSelected) && (
                                                        <div className="p-2 mb-2 bg-red-50 border border-red-100 text-red-700 text-sm rounded italic">
                                                            ⚠️ Thí sinh chưa chọn câu trả lời
                                                        </div>
                                                    )}
                                                    {q.options.map((opt) => {
                                                        let storedClass = "p-2 rounded border ";
                                                        if (opt.isSelected && opt.isCorrect) storedClass += "bg-green-50 border-green-200 text-green-900";
                                                        else if (opt.isSelected && !opt.isCorrect) storedClass += "bg-red-50 border-red-200 text-red-900";
                                                        else if (opt.isCorrect) storedClass += "bg-green-50 border-green-200 text-green-900 opacity-70";
                                                        else storedClass += "border-gray-100 text-gray-600";

                                                        return (
                                                            <div key={opt.id} className={storedClass}>
                                                                <span className="font-bold mr-2">{opt.label}.</span>
                                                                {opt.text}
                                                                {opt.isSelected && <span className="ml-2 text-xs font-bold">(Đã chọn)</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Group SubQuestions */}
                                            {q.type === 'GROUP' && (
                                                <div className="space-y-3 ml-4 mt-2">
                                                    {q.subQuestions.map((sub) => (
                                                        <div key={sub.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                                            <p className="mb-2 font-medium">{sub.label}) {sub.content}</p>
                                                            <div className="flex gap-4 text-sm">
                                                                <span className={sub.userSelected === true ? "font-bold text-blue-600" : ""}>
                                                                    Chọn: {sub.userSelected === true ? "Đúng" : sub.userSelected === false ? "Sai" : "Chưa chọn"}
                                                                </span>
                                                                <span className="text-gray-400">|</span>
                                                                <span className="text-green-600">
                                                                    Đáp án: {sub.isCorrectAnswer ? "Đúng" : "Sai"}
                                                                </span>
                                                                <span className="text-gray-400">|</span>
                                                                <span className={`font-bold ${sub.isUserCorrect ? "text-green-600" : "text-red-600"}`}>
                                                                    Kết quả: {sub.isUserCorrect ? "ĐÚNG" : "SAI"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">Không có dữ liệu bài làm</div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                        <Button
                            variant="primary"
                            onClick={onClose}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
