import { useState, useEffect } from 'react';
import { examSessionService } from '../services/examService';
import { reportService } from '../services/reportService';
import Button from '../../components/common/Button';

export default function ReportsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingScore, setDownloadingScore] = useState(null);
    const [downloadingAudit, setDownloadingAudit] = useState(null);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setLoading(true);
            const data = await examSessionService.getAll();
            // Only show finished sessions
            setSessions(data.filter(s => s.status === 'FINISHED'));
        } catch (error) {
            console.error('Error loading sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadScoreSheet = async (session) => {
        try {
            setDownloadingScore(session.id);
            await reportService.downloadScoreSheet(session.id);
        } catch (error) {
            alert('Không thể tải xuống: ' + (error.response?.data?.message || error.message));
        } finally {
            setDownloadingScore(null);
        }
    };

    const handleDownloadAuditLog = async (session) => {
        try {
            setDownloadingAudit(session.id);
            await reportService.downloadAuditLog(session.id);
        } catch (error) {
            alert('Không thể tải xuống: ' + (error.response?.data?.message || error.message));
        } finally {
            setDownloadingAudit(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Báo cáo</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Xuất báo cáo điểm và nhật ký thi cho các ca thi đã kết thúc
                </p>
            </div>

            {loading ? (
                <div className="bg-white rounded-md border border-gray-200 p-8 text-center text-gray-500">
                    Đang tải...
                </div>
            ) : sessions.length === 0 ? (
                <div className="bg-white rounded-md border border-gray-200 p-8 text-center text-gray-500">
                    Chưa có ca thi nào kết thúc
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-white rounded-md border border-gray-200 p-6 space-y-4"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900">{session.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {session.startTime && new Date(session.startTime).toLocaleDateString('vi-VN')}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    fullWidth
                                    variant="primary"
                                    onClick={() => handleDownloadScoreSheet(session)}
                                    disabled={downloadingScore === session.id}
                                >
                                    {downloadingScore === session.id ? 'Đang tải...' : '📊 Tải bảng điểm'}
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outline"
                                    onClick={() => handleDownloadAuditLog(session)}
                                    disabled={downloadingAudit === session.id}
                                >
                                    {downloadingAudit === session.id ? 'Đang tải...' : '📝 Tải nhật ký'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
