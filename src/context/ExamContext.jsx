import { createContext, useContext, useState, useEffect } from 'react';
import storage from '../utils/storage';

const ExamContext = createContext();

export function ExamProvider({ children }) {
    const [studentExam, setStudentExam] = useState(null);
    const [session, setSession] = useState(null);
    const [examSnapshot, setExamSnapshot] = useState(null);
    const [answers, setAnswers] = useState({ mcq_answers: [], group_answers: [] });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(null); // in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedStudentExam = storage.getStudentExam();
        const savedAnswers = storage.getAnswers();
        const savedTime = storage.getTimeRemaining();
        const savedQuestion = storage.getCurrentQuestion();

        if (savedStudentExam) {
            setStudentExam(savedStudentExam);
            if (savedStudentExam.session) {
                setSession(savedStudentExam.session);
            }
            // Note: examSnapshot should be loaded from API on reconnect if needed
            setAnswers(savedAnswers);
            setCurrentQuestionIndex(savedQuestion);
            setTimeRemaining(savedTime);
        }
    }, []);

    // Auto-save answers every 30 seconds
    useEffect(() => {
        if (!examSnapshot) return;

        const interval = setInterval(() => {
            storage.saveAnswers(answers);
            storage.saveTimeRemaining(timeRemaining);
            storage.saveCurrentQuestion(currentQuestionIndex);
        }, 30000);

        return () => clearInterval(interval);
    }, [answers, timeRemaining, currentQuestionIndex, examSnapshot]);

    // Set student exam after login
    const loginStudent = (data) => {
        setStudentExam(data);
        if (data?.session) {
            setSession(data.session);
        }
        storage.saveStudentExam(data);
    };

    // Start exam with snapshot
    const startExam = (snapshot, sessionData) => {
        setExamSnapshot(snapshot);
        if (sessionData) {
            setSession(sessionData);
        }

        let seconds = 45 * 60; // Default fallback

        const activeSession = sessionData || session;
        if (activeSession && activeSession.endTime) {
            // Calculate remaining time based on Session End Time
            // This ensures everyone follows the global clock (e.g. if late, less time)
            const endTimestamp = new Date(activeSession.endTime).getTime();
            const now = Date.now();
            seconds = Math.max(0, Math.floor((endTimestamp - now) / 1000));
        } else if (activeSession && activeSession.durationMinutes) {
            seconds = activeSession.durationMinutes * 60;
        }

        setTimeRemaining(seconds);
        storage.saveTimeRemaining(seconds);
    };

    // Set answer for MCQ question
    const setMCQAnswer = (questionId, optionId) => {
        setAnswers(prev => {
            const newMCQAnswers = prev.mcq_answers.filter(a => a.question_id !== questionId);
            newMCQAnswers.push({ question_id: questionId, selected_option_id: optionId });

            const newAnswers = { ...prev, mcq_answers: newMCQAnswers };
            storage.saveAnswers(newAnswers);
            return newAnswers;
        });
    };

    // Set answer for True/False sub-question
    const setGroupAnswer = (questionId, subQuestionId, value) => {
        setAnswers(prev => {
            let groupAnswers = [...prev.group_answers];
            let groupAnswer = groupAnswers.find(a => a.question_id === questionId);

            if (!groupAnswer) {
                groupAnswer = { question_id: questionId, sub_answers: [] };
                groupAnswers.push(groupAnswer);
            }

            let subAnswer = groupAnswer.sub_answers.find(s => s.sub_question_id === subQuestionId);
            if (subAnswer) {
                subAnswer.selected = value;
            } else {
                groupAnswer.sub_answers.push({ sub_question_id: subQuestionId, selected: value });
            }

            const newAnswers = { ...prev, group_answers: groupAnswers };
            storage.saveAnswers(newAnswers);
            return newAnswers;
        });
    };

    // Navigate to question
    const navigateToQuestion = (index) => {
        setCurrentQuestionIndex(index);
        storage.saveCurrentQuestion(index);
    };

    // Get total question count
    const getTotalQuestions = () => {
        if (!examSnapshot) return 0;
        return (examSnapshot.part1_mcq?.length || 0) + (examSnapshot.part2_group?.length || 0);
    };

    // Get answered question count
    const getAnsweredCount = () => {
        if (!examSnapshot) return 0;

        const mcqCount = answers.mcq_answers.length;

        // Count group questions that are COMPLETELY answered
        const groupCount = examSnapshot.part2_group?.reduce((count, question) => {
            const groupAnswer = answers.group_answers.find(a => a.question_id === question.question_id);
            if (!groupAnswer) return count;

            const totalSubs = question.sub_questions?.length || 0;
            const answeredSubs = groupAnswer.sub_answers?.filter(s => s.selected !== undefined).length || 0;

            return count + (totalSubs > 0 && answeredSubs === totalSubs ? 1 : 0);
        }, 0) || 0;

        return mcqCount + groupCount;
    };

    // Clear exam data (after submission)
    const clearExamData = () => {
        storage.clearExamData();
        setStudentExam(null);
        setExamSnapshot(null);
        setAnswers({ mcq_answers: [], group_answers: [] });
        setCurrentQuestionIndex(0);
        setTimeRemaining(null);
    };

    const value = {
        studentExam,
        session,
        examSnapshot,
        answers,
        currentQuestionIndex,
        timeRemaining,
        isSubmitting,
        setTimeRemaining,
        setIsSubmitting,
        loginStudent,
        startExam,
        setMCQAnswer,
        setGroupAnswer,
        navigateToQuestion,
        getTotalQuestions,
        getAnsweredCount,
        clearExamData
    };

    return (
        <ExamContext.Provider value={value}>
            {children}
        </ExamContext.Provider>
    );
}

export function useExam() {
    const context = useContext(ExamContext);
    if (!context) {
        throw new Error('useExam must be used within ExamProvider');
    }
    return context;
}

export default ExamContext;
