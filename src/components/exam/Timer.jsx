import { useEffect } from 'react';
import { useExam } from '../../context/ExamContext';

// Timer component with countdown functionality
export default function Timer({ onTimeUp }) {
    const { timeRemaining, setTimeRemaining } = useExam();

    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp && onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining, setTimeRemaining, onTimeUp]);

    if (timeRemaining === null) return null;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Calm color progression - no flashing
    let colorClass = 'text-gray-900';
    let bgClass = '';

    if (timeRemaining < 300) { // < 5 minutes - warning but not alarming
        colorClass = 'text-error-600';
        bgClass = 'bg-error-50 px-3 py-1 rounded';
    } else if (timeRemaining < 600) { // < 10 minutes
        colorClass = 'text-warning-600';
    }

    return (
        <div className={`text-xl font-mono font-semibold flex items-center gap-2 ${bgClass}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={colorClass}>{formatted}</span>
        </div>
    );
}
