import Timer from './Timer';
import { useExam } from '../../context/ExamContext';

// Fixed header for exam page showing exam info, timer, and student info
export default function ExamHeader({ onTimeUp }) {
    const { studentExam } = useExam();

    if (!studentExam) return null;

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-300 shadow-sm z-50">
            <div className="max-w-screen-2xl mx-auto px-6 py-3.5">
                <div className="flex items-center justify-between">
                    {/* Left: Exam name */}
                    <div className="flex-1">
                        <h1 className="text-base font-semibold text-gray-900 line-clamp-1">
                            {studentExam.session?.name || 'Kỳ thi'}
                        </h1>
                    </div>

                    {/* Center: Timer */}
                    <div className="flex-shrink-0 mx-8">
                        <Timer onTimeUp={onTimeUp} />
                    </div>

                    {/* Right: Student info */}
                    <div className="flex-1 text-right">
                        <div className="text-sm text-gray-700">
                            SBD: <span className="font-semibold text-gray-900">{studentExam.student?.studentCode}</span>
                        </div>
                        <div className="text-sm text-gray-800 font-medium">
                            {studentExam.student?.fullName}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
