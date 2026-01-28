import { useState, useEffect } from 'react';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export default function MCQForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        content: '',
        cognitiveLevel: 1,
        options: [
            { id: crypto.randomUUID(), text: '', label: 'A' },
            { id: crypto.randomUUID(), text: '', label: 'B' },
            { id: crypto.randomUUID(), text: '', label: 'C' },
            { id: crypto.randomUUID(), text: '', label: 'D' },
        ],
        correctLabel: ''
    });

    // Initialize data for editing
    useEffect(() => {
        if (initialData) {
            const mcqData = initialData.data;
            const correctOpt = mcqData?.options?.find(opt => opt.id === mcqData.correct_option_id);

            setFormData({
                content: initialData.content,
                cognitiveLevel: initialData.cognitiveLevel,
                options: mcqData?.options?.map(opt => ({ ...opt })) || [
                    { id: crypto.randomUUID(), text: '', label: 'A' },
                    { id: crypto.randomUUID(), text: '', label: 'B' },
                    { id: crypto.randomUUID(), text: '', label: 'C' },
                    { id: crypto.randomUUID(), text: '', label: 'D' },
                ],
                correctLabel: correctOpt?.label || ''
            });
        }
    }, [initialData]);

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index].text = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            questionType: 'MCQ',
            content: formData.content,
            cognitiveLevel: parseInt(formData.cognitiveLevel),
            data: {
                options: formData.options.map(({ id, ...rest }) => rest), // Send only text and label
                correctLabel: formData.correctLabel
            }
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung câu hỏi <span className="text-red-600">*</span>
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung câu hỏi..."
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức độ nhận thức <span className="text-red-600">*</span>
                </label>
                <select
                    value={formData.cognitiveLevel}
                    onChange={(e) => setFormData({ ...formData, cognitiveLevel: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                >
                    <option value={1}>1 - Biết</option>
                    <option value={2}>2 - Hiểu</option>
                    <option value={3}>3 - Vận dụng</option>
                </select>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    Các lựa chọn <span className="text-red-600">*</span>
                </label>
                {formData.options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="correct_option"
                            checked={formData.correctLabel === option.label}
                            onChange={() => setFormData({ ...formData, correctLabel: option.label })}
                            required
                            className="w-4 h-4 text-primary-800 focus:ring-primary-800"
                        />
                        <span className="text-sm font-medium text-gray-700 w-6">{option.label}.</span>
                        <input
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            placeholder={`Nhập nội dung đáp án ${option.label}`}
                            required
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                        />
                    </div>
                ))}
                <p className="text-xs text-gray-500">* Chọn radio button để đánh dấu đáp án đúng</p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit">
                    {initialData ? 'Cập nhật câu hỏi' : 'Lưu câu hỏi'}
                </Button>
            </div>
        </form>
    );
}
