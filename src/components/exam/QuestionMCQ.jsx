import { useExam } from '../../context/ExamContext';

// Multiple choice question component (Part I)
export default function QuestionMCQ({ question, questionNumber }) {
    const { answers, setMCQAnswer } = useExam();

    // Find current selected option
    const selectedAnswer = answers.mcq_answers.find(a => a.question_id === question.question_id);
    const selectedOptionId = selectedAnswer?.selected_option_id;

    const handleOptionSelect = (optionId) => {
        setMCQAnswer(question.question_id, optionId);
    };

    return (
        <div className="bg-white border border-gray-300 rounded-md">
            {/* Question header */}
            <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
                <span className="inline-block text-sm font-semibold text-gray-800">
                    Câu {questionNumber}
                </span>
            </div>

            {/* Question content */}
            <div className="px-6 py-5">
                <p className="text-base text-gray-900 leading-relaxed mb-5">
                    {question.content}
                </p>

                {/* Options - Clean, easy to click */}
                <div className="space-y-2.5">
                    {question.options.map((option) => {
                        const isSelected = option.id === selectedOptionId;

                        return (
                            <label
                                key={option.id}
                                className={`
                  flex items-start px-4 py-3.5 rounded border cursor-pointer
                  transition-colors duration-150
                  ${isSelected
                                        ? 'border-primary-800 bg-primary-50'
                                        : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400'
                                    }
                `}
                            >
                                <input
                                    type="radio"
                                    name={question.question_id}
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => handleOptionSelect(option.id)}
                                    className="mt-0.5 w-4 h-4 text-primary-800 border-gray-400 focus:ring-2 focus:ring-primary-800"
                                />
                                <div className="ml-3 flex-1">
                                    <span className="font-semibold text-gray-900">
                                        {option.display_label}.
                                    </span>
                                    <span className="ml-2 text-gray-800">
                                        {option.text}
                                    </span>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
