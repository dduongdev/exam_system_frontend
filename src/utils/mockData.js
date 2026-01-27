// Mock data matching backend API format

export const mockLoginResponse = {
    id: 'student-exam-001',
    studentId: 'student-001',
    sessionId: 'session-001',
    accessCode: 'TEST2024',
    status: 'REGISTERED',
    student: {
        id: 'student-001',
        studentCode: '001',
        fullName: 'Nguyễn Văn A',
        className: '10A1'
    },
    session: {
        id: 'session-001',
        name: 'Kỳ thi Tin học THPT 2024 - Môn Tin học',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        durationMinutes: 45,
        status: 'ACTIVE'
    }
};

export const mockExamSnapshot = {
    part1_mcq: [
        {
            question_id: 'q1',
            original_question_id: 'orig-q1',
            content: 'Phím tắt Ctrl+C trong các ứng dụng soạn thảo văn bản thường dùng để làm gì?',
            cognitive_level: 1,
            options: [
                { id: 'opt-1a', text: 'Sao chép văn bản', display_label: 'A' },
                { id: 'opt-1b', text: 'Lưu văn bản', display_label: 'B' },
                { id: 'opt-1c', text: 'Cắt văn bản', display_label: 'C' },
                { id: 'opt-1d', text: 'Dán văn bản', display_label: 'D' }
            ]
        },
        {
            question_id: 'q2',
            original_question_id: 'orig-q2',
            content: 'Trong hệ điều hành Windows, phím tắt nào dùng để đổi tên file hoặc thư mục?',
            cognitive_level: 1,
            options: [
                { id: 'opt-2a', text: 'F1', display_label: 'A' },
                { id: 'opt-2b', text: 'F2', display_label: 'B' },
                { id: 'opt-2c', text: 'F3', display_label: 'C' },
                { id: 'opt-2d', text: 'F4', display_label: 'D' }
            ]
        },
        {
            question_id: 'q3',
            original_question_id: 'orig-q3',
            content: 'RAM là viết tắt của từ nào?',
            cognitive_level: 1,
            options: [
                { id: 'opt-3a', text: 'Read Access Memory', display_label: 'A' },
                { id: 'opt-3b', text: 'Random Access Memory', display_label: 'B' },
                { id: 'opt-3c', text: 'Run Application Memory', display_label: 'C' },
                { id: 'opt-3d', text: 'Rapid Access Memory', display_label: 'D' }
            ]
        },
        {
            question_id: 'q4',
            original_question_id: 'orig-q4',
            content: 'Thiết bị nào sau đây là thiết bị đầu vào của máy tính?',
            cognitive_level: 2,
            options: [
                { id: 'opt-4a', text: 'Màn hình', display_label: 'A' },
                { id: 'opt-4b', text: 'Máy in', display_label: 'B' },
                { id: 'opt-4c', text: 'Chuột', display_label: 'C' },
                { id: 'opt-4d', text: 'Loa', display_label: 'D' }
            ]
        },
        {
            question_id: 'q5',
            original_question_id: 'orig-q5',
            content: 'Trong Microsoft Word, định dạng .docx được giới thiệu từ phiên bản nào?',
            cognitive_level: 2,
            options: [
                { id: 'opt-5a', text: 'Word 2003', display_label: 'A' },
                { id: 'opt-5b', text: 'Word 2007', display_label: 'B' },
                { id: 'opt-5c', text: 'Word 2010', display_label: 'C' },
                { id: 'opt-5d', text: 'Word 2013', display_label: 'D' }
            ]
        },
        {
            question_id: 'q6',
            original_question_id: 'orig-q6',
            content: 'Giao thức nào sau đây được sử dụng để truyền tải trang web?',
            cognitive_level: 2,
            options: [
                { id: 'opt-6a', text: 'FTP', display_label: 'A' },
                { id: 'opt-6b', text: 'SMTP', display_label: 'B' },
                { id: 'opt-6c', text: 'HTTP', display_label: 'C' },
                { id: 'opt-6d', text: 'POP3', display_label: 'D' }
            ]
        },
        {
            question_id: 'q7',
            original_question_id: 'orig-q7',
            content: 'Trong Excel, hàm nào dùng để tính tổng các ô?',
            cognitive_level: 2,
            options: [
                { id: 'opt-7a', text: 'AVERAGE()', display_label: 'A' },
                { id: 'opt-7b', text: 'COUNT()', display_label: 'B' },
                { id: 'opt-7c', text: 'SUM()', display_label: 'C' },
                { id: 'opt-7d', text: 'MAX()', display_label: 'D' }
            ]
        },
        {
            question_id: 'q8',
            original_question_id: 'orig-q8',
            content: 'Ngôn ngữ lập trình nào sau đây là ngôn ngữ lập trình hướng đối tượng?',
            cognitive_level: 3,
            options: [
                { id: 'opt-8a', text: 'C', display_label: 'A' },
                { id: 'opt-8b', text: 'Pascal', display_label: 'B' },
                { id: 'opt-8c', text: 'Java', display_label: 'C' },
                { id: 'opt-8d', text: 'Assembly', display_label: 'D' }
            ]
        },
        {
            question_id: 'q9',
            original_question_id: 'orig-q9',
            content: 'Trong mạng máy tính, địa chỉ IP loại nào được sử dụng trong mạng nội bộ?',
            cognitive_level: 3,
            options: [
                { id: 'opt-9a', text: 'Public IP', display_label: 'A' },
                { id: 'opt-9b', text: 'Private IP', display_label: 'B' },
                { id: 'opt-9c', text: 'Static IP', display_label: 'C' },
                { id: 'opt-9d', text: 'Dynamic IP', display_label: 'D' }
            ]
        },
        {
            question_id: 'q10',
            original_question_id: 'orig-q10',
            content: 'Thuật toán nào sau đây có độ phức tạp O(n log n)?',
            cognitive_level: 3,
            options: [
                { id: 'opt-10a', text: 'Bubble Sort', display_label: 'A' },
                { id: 'opt-10b', text: 'Merge Sort', display_label: 'B' },
                { id: 'opt-10c', text: 'Selection Sort', display_label: 'C' },
                { id: 'opt-10d', text: 'Linear Search', display_label: 'D' }
            ]
        },
        {
            question_id: 'q11',
            original_question_id: 'orig-q11',
            content: 'Trong cơ sở dữ liệu quan hệ, khóa ngoại (Foreign Key) có chức năng gì?',
            cognitive_level: 3,
            options: [
                { id: 'opt-11a', text: 'Định danh duy nhất cho bản ghi', display_label: 'A' },
                { id: 'opt-11b', text: 'Liên kết giữa các bảng', display_label: 'B' },
                { id: 'opt-11c', text: 'Mã hóa dữ liệu', display_label: 'C' },
                { id: 'opt-11d', text: 'Sắp xếp dữ liệu', display_label: 'D' }
            ]
        },
        {
            question_id: 'q12',
            original_question_id: 'orig-q12',
            content: 'Phần mềm nào sau đây là hệ quản trị cơ sở dữ liệu?',
            cognitive_level: 3,
            options: [
                { id: 'opt-12a', text: 'Photoshop', display_label: 'A' },
                { id: 'opt-12b', text: 'MySQL', display_label: 'B' },
                { id: 'opt-12c', text: 'Visual Studio Code', display_label: 'C' },
                { id: 'opt-12d', text: 'Chrome', display_label: 'D' }
            ]
        }
    ],
    part2_group: [
        {
            question_id: 'g1',
            original_question_id: 'orig-g1',
            content: 'Xét các ứng dụng mạng xã hội sau. Hãy cho biết mỗi phát biểu sau là ĐÚNG hay SAI:',
            cognitive_level: 2,
            sub_questions: [
                { id: 'sub-1a', text: 'Facebook là mạng xã hội phổ biến nhất thế giới.', display_label: 'a' },
                { id: 'sub-1b', text: 'Zalo chỉ được sử dụng để gửi email.', display_label: 'b' },
                { id: 'sub-1c', text: 'Youtube là nền tảng chia sẻ video trực tuyến.', display_label: 'c' },
                { id: 'sub-1d', text: 'TikTok là mạng xã hội chỉ dành cho ảnh tĩnh.', display_label: 'd' }
            ]
        },
        {
            question_id: 'g2',
            original_question_id: 'orig-g2',
            content: 'Về các thiết bị phần cứng máy tính. Hãy cho biết mỗi phát biểu sau là ĐÚNG hay SAI:',
            cognitive_level: 2,
            sub_questions: [
                { id: 'sub-2a', text: 'CPU là bộ xử lý trung tâm của máy tính.', display_label: 'a' },
                { id: 'sub-2b', text: 'SSD nhanh hơn HDD trong việc đọc ghi dữ liệu.', display_label: 'b' },
                { id: 'sub-2c', text: 'RAM là bộ nhớ cố định, không bị mất khi tắt máy.', display_label: 'c' },
                { id: 'sub-2d', text: 'Card đồ họa (GPU) chỉ dùng để chơi game.', display_label: 'd' }
            ]
        },
        {
            question_id: 'g3',
            original_question_id: 'orig-g3',
            content: 'Về các giao thức mạng. Hãy cho biết mỗi phát biểu sau là ĐÚNG hay SAI:',
            cognitive_level: 3,
            sub_questions: [
                { id: 'sub-3a', text: 'HTTP là giao thức truyền tải siêu văn bản.', display_label: 'a' },
                { id: 'sub-3b', text: 'FTP được dùng để gửi email.', display_label: 'b' },
                { id: 'sub-3c', text: 'HTTPS là phiên bản bảo mật của HTTP.', display_label: 'c' },
                { id: 'sub-3d', text: 'SSH dùng để truy cập từ xa an toàn.', display_label: 'd' }
            ]
        },
        {
            question_id: 'g4',
            original_question_id: 'orig-g4',
            content: 'Về ngôn ngữ lập trình. Hãy cho biết mỗi phát biểu sau là ĐÚNG hay SAI:',
            cognitive_level: 3,
            sub_questions: [
                { id: 'sub-4a', text: 'Python là ngôn ngữ lập trình thông dịch.', display_label: 'a' },
                { id: 'sub-4b', text: 'C++ là ngôn ngữ lập trình mức cao nhất.', display_label: 'b' },
                { id: 'sub-4c', text: 'JavaScript chỉ chạy trên trình duyệt web.', display_label: 'c' },
                { id: 'sub-4d', text: 'SQL là ngôn ngữ truy vấn cơ sở dữ liệu.', display_label: 'd' }
            ]
        }
    ]
};

// Mock answers structure
export const mockAnswers = {
    mcq_answers: [
        { question_id: 'q1', selected_option_id: 'opt-1a' }
    ],
    group_answers: [
        {
            question_id: 'g1',
            sub_answers: [
                { sub_question_id: 'sub-1a', selected: true },
                { sub_question_id: 'sub-1b', selected: false },
                { sub_question_id: 'sub-1c', selected: true },
                { sub_question_id: 'sub-1d', selected: false }
            ]
        }
    ]
};
