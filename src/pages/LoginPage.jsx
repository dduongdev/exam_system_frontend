import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useExam } from '../context/ExamContext';
import examService from '../services/examService';

// Login page for student authentication
export default function LoginPage() {
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { loginStudent, startExam } = useExam();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!accessCode.trim()) {
            setError('Vui lòng nhập mã đăng nhập');
            return;
        }

        setLoading(true);

        try {
            // Call real API
            const loginResponse = await examService.login(accessCode);

            // Save student exam data
            loginStudent(loginResponse);

            const now = new Date();
            const startTime = new Date(loginResponse.session.startTime);
            const earliestLogin = new Date(startTime.getTime() - 20 * 60 * 1000);

            if (now < earliestLogin) {
                setError(`Ca thi chưa bắt đầu. Vui lòng quay lại sau 20 phút trước giờ thi (${startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}).`);
                setLoading(false);
                return;
            }

            if (now < startTime) {
                // Exam hasn't started yet, go to waiting page
                navigate('/waiting');
            } else {
                // Exam already started, get snapshot and go to exam
                const examSnapshot = await examService.startExam(loginResponse.id);
                startExam(examSnapshot, loginResponse.session);
                navigate('/exam');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Mã đăng nhập không đúng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-100">
                <div className="w-full max-w-lg">
                    {/* Login Card */}
                    <div className="bg-white border border-gray-300 rounded-md shadow-sm">
                        {/* Header Section */}
                        <div className="border-b border-gray-200 px-8 py-6">
                            <h1 className="text-2xl font-semibold text-gray-900 text-center">
                                Hệ Thống Thi Trực Tuyến
                            </h1>
                        </div>



                        {/* Form Section */}
                        <div className="px-8 py-6">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <Input
                                    label="Mã đăng nhập"
                                    type="text"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    placeholder="Nhập mã đăng nhập của bạn"
                                    error={error}
                                    required
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading ? 'Đang đăng nhập...' : 'Bắt đầu làm bài'}
                                </Button>
                            </form>
                        </div>

                        {/* Instructions */}
                        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-md">
                            <p className="text-xs text-gray-600 text-center leading-relaxed">
                                Lưu ý: Sau khi bắt đầu, thời gian đếm ngược sẽ tự động chạy.
                                <br />
                                Đảm bảo kết nối internet ổn định trong suốt quá trình làm bài.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
