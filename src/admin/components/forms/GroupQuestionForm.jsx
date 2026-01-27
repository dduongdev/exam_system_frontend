import { useState } from 'react';
import Button from '../../../components/common/Button';

export default function GroupQuestionForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(initialData || {
        content: '',
        cognitiveLevel: 2,
        sub_questions: [
            { id: crypto.randomUUID(), text: '', label: 'a', is_correct: true },
            { id: crypto.randomUUID(), text: '', label: 'b', is_correct: false },
            { id: crypto.randomUUID(), text: '', label: 'c', is_correct: true },
            { id: crypto.randomUUID(), text: '', label: 'd', is_correct: false },
        ]
    });

    const handleSubQuestionChange = (index, field, value) => {
        const newSubs = [...formData.sub_questions];
        newSubs[index][field] = value;
        setFormData({ ...formData, sub_questions: newSubs });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            questionType: 'GROUP',
            content: formData.content,
            cognitiveLevel: parseInt(formData.cognitiveLevel),
            data: {
                sub_questions: formData.sub_questions
            }
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Câu dẫn <span className="text-red-600">*</span>
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập câu dẫn cho nhóm câu hỏi..."
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
                    Các câu hỏi con (Đúng/Sai) <span className="text-red-600">*</span>
                </label>
                <div className="border border-gray-200 rounded overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 w-12">#</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Nội dung</th>
                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 w-24">Đáp án</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {formData.sub_questions.map((sub, index) => (
                                <tr key={sub.id}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                        {sub.label}.
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            value={sub.text}
                                            onChange={(e) => handleSubQuestionChange(index, 'text', e.target.value)}
                                            placeholder={`Nhập nội dung câu ${sub.label}`}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <select
                                            value={sub.is_correct ? 'true' : 'false'}
                                            onChange={(e) => handleSubQuestionChange(index, 'is_correct', e.target.value === 'true')}
                                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-800"
                                        >
                                            <option value="true">Đúng</option>
                                            <option value="false">Sai</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit">
                    Lưu câu hỏi
                </Button>
            </div>
        </form>
    );
}
