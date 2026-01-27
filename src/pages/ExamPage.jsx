import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ExamHeader from '../components/exam/ExamHeader';
import QuestionMCQ from '../components/exam/QuestionMCQ';
import QuestionTrueFalse from '../components/exam/QuestionTrueFalse';
import QuestionNavigator from '../components/exam/QuestionNavigator';
import SubmitConfirmModal from '../components/modals/SubmitConfirmModal';
import Button from '../components/common/Button';
import { useExam } from '../context/ExamContext';
import examService from '../services/examService';

// Main exam taking page
export default function ExamPage() {
    const navigate = useNavigate();
    const {
        studentExam,
        examSnapshot,
        answers,
        currentQuestionIndex,
        navigateToQuestion,
        getTotalQuestions,
        getAnsweredCount,
        setIsSubmitting
    } = useExam();

    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Redirect if no exam data
    useEffect(() => {
        if (!examSnapshot) {
            navigate('/');
        }
    }, [examSnapshot, navigate]);

    // Prevent page reload
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    if (!examSnapshot) return null;

    // Combine all questions for navigation
    const allQuestions = [
        ...(examSnapshot.part1_mcq || []).map((q, i) => ({ ...q, type: 'mcq', index: i })),
        ...(examSnapshot.part2_group || []).map((q, i) => ({
            ...q,
            type: 'group',
            index: (examSnapshot.part1_mcq?.length || 0) + i
        }))
    ];

    const currentQuestion = allQuestions[currentQuestionIndex];
    const questionNumber = currentQuestionIndex + 1;

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            navigateToQuestion(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < allQuestions.length - 1) {
            navigateToQuestion(currentQuestionIndex + 1);
        }
    };

    const handleSubmitClick = () => {
        setShowSubmitModal(true);
    };

    const handleSubmitConfirm = async () => {
        setShowSubmitModal(false);
        setIsSubmitting(true);

        try {
            // Call real API to submit exam
            await examService.submitExam(studentExam.id, answers);

            // Navigate to completion page
            navigate('/completion');
        } catch (err) {
            console.error('Submit failed:', err);
            setIsSubmitting(false);
            // TODO: Show error message to user
        }
    };

    const handleTimeUp = () => {
        // Auto-submit when time is up
        handleSubmitConfirm();
    };

    const totalQuestions = getTotalQuestions();
    const answeredCount = getAnsweredCount();

    return (
        <Layout className="bg-gray-100">
            {/* Fixed header */}
            <ExamHeader onTimeUp={handleTimeUp} />

            {/* Main content with padding for fixed header */}
            <div className="pt-20 pb-8">
                <div className="max-w-screen-2xl mx-auto px-6">
                    {/* Two-column layout */}
                    <div className="flex gap-6">
                        {/* Left: Question area (70%) */}
                        <div className="flex-1 min-w-0">
                            {currentQuestion && (
                                currentQuestion.type === 'mcq' ? (
                                    <QuestionMCQ
                                        question={currentQuestion}
                                        questionNumber={questionNumber}
                                    />
                                ) : (
                                    <QuestionTrueFalse
                                        question={currentQuestion}
                                        questionNumber={questionNumber}
                                    />
                                )
                            )}

                            {/* Navigation buttons */}
                            <div className="mt-6 flex items-center justify-between gap-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    ← Câu trước
                                </Button>

                                <Button
                                    variant="danger"
                                    onClick={handleSubmitClick}
                                >
                                    Nộp bài
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleNext}
                                    disabled={currentQuestionIndex === allQuestions.length - 1}
                                >
                                    Câu tiếp theo →
                                </Button>
                            </div>
                        </div>

                        {/* Right: Navigator (30%) */}
                        <div className="w-80 flex-shrink-0">
                            <div className="sticky top-24">
                                <QuestionNavigator />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit confirmation modal */}
            <SubmitConfirmModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmitConfirm}
                stats={{
                    total: totalQuestions,
                    answered: answeredCount,
                    unanswered: totalQuestions - answeredCount
                }}
            />
        </Layout>
    );
}
