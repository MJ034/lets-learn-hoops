import { useProgressSummary } from "../hooks/useProgressSummary";

export default function ProgressPage() {
  const { summary, loading, error } = useProgressSummary();

  if (loading) {
    return (
      <section className="progress-page" aria-live="polite">
        <p className="eyebrow">Progress</p>
        <h1>Loading your progress...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="progress-page">
        <p className="eyebrow">Progress</p>
        <h1>We could not load your progress.</h1>
        <p className="state-message error-message">{error}</p>
      </section>
    );
  }

  if (!summary) {
    return (
      <section className="progress-page">
        <p className="eyebrow">Progress</p>
        <h1>No progress found.</h1>
      </section>
    );
  }

  return (
    <main className="progress-page">
      <p className="eyebrow">Progress</p>
      <h1>Your learning progress</h1>

      <section className="progress-summary-card" aria-label="Lesson completion summary">
        <p className="progress-stat">
          <strong>{summary.lessonsCompleted}</strong> of <strong>{summary.totalLessons}</strong> lessons completed
          <span>({summary.completionPercentage}%)</span>
        </p>

        <div className="progress-bar" aria-label={`${summary.completionPercentage}% complete`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(Math.max(summary.completionPercentage, 0), 100)}%` }}
          />
        </div>
      </section>

      <section className="quiz-history-section">
        <h2>Quiz history</h2>

        {summary.quizHistory.length === 0 ? (
          <p className="state-message">No quizzes completed yet.</p>
        ) : (
          <div className="quiz-history-table-wrap">
            <table className="quiz-history-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Lesson</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {summary.quizHistory.map((entry) => (
                  <tr key={`${entry.quiz_title}-${entry.lesson_title}-${entry.completed_at}`}>
                    <td>{entry.quiz_title}</td>
                    <td>{entry.lesson_title}</td>
                    <td>
                      {entry.score}/{entry.total_questions}
                    </td>
                    <td>{new Date(entry.completed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}