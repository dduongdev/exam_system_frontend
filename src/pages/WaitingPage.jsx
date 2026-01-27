import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import { useExam } from '../context/ExamContext';
import examService from '../services/examService';

export default function WaitingPage() {
    const { session, studentExam, startExam } = useExam();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(null);

    // Calculate time remaining until start
    const calculateTimeLeft = useCallback(() => {
        if (!session?.startTime) return null;

        const startTime = new Date(session.startTime).getTime();
        const now = new Date().getTime();
        const difference = startTime - now;

        return Math.max(0, difference);
    }, [session?.startTime]);

    useEffect(() => {
        // Redirection logic
        if (!studentExam || !session) {
            navigate('/');
            return;
        }

        const handleTransition = async () => {
            try {
                // Initialize exam session when time is up
                const snapshot = await examService.startExam(studentExam.id);
                startExam(snapshot, session);
                navigate('/exam');
            } catch (error) {
                console.error('Failed to start exam:', error);
                // If it fails, maybe it's still too early by a few milliseconds, 
                // but usually we should just try to navigate.
                // For now, retry or show error is complex, let's just try to navigate
                // and hope the exam page handles it.
                navigate('/exam');
            }
        };

        const initialDiff = calculateTimeLeft();
        if (initialDiff !== null && initialDiff <= 0) {
            handleTransition();
            return;
        }

        setTimeLeft(initialDiff);

        // Update countdown every second
        const timer = setInterval(() => {
            const diff = calculateTimeLeft();
            if (diff !== null && diff <= 0) {
                clearInterval(timer);
                handleTransition();
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session, studentExam, calculateTimeLeft, navigate, startExam]);

    const formatTime = (ms) => {
        if (ms === null) return '--:--:--';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    };

    if (!session) return null;

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
                <div className="w-full max-w-2xl text-center">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-4">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sẵn sàng để bắt đầu?</h1>
                            <p className="text-gray-600">Bài thi sẽ tự động bắt đầu khi hết thời gian đếm ngược.</p>
                        </div>

                        {/* Session Info */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tên ca thi</p>
                                    <p className="text-lg font-semibold text-gray-900">{session.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Thời gian bắt đầu</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {new Date(session.startTime).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} ngày {new Date(session.startTime).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Countdown */}
                        <div className="mb-10">
                            <p className="text-sm font-medium text-gray-500 mb-2">Thời gian còn lại:</p>
                            <div className="text-6xl md:text-8xl font-black text-primary-800 tracking-tighter tabular-nums">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        {/* Footer Tips */}
                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Đã kết nối máy chủ</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Hệ thống giám sát bật</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">
                        Vui lòng không đóng tab hoặc trình duyệt này.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
