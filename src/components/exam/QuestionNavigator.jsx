import { useExam } from '../../context/ExamContext';

// Question navigator component showing grid of all questions
export default function QuestionNavigator() {
    const { examSnapshot, currentQuestionIndex, navigateToQuestion, answers } = useExam();

    if (!examSnapshot) return null;

    const allQuestions = [
        ...(examSnapshot.part1_mcq || []).map((q, i) => ({
            ...q,
            index: i,
            type: 'mcq',
            number: i + 1
        })),
        ...(examSnapshot.part2_group || []).map((q, i) => ({
            ...q,
            index: (examSnapshot.part1_mcq?.length || 0) + i,
            type: 'group',
            number: (examSnapshot.part1_mcq?.length || 0) + i + 1
        }))
    ];

    // Check if question is answered
    const isQuestionAnswered = (question) => {
        if (question.type === 'mcq') {
            return answers.mcq_answers.some(a => a.question_id === question.question_id);
        } else {
            const groupAnswer = answers.group_answers.find(a => a.question_id === question.question_id);
            // Consider group answered if all 4 sub-questions have answers
            return groupAnswer?.sub_answers?.length === 4;
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-md">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800">
                    Danh sách câu hỏi
                </h3>
            </div>

            <div className="p-4">
                {/* Legend */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                    <div className="grid grid-cols-1 gap-2 text-xs text-gray-700">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-white border border-gray-400 rounded flex-shrink-0"></div>
                            <span>Chưa làm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-success-100 border border-success-600 rounded flex-shrink-0"></div>
                            <span>Đã làm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-white border-2 border-primary-800 rounded flex-shrink-0"></div>
                            <span>Đang làm</span>
                        </div>
                    </div>
                </div>

                {/* Question grid - uniform squares */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                    {allQuestions.map((question) => {
                        const isAnswered = isQuestionAnswered(question);
                        const isCurrent = question.index === currentQuestionIndex;

                        let bgClass = 'bg-white';
                        let borderClass = 'border border-gray-400';
                        let textClass = 'text-gray-800';

                        if (isAnswered) {
                            bgClass = 'bg-success-100';
                            borderClass = 'border border-success-600';
                            textClass = 'text-success-700';
                        }

                        if (isCurrent) {
                            borderClass = 'border-2 border-primary-800';
                        }

                        return (
                            <button
                                key={question.question_id}
                                onClick={() => navigateToQuestion(question.index)}
                                className={`
                  ${bgClass} ${borderClass} ${textClass}
                  h-9 rounded font-medium text-sm
                  hover:bg-gray-50 transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-1
                `}
                            >
                                {question.number}
                            </button>
                        );
                    })}
                </div>

                {/* Summary */}
                <div className="pt-3 border-t border-gray-200 space-y-1.5 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Tổng số câu:</span>
                        <span className="font-semibold">{allQuestions.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Đã làm:</span>
                        <span className="font-semibold text-success-600">
                            {allQuestions.filter(q => isQuestionAnswered(q)).length}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Chưa làm:</span>
                        <span className="font-semibold text-gray-800">
                            {allQuestions.filter(q => !isQuestionAnswered(q)).length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
