import { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

export default function Dashboard() {
    const [stats, setStats] = useState({
        subjectsCount: 0,
        questionsCount: 0,
        activeSessionsCount: 0,
        studentsCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await adminApi.get('/reports/dashboard-stats');
            setStats(res.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className={`text-3xl font-semibold ${color}`}>
                        {loading ? '...' : value}
                    </p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Tổng quan</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Tổng quan hệ thống thi trực tuyến
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Tổng môn học"
                    value={stats.subjectsCount}
                    icon="📚"
                    color="text-primary-800"
                />
                <StatCard
                    title="Tổng câu hỏi"
                    value={stats.questionsCount}
                    icon="❓"
                    color="text-blue-600"
                />
                <StatCard
                    title="Ca thi đang mở"
                    value={stats.activeSessionsCount}
                    icon="🕐"
                    color="text-success-600"
                />
                <StatCard
                    title="Thí sinh đã đăng ký"
                    value={stats.studentsCount}
                    icon="👥"
                    color="text-gray-700"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-md border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/subjects"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-2xl">📚</span>
                        <div>
                            <p className="font-medium text-gray-900">Quản lý môn học</p>
                            <p className="text-xs text-gray-600">Tạo và chỉnh sửa môn học</p>
                        </div>
                    </a>
                    <a
                        href="/admin/questions"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-2xl">❓</span>
                        <div>
                            <p className="font-medium text-gray-900">Quản lý câu hỏi</p>
                            <p className="text-xs text-gray-600">Thêm và sửa câu hỏi</p>
                        </div>
                    </a>
                    <a
                        href="/admin/exam-sessions"
                        className="flex items-center gap-3 p-4 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-2xl">🕐</span>
                        <div>
                            <p className="font-medium text-gray-900">Quản lý ca thi</p>
                            <p className="text-xs text-gray-600">Tạo và quản lý ca thi</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
