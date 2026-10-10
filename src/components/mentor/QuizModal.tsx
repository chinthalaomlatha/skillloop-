import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Award, RotateCcw } from 'lucide-react';
import { Quiz, QuizQuestion } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { store } from '../../lib/store';

export interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  onPassed?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, quiz, onPassed }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setIsSubmitted(true);

    // Save attempt to store
    store.submitQuizAttempt({
      quiz_id: quiz.id,
      user_id: store.getState().currentUser?.id || 'u-maya',
      score,
      total_questions: quiz.questions.length,
      answers: selectedAnswers,
      ai_feedback: `Completed with ${score}/${quiz.questions.length} correct answers.`,
    });

    if (score === quiz.questions.length && onPassed) {
      onPassed();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quiz.title}
      description="Test your conceptual retention before your peer exchange session"
      maxWidth="lg"
    >
      {/* Honesty Notice (§8 & §17: AI assessments are not certifications) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-slate-700">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          <strong>Formative Practice Notice:</strong> This AI self-assessment is designed solely to identify personal learning gaps and prepare for peer exchange sessions. It does not represent an official certification or accredited credential.
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctAnswerIndex;

          return (
            <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{q.question}</h4>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-7">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                  if (userChoice === optIdx) {
                    optStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium';
                  }

                  if (isSubmitted) {
                    if (optIdx === q.correctAnswerIndex) {
                      optStyle = 'border-emerald-600 bg-emerald-100/70 text-emerald-950 font-bold';
                    } else if (userChoice === optIdx && !isCorrect) {
                      optStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                    } else {
                      optStyle = 'opacity-60 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && optIdx === q.correctAnswerIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isSubmitted && userChoice === optIdx && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="pl-7 pt-1 text-xs text-slate-600">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] leading-relaxed">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result summary or submit button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {isSubmitted ? (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>
              Your Score: {score} / {quiz.questions.length} ({Math.round((score / quiz.questions.length) * 100)}%)
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-500">
            Answer all {quiz.questions.length} questions to check your score
          </span>
        )}

        <div className="flex items-center gap-2">
          {isSubmitted ? (
            <>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retake
              </Button>
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={!allAnswered}
              onClick={handleSubmit}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
