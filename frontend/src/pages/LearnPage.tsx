import { useSearchParams } from "react-router-dom";
import LessonList from "../components/LessonList";
import { useLearningModules } from "../hooks/useLearningModules";

const categories = [
  { label: "Basketball Basics", slug: "basketball-basics" },
  { label: "Rules and Violations", slug: "rules-and-violations" },
  { label: "Fouls", slug: "fouls" },
  { label: "Positions", slug: "positions" },
  { label: "Offense", slug: "offense" },
  { label: "Defense", slug: "defense" },
  { label: "Skills Development", slug: "skills-development" },
];

export default function LearnPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const { modules, loading, error } = useLearningModules(category);

  function selectCategory(slug?: string) {
    setSearchParams(slug ? { category: slug } : {});
  }

  return (
    <section className="learn-page">
      <p className="eyebrow">Learning library</p>
      <h1>Know the game. See more on the court.</h1>
      <p className="home-intro">
        Browse short lessons by topic, then open a lesson for the full walkthrough.
      </p>
      <div className="category-filter" aria-label="Filter lessons by category">
        <button
          className={!category ? "active" : undefined}
          type="button"
          aria-pressed={!category}
          onClick={() => selectCategory()}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            className={category === item.slug ? "active" : undefined}
            key={item.slug}
            type="button"
            aria-pressed={category === item.slug}
            onClick={() => selectCategory(item.slug)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="state-message" aria-live="polite">Loading lessons...</p>
      ) : error ? (
        <p className="state-message error-message">{error}</p>
      ) : modules.length > 0 ? (
        <LessonList key={category ?? "all"} modules={modules} />
      ) : (
        <p className="state-message">No lessons found for this category.</p>
      )}
    </section>
  );
}