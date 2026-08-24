import { useState } from "react";
import type { LearningModule } from "../types/learning";
import LessonCard from "./LessonCard";

type LessonListProps = {
  modules: LearningModule[];
};

const lessonsPerPage = 9;

export default function LessonList({ modules }: LessonListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(modules.length / lessonsPerPage);
  const activePage = Math.min(currentPage, totalPages);
  const firstLessonIndex = (activePage - 1) * lessonsPerPage;
  const visibleModules = modules.slice(firstLessonIndex, firstLessonIndex + lessonsPerPage);

  function goToPage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  return (
    <div className="lesson-browser">
      <div className="lesson-grid">
        {visibleModules.map((module) => (
          <LessonCard key={module.id} module={module} />
        ))}
      </div>
      {totalPages > 1 ? (
        <nav className="lesson-pagination" aria-label="Lesson pages">
          <p>
            Showing {firstLessonIndex + 1}-{Math.min(firstLessonIndex + lessonsPerPage, modules.length)} of {modules.length}
          </p>
          <div className="pagination-controls">
            <button type="button" aria-label="Previous page" disabled={activePage === 1} onClick={() => goToPage(activePage - 1)}>
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  className={activePage === page ? "active" : undefined}
                  type="button"
                  aria-current={activePage === page ? "page" : undefined}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              );
            })}
            <button type="button" aria-label="Next page" disabled={activePage === totalPages} onClick={() => goToPage(activePage + 1)}>
              &gt;
            </button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}