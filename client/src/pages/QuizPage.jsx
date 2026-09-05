import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, Clock, CheckCircle2, XCircle, ArrowLeft, ArrowRight, Award, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';
import Button from '../components/common/Button';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}`);
        if (res.success) {
          setQuiz(res.data);
          setTimeLeft((res.data.timeLimitMinutes || 15) * 60);
        }
      } catch (err) {
        console.error('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || result) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, result]);

  const handleOptionSelect = (qId, optionIdx) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || submitting || result) return;
    setSubmitting(true);

    const formattedAnswers = quiz.questions.map((q) => ({
      questionId: q._id,
      selectedOption: answers[q._id] !== undefined ? answers[q._id] : -1,
    }));

    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, {
        answers: formattedAnswers,
      });

      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      alert(err.message || 'Failed to process quiz submission');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading quiz questions...</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-xl font-bold font-outfit text-white">Quiz Unavailable</h2>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Quiz Header Bar */}
      <div className="p-6 glass-panel rounded-3xl border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 font-outfit">Assessment Engine</span>
          <h1 className="text-2xl font-bold font-outfit text-white">{quiz.title}</h1>
        </div>

        {!result && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm font-bold text-indigo-300">
            <Clock className="w-4 h-4 text-indigo-400 animate-pulse" /> Time Remaining: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      {/* QUIZ RESULTS VIEW */}
      {result ? (
        <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-6 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
            result.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}>
            {result.passed ? <Award className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>

          <div className="space-y-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
              result.passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {result.passed ? 'PASSED' : 'NEEDS IMPROVEMENT'}
            </span>
            <h2 className="text-3xl font-extrabold font-outfit text-white">Score: {result.score} / {result.totalMarks}</h2>
            <p className="text-sm text-slate-400">Passing Score Required: {result.passingScore}% ({result.percentage}% Achieved)</p>
          </div>

          {/* Detailed Question Review List */}
          <div className="text-left space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-bold font-outfit text-white">Question Breakdown</h3>
            {result.details?.map((detail, idx) => (
              <div key={idx} className="p-4 glass-card rounded-2xl border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-white text-sm">
                    {idx + 1}. {detail.questionText}
                  </div>
                  {detail.isCorrect ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold shrink-0">Correct +5</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold shrink-0">Incorrect</span>
                  )}
                </div>

                <div className="text-slate-400 space-y-1">
                  <div>Your Answer: <strong className="text-slate-200">{detail.selectedOption >= 0 ? detail.options[detail.selectedOption] : 'None'}</strong></div>
                  <div>Correct Answer: <strong className="text-emerald-400">{detail.options[detail.correctAnswerIndex]}</strong></div>
                  {detail.explanation && <div className="text-indigo-300 pt-1 italic">Explanation: {detail.explanation}</div>}
                </div>
              </div>
            ))}
          </div>

          <Button variant="primary" size="lg" onClick={() => navigate(-1)}>Return to Course</Button>
        </div>
      ) : (
        /* QUIZ TAKING INTERFACE */
        <div className="glass-panel p-8 rounded-3xl border-slate-800 space-y-6">
          
          {/* Question Stepper Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Question {currentQIndex + 1} of {quiz.questions.length}</span>
            <span>Marks: {currentQ.marks || 5}</span>
          </div>

          {/* Question Text */}
          <h3 className="text-xl font-bold font-outfit text-white">
            {currentQ.questionText}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options?.map((opt, oIdx) => (
              <button
                key={oIdx}
                type="button"
                onClick={() => handleOptionSelect(currentQ._id, oIdx)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between text-sm ${
                  answers[currentQ._id] === oIdx
                    ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{opt}</span>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  answers[currentQ._id] === oIdx ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
                }`}>
                  {answers[currentQ._id] === oIdx && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <Button
              variant="secondary"
              size="md"
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((i) => i - 1)}
              icon={ArrowLeft}
            >
              Previous
            </Button>

            {currentQIndex < quiz.questions.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setCurrentQIndex((i) => i + 1)}
                icon={ArrowRight}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="md"
                onClick={handleSubmitQuiz}
                disabled={submitting}
                icon={Sparkles}
              >
                {submitting ? 'Evaluating...' : 'Submit Quiz'}
              </Button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default QuizPage;
