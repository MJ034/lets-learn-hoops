import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { reviewQuiz, submitQuiz } from "../services/quiz";
import type { Quiz, QuizResult, SubmitAnswer } from "../types/quiz";

type QuizCardProps = {
  quiz: Quiz;
  onSubmitted?: (result: QuizResult) => void;
};

export default function QuizCard({ quiz, onSubmitted }: QuizCardProps) {
  const { status } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function selectAnswer(questionId: string, answer: string) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: answer }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: SubmitAnswer[] = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));
      const response = status === "authenticated"
        ? await submitQuiz(quiz.id, payload)
        : await reviewQuiz(quiz.id, payload);
      setResult(response);
      onSubmitted?.(response);
    } catch (err) {
      const message = err instanceof Error && err.message === "AUTH_REQUIRED"
        ? "Log in to submit this quiz and save your score."
        : "Could not submit quiz. Please try again.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const allAnswered = quiz.questions.every((question) => answers[question.id]);
  const authReady = status !== "idle" && status !== "loading";
  const canSubmit = allAnswered && !submitting && authReady;
  const isGuest = status === "unauthenticated";

  return (
    <section className="quiz-card" aria-labelledby="lesson-quiz-title">
      <div className="quiz-card-header">
        <p className="eyebrow">Quiz</p>
        <h2 id="lesson-quiz-title">{quiz.title}</h2>
      </div>

      <div className="quiz-question-list">
        {quiz.questions.map((question, questionIndex) => {
          const review = result?.answers.find((answer) => answer.questionId === question.id);

          return (
            <fieldset className="quiz-question" key={question.id} disabled={Boolean(result)}>
              <legend>
                <span>Question {questionIndex + 1}</span>
                {question.question}
              </legend>

              <div className="quiz-options">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option;
                  const isCorrect = review?.correctAnswer === option;
                  const isWrongSelection = Boolean(result && selected && !isCorrect);
                  const optionClassName = [
                    "quiz-option",
                    selected ? "selected" : "",
                    result && isCorrect ? "correct" : "",
                    isWrongSelection ? "incorrect" : "",
                  ].filter(Boolean).join(" ");

                  return (
                    <label className={optionClassName} key={option}>
                      <input
                        type="radio"
                        name={`quiz-question-${question.id}`}
                        value={option}
                        checked={selected}
                        onChange={() => selectAnswer(question.id, option)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      {result ? (
        <div className="quiz-result" aria-live="polite">
          <p>
            Score: <strong>{result.score}</strong> / <strong>{result.totalQuestions}</strong>
          </p>
          <ul>
            {quiz.questions.map((question) => {
              const review = result.answers.find((answer) => answer.questionId === question.id);

              return (
                <li key={question.id}>
                  <span>{question.question}</span>
                  <strong>Correct answer: {review?.correctAnswer}</strong>
                </li>
              );
            })}
          </ul>
          {isGuest ? (
            <div className="quiz-save-prompt">
              <p>This score is temporary. Create an account to save quiz history and track completed lessons.</p>
              <div>
                <Link className="primary-link" to="/register">Create account</Link>
                <Link className="secondary-link" to="/login">Log in</Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="quiz-actions">
          {isGuest ? (
            <p className="state-message quiz-auth-message">
              You can check your answers now. Create an account to save the score.
            </p>
          ) : null}
          <button type="button" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? "Checking..." : status === "authenticated" ? "Submit quiz" : "Check answers"}
          </button>
        </div>
      )}

      {submitError ? <p className="state-message error-message">{submitError}</p> : null}
    </section>
  );
}