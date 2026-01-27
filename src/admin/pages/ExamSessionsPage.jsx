import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examSessionService, examMatrixService } from '../services/examService';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

export default function ExamSessionsPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [matrices, setMatrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [editingSession, setEditingSession] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        matrixId: '',
        startTime: '',
        endTime: '',
        durationMinutes: 0,
        status: 'DRAFT'
    });
    const [importFile, setImportFile] = useState(null);
    const [error, setError] = useState('');
    const [importStatus, setImportStatus] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    // Tự động tính thời gian kết thúc dựa trên Ma trận và Thời gian bắt đầu
    useEffect(() => {
        if (formData.matrixId && formData.startTime) {
            const matrix = matrices.find(m => m.id === formData.matrixId);
            if (matrix && matrix.duration) {
                const start = new Date(formData.startTime);
                // duration is in minutes, convert to ms
                const end = new Date(start.getTime() + matrix.duration * 60000);

                // Format to YYYY-MM-DDTHH:mm for datetime-local input
                // Note: handling timezone offset to keep local time
                const tzOffset = end.getTimezoneOffset() * 60000; // offset in ms
                const localISOTime = new Date(end.getTime() - tzOffset).toISOString().slice(0, 16);

                setFormData(prev => {
                    // Only update if different to avoid infinite loop
                    if (prev.endTime !== localISOTime || prev.durationMinutes !== matrix.duration) {
                        return {
                            ...prev,
                            endTime: localISOTime,
                            durationMinutes: matrix.duration
                        };
                    }
                    return prev;
                });
            }
        }
    }, [formData.matrixId, formData.startTime, matrices]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [sessionsData, matricesData] = await Promise.all([
                examSessionService.getAll(),
                examMatrixService.getAll()
            ]);
            setSessions(sessionsData);
            setMatrices(matricesData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingSession(null);
        setFormData({
            name: '',
            matrixId: '',
            startTime: '',
            endTime: '',
            durationMinutes: 0,
            status: 'DRAFT'
        });
        setIsModalOpen(true);
    };

    // Helper to convert UTC date string to Local ISO String for datetime-local input
    const toLocalISOString = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    const handleEdit = (session) => {
        setEditingSession(session);
        setFormData({
            name: session.name,
            matrixId: session.matrixId,
            startTime: toLocalISOString(session.startTime),
            endTime: toLocalISOString(session.endTime),
            durationMinutes: session.durationMinutes,
            status: session.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (session) => {
        if (!confirm(`Bạn có chắc muốn xóa ca thi "${session.name}"?`)) return;

        try {
            await examSessionService.delete(session.id);
            await loadData();
        } catch (error) {
            alert('Không thể xóa: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                ...formData,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString()
            };

            if (editingSession) {
                await examSessionService.update(editingSession.id, payload);
            } else {
                await examSessionService.create(payload);
            }

            setIsModalOpen(false);
            await loadData();
        } catch (error) {
            setError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleImportStudents = (session) => {
        setSelectedSession(session);
        setImportFile(null);
        setImportStatus('');
        setIsImportModalOpen(true);
    };

    const handleFileChange = (e) => {
        setImportFile(e.target.files[0]);
        setImportStatus('');
    };

    const handleUpload = async () => {
        if (!importFile) {
            setImportStatus('Vui lòng chọn file Excel');
            return;
        }

        try {
            setImportStatus('Đang upload...');
            const result = await examSessionService.importStudents(selectedSession.id, importFile);
            setImportStatus(`Thành công! Đã import ${result.count || 0} sinh viên.`);
            setTimeout(() => {
                setIsImportModalOpen(false);
                loadData();
            }, 2000);
        } catch (error) {
            setImportStatus('Lỗi: ' + (error.response?.data?.message || error.message));
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            DRAFT: 'bg-gray-100 text-gray-800',
            ACTIVE: 'bg-success-100 text-success-800',
            COMPLETED: 'bg-blue-100 text-blue-800',
            CANCELLED: 'bg-red-100 text-red-800'
        };
        const labels = {
            DRAFT: 'Nháp',
            ACTIVE: 'Đang mở',
            COMPLETED: 'Đã kết thúc',
            CANCELLED: 'Đã hủy'
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status] || styles.DRAFT}`}>
                {labels[status] || status}
            </span>
        );
    };

    const columns = [
        { header: 'Tên ca thi', accessor: 'name' },
        {
            header: 'Ma trận',
            render: (row) => matrices.find(m => m.id === row.matrixId)?.name || '-'
        },
        {
            header: 'Thời gian',
            render: (row) => {
                if (!row.startTime) return '-';
                return new Date(row.startTime).toLocaleString('vi-VN');
            }
        },
        {
            header: 'Trạng thái',
            render: (row) => getStatusBadge(row.status)
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Quản lý ca thi</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Tạo ca thi và quản lý danh sách thí sinh
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    + Tạo ca thi
                </Button>
            </div>

            <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Đang tải...</div>
                ) : (
                    <Table
                        columns={columns}
                        data={sessions}
                        actions={(row) => (
                            <>
                                <button
                                    onClick={() => navigate(`/admin/exam-sessions/${row.id}`)}
                                    className="text-primary-600 hover:text-primary-800 font-medium mr-3"
                                    title="Xem chi tiết"
                                >
                                    Chi tiết
                                </button>
                                <button
                                    onClick={() => handleImportStudents(row)}
                                    className="text-green-600 hover:text-green-800 font-medium mr-3"
                                    title="Import danh sách sinh viên"
                                >
                                    Import SV
                                </button>
                                <button
                                    onClick={() => handleEdit(row)}
                                    className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(row)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                >
                                    Xóa
                                </button>
                            </>
                        )}
                    />
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingSession ? 'Cập nhật ca thi' : 'Tạo ca thi mới'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Tên ca thi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ví dụ: Kỳ thi Tin học THPT 2024 - Ca 1"
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ma trận đề <span className="text-red-600">*</span>
                        </label>
                        <select
                            value={formData.matrixId}
                            onChange={(e) => setFormData({ ...formData, matrixId: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                        >
                            <option value="">-- Chọn ma trận --</option>
                            {matrices.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Thời gian bắt đầu"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            required
                        />
                        <div className="space-y-1">
                            <Input
                                label="Thời gian kết thúc (Tự động)"
                                type="datetime-local"
                                value={formData.endTime}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 italic">
                                * Được tính tự động theo thời lượng của ma trận đề
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                        >
                            <option value="DRAFT">Nháp</option>
                            <option value="ACTIVE">Đang mở</option>
                            <option value="COMPLETED">Đã kết thúc</option>
                        </select>
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
                        <Button type="submit">{editingSession ? 'Cập nhật' : 'Tạo mới'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Import Students Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title={`Import sinh viên - ${selectedSession?.name}`}
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <p className="text-sm text-blue-800 font-medium mb-2">Hướng dẫn:</p>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>File Excel <span className="font-bold">không cần header</span> (dữ liệu bắt đầu từ dòng 2)</li>
                            <li>Cột 1: <code className="bg-blue-100 px-1">Mã sinh viên</code> (Bắt buộc)</li>
                            <li>Cột 2: <code className="bg-blue-100 px-1">Họ và tên</code> (Bắt buộc)</li>
                            <li>Cột 3: Ngày sinh (dd/mm/yyyy - Tùy chọn)</li>
                            <li>Cột 4: Lớp (Tùy chọn)</li>
                            <li>Ví dụ: <span className="italic">SV001 | Nguyễn Văn A | 01/01/2005 | 12A1</span></li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chọn file Excel
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded file:border-0
                                file:text-sm file:font-medium
                                file:bg-primary-50 file:text-primary-800
                                hover:file:bg-primary-100
                                cursor-pointer"
                        />
                    </div>

                    {importStatus && (
                        <div className={`text-sm px-3 py-2 rounded ${importStatus.includes('Lỗi')
                            ? 'text-red-600 bg-red-50 border border-red-200'
                            : 'text-success-600 bg-success-50 border border-success-200'
                            }`}>
                            {importStatus}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                            Đóng
                        </Button>
                        <Button onClick={handleUpload} disabled={!importFile || importStatus.includes('Đang')}>
                            Upload
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
