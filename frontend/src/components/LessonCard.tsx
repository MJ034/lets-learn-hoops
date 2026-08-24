import { Link } from "react-router-dom";
import type { LearningModule } from "../types/learning";

type LessonCardProps = {
  module: LearningModule;
};

export default function LessonCard({ module }: LessonCardProps) {
  return (
    <article className="lesson-card">
      <Link to={`/learn/${module.slug}`}>
        <span className={`category-badge category-${module.category_slug}`}>
          {module.category_name}
        </span>
        <h2>{module.title}</h2>
        <div className="lesson-meta">
          {module.reading_time ? (
            <span className="meta-item meta-time">{module.reading_time} min read</span>
          ) : null}
          {module.fiba_rule_reference ? (
            <span className="meta-item meta-rule">{module.fiba_rule_reference}</span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}