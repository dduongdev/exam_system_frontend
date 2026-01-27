import { useExam } from '../../context/ExamContext';

// True/False group question component (Part II)
export default function QuestionTrueFalse({ question, questionNumber }) {
    const { answers, setGroupAnswer } = useExam();

    // Find current group answer
    const groupAnswer = answers.group_answers.find(a => a.question_id === question.question_id);

    const getSubAnswer = (subQuestionId) => {
        const subAnswer = groupAnswer?.sub_answers.find(s => s.sub_question_id === subQuestionId);
        return subAnswer?.selected;
    };

    const handleSubAnswer = (subQuestionId, value) => {
        setGroupAnswer(question.question_id, subQuestionId, value);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Question number badge */}
            <div className="mb-4">
                <span className="inline-block bg-primary-700 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    Câu {questionNumber} (Nhóm)
                </span>
            </div>

            {/* Introduction text */}
            <div className="mb-6">
                <p className="text-gray-900 text-base leading-relaxed">
                    {question.content}
                </p>
            </div>

            {/* Sub-questions table */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
                {question.sub_questions.map((subQ, index) => (
                    <div
                        key={subQ.id}
                        className={`
              p-4 border-b last:border-b-0
              ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            `}
                    >
                        {/* Sub-question text */}
                        <div className="mb-3">
                            <span className="font-semibold text-gray-900">{subQ.display_label}.</span>
                            <span className="ml-2 text-gray-800">{subQ.text}</span>
                        </div>

                        {/* True/False options */}
                        <div className="flex gap-6 ml-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={`${question.question_id}-${subQ.id}`}
                                    checked={getSubAnswer(subQ.id) === true}
                                    onChange={() => handleSubAnswer(subQ.id, true)}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-gray-700 font-medium">Đúng</span>
                            </label>

                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={`${question.question_id}-${subQ.id}`}
                                    checked={getSubAnswer(subQ.id) === false}
                                    onChange={() => handleSubAnswer(subQ.id, false)}
                                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-gray-700 font-medium">Sai</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
