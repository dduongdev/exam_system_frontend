import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examSessionService } from '../services/examService';
import Table from '../components/common/Table';
import Button from '../../components/common/Button';
import StudentExamDetailModal from '../components/modals/StudentExamDetailModal';

export default function ExamSessionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [sessionData, studentsData] = await Promise.all([
                examSessionService.getOne(id),
                examSessionService.getStudents(id)
            ]);
            setSession(sessionData);
            setStudents(studentsData);
        } catch (err) {
            console.error('Error loading session details:', err);
            setError('Không thể tải thông tin ca thi');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await examSessionService.exportAccessCodes(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Danh_sach_SV_Ca_thi_${session?.name || id}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('Không thể xuất file');
        }
    };

    // Helper function to format datetime with timezone handling
    // Helper function to format datetime with timezone handling
    const formatDateTime = (dateString) => {
        if (!dateString) return '-';

        // Backend returns ISO string (UTC).
        // We parse it normally and let Intl convert to local time.
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    const getStatusBadge = (status) => {
        const styles = {
            REGISTERED: 'bg-gray-100 text-gray-800',
            IN_PROGRESS: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
            ABSENT: 'bg-red-100 text-red-800',
        };
        const labels = {
            REGISTERED: 'Đã đăng ký',
            IN_PROGRESS: 'Đang thi',
            COMPLETED: 'Hoàn thành',
            ABSENT: 'Vắng thi',
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const [selectedStudentExamId, setSelectedStudentExamId] = useState(null);

    const handleViewDetail = (studentExamId) => {
        setSelectedStudentExamId(studentExamId);
    };

    const handleCloseModal = () => {
        setSelectedStudentExamId(null);
    };

    const columns = [
        {
            header: 'Mã SV',
            accessor: 'student.studentCode',
            render: (row) => row.student?.studentCode
        },
        {
            header: 'Họ và tên',
            accessor: 'student.fullName',
            render: (row) => row.student?.fullName
        },
        {
            header: 'Lớp',
            accessor: 'student.className',
            render: (row) => row.student?.className || '-'
        },
        {
            header: 'Mã truy cập',
            accessor: 'accessCode',
            render: (row) => <span className="font-mono font-bold text-primary-700">{row.accessCode}</span>
        },
        {
            header: 'Điểm số',
            accessor: 'score',
            render: (row) => {
                if (row.score !== null) return row.score;
                return session?.status === 'FINISHED' ? '0' : '-';
            }
        },
        {
            header: 'Trạng thái',
            accessor: 'status',
            render: (row) => {
                if (session?.status === 'FINISHED' && (row.status === 'REGISTERED' || row.status === 'ABSENT' || row.status === 'IN_PROGRESS')) {
                    return (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            Kết thúc (Không thi)
                        </span>
                    );
                }
                return getStatusBadge(row.status);
            }
        },
        {
            header: 'Hành động',
            render: (row) => (
                <div className="flex gap-2">
                    {row.status !== 'REGISTERED' && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(row.id)}
                        >
                            Xem chi tiết
                        </Button>
                    )}
                </div>
            )
        }
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải thông tin ca thi...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!session) return <div className="p-8 text-center text-gray-500">Không tìm thấy ca thi</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/admin/exam-sessions')}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-2"
                    >
                        ← Quay lại danh sách
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">{session.name}</h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleExport} variant="primary" size="sm">
                        Xuất file Access Key
                    </Button>
                    <Button onClick={loadData} variant="outline" size="sm">
                        Làm mới
                    </Button>
                </div>
            </div>

            {/* Session Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500">Ma trận đề</p>
                        <p className="font-medium">{session.matrix?.name || 'Chưa chọn'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Thời gian bắt đầu</p>
                        <p className="font-medium">{formatDateTime(session.startTime)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Thời gian kết thúc</p>
                        <p className="font-medium">{formatDateTime(session.endTime)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Số lượng sinh viên</p>
                        <p className="font-medium text-lg text-primary-600">{students.length}</p>
                    </div>
                </div>
            </div>

            {/* Student List */}
            <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">Danh sách sinh viên ({students.length})</h2>
                <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                    {students.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Chưa có sinh viên nào trong ca thi này.
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            data={students}
                        />
                    )}
                </div>
            </div>

            <StudentExamDetailModal
                isOpen={!!selectedStudentExamId}
                onClose={handleCloseModal}
                studentExamId={selectedStudentExamId}
            />
        </div>
    );
}
