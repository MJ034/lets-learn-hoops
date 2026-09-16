import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import { useLearningModule } from "../hooks/useLearningModule";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { markLessonComplete } from "../services/progress";
import { getQuizByModuleSlug } from "../services/quiz";
import type { Quiz } from "../types/quiz";

function withoutLeadingTitle(content: string) {
  return content.replace(/^\s*#\s+[^\n]+\n+/, "");
}

export default function LessonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { module, loading, error } = useLearningModule(slug);
  const { user } = useAuth();
  const [marking, setMarking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [markError, setMarkError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [completedQuizIds, setCompletedQuizIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!module) return;

    let isActive = true;
    const moduleSlug = module.slug;

    async function loadQuiz() {
      setQuiz(null);
      setQuizError(null);
      setQuizLoading(true);

      try {
        const response = await getQuizByModuleSlug(moduleSlug);
        if (isActive) setQuiz(response);
      } catch (err) {
        if (!isActive) return;

        if (err instanceof Error && err.message === "NO_QUIZ") {
          setQuiz(null);
        } else {
          setQuizError("Could not load quiz.");
        }
      } finally {
        if (isActive) setQuizLoading(false);
      }
    }

    loadQuiz();

    return () => {
      isActive = false;
    };
  }, [module]);


  if (loading) {
    return (
      <section className="lesson-detail-page" aria-live="polite">
        <p className="eyebrow">Lesson</p>
        <h1>Loading lesson...</h1>
      </section>
    );
  }

  async function handleMarkComplete() {
    if (!module) return;

    if (quizLoading) {
      setMarkError("Wait for the quiz check to finish before marking this lesson complete.");
      return;
    }

    if (quizError) {
      setMarkError("The quiz could not load, so this lesson cannot be marked complete yet.");
      return;
    }

    if (quiz && !completedQuizIds[quiz.id]) {
      setMarkError("Complete the quiz before marking this lesson complete.");
      return;
    }

    setMarkError(null);
    setMarking(true);

    try {
      await markLessonComplete(String(module.id));
      setCompleted(true);
    } catch {
      setMarkError("Could not mark this lesson complete. Please try again.");
    } finally {
      setMarking(false);
    }
  }

  if (error) {
    return (
      <section className="lesson-detail-page">
        <p className="eyebrow">Lesson</p>
        <h1>We could not load this lesson.</h1>
        <p className="state-message error-message">{error}</p>
        <Link className="secondary-link" to="/learn">Back to lessons</Link>
      </section>
    );
  }

  if (!module) {
    return (
      <section className="lesson-detail-page">
        <p className="eyebrow">Lesson not found</p>
        <h1>This lesson is not in the library.</h1>
        <p className="home-intro">Check the lesson URL or head back to the learning library.</p>
        <Link className="secondary-link" to="/learn">Back to lessons</Link>
      </section>
    );
  }

  const quizMustBeCompleted = Boolean(quiz && !completedQuizIds[quiz.id]);
  const completionBlocked = quizLoading || Boolean(quizError) || quizMustBeCompleted;
  const completionHint = quizLoading
    ? "Checking whether this lesson has a quiz..."
    : quizError
      ? "The quiz needs to load before this lesson can be completed."
      : quizMustBeCompleted
        ? "Complete the quiz before marking this lesson complete."
        : null;

  return (
    <article className="lesson-detail-page">
      <Link className="back-link" to="/learn">Back to lessons</Link>
      <span className="category-badge">{module.category_name}</span>
      <h1>{module.title}</h1>
      <div className="lesson-meta detail-meta">
        {module.reading_time ? <span>{module.reading_time} min read</span> : null}
        {module.fiba_rule_reference ? <span>FIBA: {module.fiba_rule_reference}</span> : null}
      </div>
      <div className="lesson-markdown">
        <ReactMarkdown>{withoutLeadingTitle(module.content)}</ReactMarkdown>
      </div>

      {quizLoading ? <p className="state-message">Loading quiz...</p> : null}
      {quizError ? <p className="state-message error-message">{quizError}</p> : null}
      {quiz ? (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onSubmitted={(result) => {
            setCompletedQuizIds((currentQuizIds) => ({ ...currentQuizIds, [result.quizId]: true }));
            setMarkError(null);
          }}
        />
      ) : null}

      {user ? (
        <section className="lesson-completion-panel" aria-live="polite">
          {completed ? (
            <p className="completion-success">Lesson completed.</p>
          ) : (
            <button type="button" onClick={handleMarkComplete} disabled={marking || completionBlocked}>
              {marking ? "Marking..." : "Mark as Complete"}
            </button>
          )}

          {completionHint ? <p className="completion-hint">{completionHint}</p> : null}
          {markError ? <p className="state-message error-message">{markError}</p> : null}
        </section>
      ) : (
        <section className="lesson-completion-panel guest-progress-panel" aria-live="polite">
          <div>
            <h2>Save your learning</h2>
            <p>Create an account to mark lessons complete, keep quiz scores, and build your progress history.</p>
          </div>
          <div className="guest-progress-actions">
            <Link className="primary-link" to="/register">Create account</Link>
            <Link className="secondary-link" to="/login">Log in</Link>
          </div>
        </section>
      )}
    </article>
  );
}