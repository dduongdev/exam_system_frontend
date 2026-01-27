import Button from '../common/Button';

// Submit confirmation modal
export default function SubmitConfirmModal({ isOpen, onClose, onConfirm, stats }) {
    if (!isOpen) return null;

    const { total, answered, unanswered } = stats;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                {/* Header */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Xác nhận nộp bài
                </h2>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng số câu:</span>
                        <span className="font-semibold text-gray-900">{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Câu đã làm:</span>
                        <span className="font-semibold text-green-600">{answered}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Câu chưa làm:</span>
                        <span className="font-semibold text-red-600">{unanswered}</span>
                    </div>
                </div>

                {/* Warning if unanswered */}
                {unanswered > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                        <div className="flex gap-2">
                            <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-orange-800">
                                Bạn còn <span className="font-semibold">{unanswered}</span> câu chưa trả lời. Bạn có chắc chắn muốn nộp bài?
                            </p>
                        </div>
                    </div>
                )}

                {/* Message */}
                <p className="text-gray-700 mb-6">
                    Sau khi nộp bài, bạn sẽ không thể quay lại để chỉnh sửa. Bạn có chắc chắn muốn nộp bài thi không?
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        fullWidth
                    >
                        Quay lại
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        fullWidth
                    >
                        Nộp bài
                    </Button>
                </div>
            </div>
        </div>
    );
}
