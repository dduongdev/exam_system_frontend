import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { useExam } from '../context/ExamContext';

// Completion page shown after exam submission
export default function CompletionPage() {
    const navigate = useNavigate();
    const { clearExamData } = useExam();

    useEffect(() => {
        // Clear exam data from localStorage
        return () => {
            // Defer clearing to allow viewing the page
        };
    }, []);

    const handleFinish = () => {
        clearExamData();
        navigate('/');
    };

    const submissionTime = new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
                        {/* Success icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Success message */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Nộp bài thành công
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Bạn đã hoàn thành bài thi. Cảm ơn bạn đã tham gia!
                        </p>

                        {/* Submission info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3 text-left">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Thời gian nộp:</span>
                                <span className="font-medium text-gray-900">{submissionTime}</span>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                Kết quả thi sẽ được thông báo sau khi Ban giám khảo hoàn tất chấm điểm.
                            </p>
                        </div>

                        {/* Finish button */}
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleFinish}
                        >
                            Hoàn thành
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
