import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { useLearningModule } from "../hooks/useLearningModule";

function withoutLeadingTitle(content: string) {
  return content.replace(/^\s*#\s+[^\n]+\n+/, "");
}

export default function LessonDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { module, loading, error } = useLearningModule(slug);

  if (loading) {
    return (
      <section className="lesson-detail-page" aria-live="polite">
        <p className="eyebrow">Lesson</p>
        <h1>Loading lesson...</h1>
      </section>
    );
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
    </article>
  );
}